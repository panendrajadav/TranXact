import { Button } from './ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletProvider';

export function WalletConnect() {
  const { account, isConnected, isConnecting, connect, disconnect } = useWallet();

  if (isConnected && account) {
    return (
      <div className="flex items-center justify-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
        <Button 
          variant="outline" 
          onClick={disconnect} 
          size="sm"
          className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={connect} 
      disabled={isConnecting}
      className="w-full flex items-center justify-center gap-3 py-6 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}