import { PeraWalletConnect } from '@perawallet/connect';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { APP_CONFIG } from '@/lib/config';

interface WalletContextType {
  wallet: PeraWalletConnect;
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

const walletToUsername: { [key: string]: string } = {
  '3IE6PIUGCN62JKKXCTWHSAFCHXSTNPIIL4D5VQFPNGWU4B5UWWKL5V7AM4': 'Panendra',
  'XG2SGTDHQMMGZECHVU3CH3WXFBLLDNYJIAZ3C2VOGP774IYJMNJ4MEDWAY': 'Private User',
  'OFDV5E5ZTP45MHXCQQ5EHIXAKIJ2BXGMFAAYU6Z2NG4MZTNCB3BOYXIBSQ': 'United Nations',
  'DYT6HEX5FQY7F26E3CUIRUFP6RQKKXKOMZLXUW5FKITZE74YJWTFNTWDPU': 'Asha Foundation',
  'J7LJIQ7JK3Q6OWMUSW6DWIYC3HRNLSXGL5KQ5TFJXILFKXDURSE2PSAFOI': 'MB Foundation'
};

export function AlgoWalletProvider({ children }: { children: ReactNode }) {
  const [wallet] = useState(() => new PeraWalletConnect({
    shouldShowSignTxnToast: true,
    chainId: APP_CONFIG.algorand.chainId
  }));
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Reconnect on page load
    const reconnect = async () => {
      try {
        const accounts = await wallet.reconnectSession();
        if (accounts && accounts.length > 0) {
          const connectedAccount = accounts[0];
          setAccount(connectedAccount);
          setIsConnected(true);
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAccount', connectedAccount);
          
          // Set username based on wallet address
          const username = walletToUsername[connectedAccount] || 'Wallet User';
          localStorage.setItem('userName', username);
        }
      } catch (error) {
        console.error('Reconnection failed:', error);
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAccount');
      }
    };

    // Check if wallet was previously connected
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected) {
      reconnect();
    }

    // Listen for disconnect events
    const handleDisconnect = () => {
      setAccount(null);
      setIsConnected(false);
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAccount');
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
        duration: 3000,
      });
    };

    wallet.connector?.on('disconnect', handleDisconnect);

    // Clean up on unmount
    return () => {
      wallet.connector?.off('disconnect', handleDisconnect);
    };
  }, [wallet]);

  const connect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      const accounts = await wallet.connect();
      if (accounts && accounts.length > 0) {
        const connectedAccount = accounts[0];
        setAccount(connectedAccount);
        setIsConnected(true);
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAccount', connectedAccount);
        
        // Set username based on wallet address
        const username = walletToUsername[connectedAccount] || 'Wallet User';
        localStorage.setItem('userName', username);
        
        toast({
          title: "Connected",
          description: `Wallet connected successfully as ${username}`,
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('Connection failed:', error);
      let errorMessage = "Failed to connect wallet. Please try again.";
      
      if (error?.message?.includes('User rejected')) {
        errorMessage = "Connection cancelled by user";
      } else if (error?.message?.includes('No wallet')) {
        errorMessage = "Please install Pera Wallet to continue";
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await wallet.disconnect();
      setAccount(null);
      setIsConnected(false);
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletAccount');
      toast({
        title: "Disconnected",
        description: "Wallet disconnected successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Disconnection failed:', error);
      toast({
        title: "Disconnection Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <WalletContext.Provider value={{
      wallet,
      account,
      isConnected,
      isConnecting,
      connect,
      disconnect
    }}>
      {children}
    </WalletContext.Provider>
  );
}
