
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { TransactionService, AlgorandTransaction } from "@/lib/transactionService";
import { useWallet } from "@/contexts/WalletProvider";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const DashboardHistory = () => {
  const { account } = useWallet();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [walletTransactions, setWalletTransactions] = useState<AlgorandTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const txServiceRef = useRef<TransactionService | null>(null);

  // instantiate the TransactionService once
  useEffect(() => {
    txServiceRef.current = new TransactionService();
  }, []);

  const fetchWalletTransactions = useCallback(async () => {
    if (!account) {
      setLoading(false);
      return;
    }

    if (!txServiceRef.current) txServiceRef.current = new TransactionService();

    setLoading(true);
    try {
      const txs = await txServiceRef.current.getAccountTransactions(account, 10);
      setWalletTransactions(txs);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setWalletTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchWalletTransactions();
  }, [fetchWalletTransactions]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 5000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return 'N/A';
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Wallet Transaction History</h2>
            <p className="text-muted-foreground">Real-time blockchain transactions from your wallet</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Live • {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Connected Wallet: {account ? `${account.slice(0, 8)}...${account.slice(-6)}` : 'Not connected'}
            </div>
            <Button variant="outline" size="sm" onClick={fetchWalletTransactions} disabled={!account}>
              Refresh
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search transactions..." className="pl-10" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Amount (ALGO)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Gas Used</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">Loading wallet transactions...</TableCell>
                    </TableRow>
                  ) : walletTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">{account ? 'No transactions found' : 'Please connect your wallet to view transactions'}</TableCell>
                    </TableRow>
                  ) : (
                    walletTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-sm">{tx.timestamp}</TableCell>
                        <TableCell>
                          <Badge variant={tx.type === 'received' ? 'secondary' : 'outline'} className="text-xs">{tx.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <div className="font-medium text-base">{formatAddress(tx.receiver)}</div>
                            <div className="text-sm text-muted-foreground mt-1">{tx.note || 'Algorand transaction'}</div>
                          </div>
                        </TableCell>
                        <TableCell className={`font-medium text-sm ${tx.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>{tx.type === 'received' ? '+' : '-'}{tx.amount.toFixed(6)}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="text-xs bg-green-100 text-green-800">{tx.status}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{tx.fees.toFixed(6)}</TableCell>
                        <TableCell className="text-sm max-w-64 truncate" title={tx.note}>{tx.note}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </section>

      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default DashboardHistory;
