import algosdk from 'algosdk';
import { APP_CONFIG } from './config';

export interface AlgorandTransaction {
  id: string;
  blockNumber: number;
  timestamp: string;
  sender: string;
  receiver: string;
  amount: number;
  fees: number;
  status: 'confirmed' | 'pending' | 'failed';
  note?: string;
  type: string;
}

export class TransactionService {
  private indexerClient: algosdk.Indexer;

  constructor() {
    const config = APP_CONFIG.algorand.useTestNet 
      ? {
          server: 'https://testnet-idx.algonode.cloud',
          port: 443,
          token: ''
        }
      : {
          server: 'https://mainnet-idx.algonode.cloud', 
          port: 443,
          token: ''
        };

    this.indexerClient = new algosdk.Indexer(
      config.token,
      config.server,
      config.port
    );
  }

  async getAccountTransactions(address: string, limit: number = 50): Promise<AlgorandTransaction[]> {
    try {
      const response = await this.indexerClient
        .lookupAccountTransactions(address)
        .limit(limit)
        .do();

      return response.transactions.map((tx: any) => this.formatTransaction(tx, address));
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      return [];
    }
  }

  private formatTransaction(tx: any, userAddress: string): AlgorandTransaction {
    const isOutgoing = tx.sender === userAddress;
    const amount = tx['payment-transaction']?.amount || 0;
    const fee = tx.fee || 0;
    
    return {
      id: tx.id,
      blockNumber: tx['confirmed-round'] || 0,
      timestamp: this.formatTimestamp(tx['round-time']),
      sender: tx.sender,
      receiver: tx['payment-transaction']?.receiver || 'N/A',
      amount: amount / 1_000_000, // Convert microAlgos to ALGO
      fees: fee / 1_000_000,
      status: tx['confirmed-round'] ? 'confirmed' : 'pending',
      note: tx.note ? this.decodeNote(tx.note) : undefined,
      type: isOutgoing ? 'sent' : 'received'
    };
  }

  private formatTimestamp(roundTime: number): string {
    if (!roundTime) return 'Unknown';
    const date = new Date(roundTime * 1000);
    return date.toLocaleString();
  }

  private decodeNote(note: string): string {
    try {
      return Buffer.from(note, 'base64').toString('utf-8');
    } catch {
      return note;
    }
  }

  getExplorerUrl(txId: string): string {
    const baseUrl = APP_CONFIG.algorand.useTestNet 
      ? 'https://testnet.algoexplorer.io/tx/'
      : 'https://algoexplorer.io/tx/';
    return `${baseUrl}${txId}`;
  }
}