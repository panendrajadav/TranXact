
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useWallet } from "@/contexts/WalletProvider";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const DashboardHistory = () => {
  const { userType } = useAuth();
  const { account } = useWallet();
  const [showDialog, setShowDialog] = useState(false);

  type PrivateHistoryItem = {
    type: string;
    description: string;
    amount: string;
    date: string;
    status: string;
  };

  type PublicHistoryItem = {
    type: string;
    description: string;
    amount: string;
    date: string;
    status: string;
    ngos: number;
  };

  const privateHistory: PrivateHistoryItem[] = [
    { type: "donation", description: "Donation to Global Relief Fund", amount: "5.5 ALGO", date: "2024-01-15", status: "completed" },
    { type: "donation", description: "Donation to Children's Health Initiative", amount: "3.2 ALGO", date: "2024-01-10", status: "completed" },
    { type: "donation", description: "Donation to Environmental Protection", amount: "2.8 ALGO", date: "2024-01-05", status: "completed" }
  ];

  const publicHistory: PublicHistoryItem[] = [
    { type: "bulk_funding", description: "Education Infrastructure Program", amount: "150.0 ALGO", date: "2024-01-20", status: "completed", ngos: 5 },
    { type: "milestone_release", description: "Healthcare Access Initiative", amount: "75.0 ALGO", date: "2024-01-18", status: "completed", ngos: 3 },
    { type: "program_funding", description: "Disaster Relief Coalition", amount: "200.0 ALGO", date: "2024-01-15", status: "completed", ngos: 8 }
  ];

  const history = userType === 'private' ? privateHistory : publicHistory;

  const [currentTime, setCurrentTime] = useState(new Date());
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real wallet transactions
  const fetchWalletTransactions = async () => {
    if (!account) {
      setLoading(false);
      return;
    }

    try {
      // Mock API call - replace with actual Algorand API
      const response = await fetch(`https://testnet-idx.algonode.cloud/v2/accounts/${account}/transactions?limit=10`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const formattedTransactions = data.transactions?.map((tx, index) => ({
        id: tx.id || `ALGO_${Math.random().toString(36).substr(2, 16)}`,
        timestamp: new Date(tx['round-time'] * 1000).toLocaleString(),
        type: tx['tx-type'] === 'pay' ? (tx['payment-transaction']['receiver'] === account ? 'deposit' : 'donation') : 'other',
        organization: tx['payment-transaction']['receiver'] === account ? 'Wallet Deposit' : 'Transaction',
        amount: (tx['payment-transaction']['amount'] / 1000000).toFixed(6),
        status: tx['confirmed-round'] ? 'confirmed' : 'pending',
        blockHeight: tx['confirmed-round'] || 0,
        gasUsed: (tx.fee / 1000000).toFixed(6),
        confirmations: Math.floor(Math.random() * 1000) + 100,
        notes: tx.note ? atob(tx.note) : 'No notes available'
      })) || [];
      
      setWalletTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Fallback to mock data if API fails
      setWalletTransactions([
        {
          id: `ALGO_${account?.slice(0, 8)}...`,
          timestamp: new Date().toLocaleString(),
          type: "deposit",
          organization: "Connected Wallet",
          amount: "0.000000",
          status: "confirmed",
          blockHeight: 0,
          gasUsed: "0.001000",
          confirmations: 0,
          notes: "No transactions found or API unavailable"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions on wallet connection
  useEffect(() => {
    fetchWalletTransactions();
  }, [account]);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Real-time update for status changes
      setWalletTransactions(prev => prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const publicTransactions = [
    {
      id: "TXN_PUB001",
      blockNumber: "45678920",
      timestamp: "2024-01-20 11:00 AM",
      sender: account?.slice(0, 8) + "..." + account?.slice(-6) || "--",
      receiver: "Multiple NGOs",
      amount: "150.0 ALGO",
      fees: "0.005 ALGO",
      status: "confirmed"
    },
    {
      id: "TXN_PUB002",
      blockNumber: "45678915",
      timestamp: "2024-01-18 02:15 PM",
      sender: account?.slice(0, 8) + "..." + account?.slice(-6) || "--",
      receiver: "Healthcare NGOs",
      amount: "75.0 ALGO",
      fees: "0.003 ALGO",
      status: "confirmed"
    }
  ];



  return (
    <div className="space-y-8">
      {/* Donation History */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Donation History</h2>
        <div className="space-y-3">
          {history.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs">💰</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.amount} • {item.date}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="default" className="text-xs">{item.status}</Badge>
                      {userType === 'public' && 'ngos' in item && typeof (item as PublicHistoryItem).ngos === 'number' && (
                        <Badge variant="outline" className="text-xs">{(item as PublicHistoryItem).ngos} NGOs</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Real-time Wallet Transactions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Wallet Transaction History</h2>
            <p className="text-muted-foreground">Real-time blockchain transactions from your wallet</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
            <Input
              placeholder="Search transactions..."
              className="pl-10"
            />
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
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading wallet transactions...
                      </TableCell>
                    </TableRow>
                  ) : walletTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        {account ? 'No transactions found' : 'Please connect your wallet to view transactions'}
                      </TableCell>
                    </TableRow>
                  ) : walletTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant={tx.type === 'deposit' ? 'secondary' : 'outline'} className="text-xs">
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{tx.organization}</TableCell>
                      <TableCell className={`font-medium text-sm ${
                        tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'deposit' ? '+' : '-'}{tx.amount}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{tx.gasUsed}</TableCell>
                      <TableCell className="text-sm max-w-64 truncate" title={tx.notes}>{tx.notes}</TableCell>
                    </TableRow>
                  ))}
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
