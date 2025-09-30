import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';

export interface TransactionParams {
  from: string;
  to: string;
  amount: number; // in microAlgos (1 ALGO = 1,000,000 microAlgos)
  note?: string;
}

// Algorand network configuration
const ALGORAND_CONFIG = {
  // TestNet configuration (use for development)
  testnet: {
    server: 'https://testnet-api.algonode.cloud',
    port: 443,
    token: '',
    indexerServer: 'https://testnet-idx.algonode.cloud',
    indexerPort: 443,
    indexerToken: ''
  },
  // MainNet configuration (use for production)
  mainnet: {
    server: 'https://mainnet-api.algonode.cloud',
    port: 443,
    token: '',
    indexerServer: 'https://mainnet-idx.algonode.cloud',
    indexerPort: 443,
    indexerToken: ''
  }
};

export class AlgorandService {
  private wallet: PeraWalletConnect;
  private algodClient: algosdk.Algodv2;
  private indexerClient: algosdk.Indexer;
  private isTestNet: boolean;

  constructor(wallet: PeraWalletConnect, useTestNet: boolean = true) {
    this.wallet = wallet;
    this.isTestNet = useTestNet;
    
    const config = useTestNet ? ALGORAND_CONFIG.testnet : ALGORAND_CONFIG.mainnet;
    
    this.algodClient = new algosdk.Algodv2(
      config.token,
      config.server,
      config.port
    );
    
    this.indexerClient = new algosdk.Indexer(
      config.indexerToken,
      config.indexerServer,
      config.indexerPort
    );
  }

  // Convert ALGO to microAlgos
  static algoToMicroAlgos(algo: number): number {
    return Math.round(algo * 1_000_000);
  }

  // Convert microAlgos to ALGO
  static microAlgosToAlgo(microAlgos: number): number {
    return microAlgos / 1_000_000;
  }

  // Create and sign a payment transaction
  async sendPayment(params: TransactionParams): Promise<string> {
    try {
      // Get suggested transaction parameters
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      // Create the payment transaction
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: params.from,
        to: params.to,
        amount: params.amount,
        note: params.note ? new Uint8Array(Buffer.from(params.note)) : undefined,
        suggestedParams
      });

      // Sign the transaction with Pera Wallet
      const signedTxns = await this.wallet.signTransaction([[{
        txn: txn,
        signers: [params.from]
      }]]);
      
      // Submit the transaction
      const { txId } = await this.algodClient.sendRawTransaction(signedTxns[0]).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      return txId;
    } catch (error: any) {
      console.error('Transaction failed:', error);
      
      if (error.message?.includes('cancelled')) {
        throw new Error('Transaction was cancelled by user');
      } else if (error.message?.includes('insufficient')) {
        throw new Error('Insufficient balance for transaction');
      } else if (error.message?.includes('invalid')) {
        throw new Error('Invalid transaction parameters');
      }
      
      throw new Error('Failed to send transaction: ' + (error.message || 'Unknown error'));
    }
  }

  // Get account balance
  async getBalance(address: string): Promise<number> {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      const amount = typeof accountInfo.amount === 'bigint' ? Number(accountInfo.amount) : accountInfo.amount;
      return AlgorandService.microAlgosToAlgo(amount);
    } catch (error: any) {
      console.error('Failed to get balance:', error);
      
      if (error.status === 404) {
        throw new Error('Account not found on the network');
      }
      
      throw new Error('Failed to get account balance: ' + (error.message || 'Network error'));
    }
  }

  // Wait for transaction confirmation
  private async waitForConfirmation(txId: string): Promise<void> {
    const timeout = 10; // 10 rounds
    let lastRound = (await this.algodClient.status().do())['last-round'];
    
    for (let i = 0; i < timeout; i++) {
      const pendingInfo = await this.algodClient.pendingTransactionInformation(txId).do();
      
      if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
        return;
      }
      
      lastRound++;
      await this.algodClient.statusAfterBlock(lastRound).do();
    }
    
    throw new Error('Transaction confirmation timeout');
  }

  // Validate Algorand address
  static isValidAddress(address: string): boolean {
    try {
      return algosdk.isValidAddress(address);
    } catch {
      return false;
    }
  }

  // Get network status
  async getNetworkStatus(): Promise<{ network: string; status: string }> {
    try {
      const status = await this.algodClient.status().do();
      return {
        network: this.isTestNet ? 'TestNet' : 'MainNet',
        status: 'Connected'
      };
    } catch (error) {
      return {
        network: this.isTestNet ? 'TestNet' : 'MainNet',
        status: 'Disconnected'
      };
    }
  }
}

// Demo NGO wallet addresses (TestNet addresses)
// Replace with actual NGO addresses when deploying
export const NGO_WALLETS = {
  'global-relief': '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q',
  'childrens-health': '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q',
  'environmental-protection': '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q',
  'animal-welfare': '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q',
  'disaster-relief': '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q'
} as const;