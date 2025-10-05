import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  Calendar,
  TrendingUp,
  Clock,
  Loader2
} from "lucide-react";
import { useWallet } from "@/contexts/WalletProvider";
import { TransactionService, AlgorandTransaction } from "@/lib/transactionService";

export const HistoryTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState<AlgorandTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { account } = useWallet();
  const transactionService = new TransactionService();

  useEffect(() => {
    if (account) {
      fetchTransactions();
    }
  }, [account]);

  const fetchTransactions = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      const txs = await transactionService.getAccountTransactions(account, 100);
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatAddress = (address: string) => {
    if (address.length <= 20) return address;
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  };

  const openExplorer = (txId: string) => {
    window.open(transactionService.getExplorerUrl(txId), '_blank');
  };

  const getThisMonthCount = () => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    return transactions.filter(tx => {
      const txDate = new Date(tx.timestamp);
      return txDate.getMonth() === thisMonth && txDate.getFullYear() === thisYear;
    }).length;
  };

  const getSuccessRate = () => {
    if (transactions.length === 0) return '0%';
    const confirmed = transactions.filter(tx => tx.status === 'confirmed').length;
    return `${Math.round((confirmed / transactions.length) * 100)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "sent":
        return "bg-red-50 text-red-700 border-red-200";
      case "received":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Transaction History</h2>
          <p className="text-lg text-muted-foreground">Complete record of your donation transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="text-base">
            <Filter className="h-5 w-5 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="text-base">
            <Download className="h-5 w-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-muted-foreground">Total Transactions</p>
                <p className="text-3xl font-bold text-primary">{transactions.length}</p>
              </div>
              <Clock className="h-10 w-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold text-success">{getThisMonthCount()}</p>
              </div>
              <Calendar className="h-10 w-10 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-info">{getSuccessRate()}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-2xl">Transaction Details</CardTitle>
          <CardDescription className="text-base">Search and filter your donation history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID, sender, or receiver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-base py-3"
              />
            </div>
            <Button onClick={fetchTransactions} disabled={loading || !account} className="text-base">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Refresh
            </Button>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-4 text-base font-semibold text-muted-foreground">Transaction ID</th>
                  <th className="text-left py-4 text-base font-semibold text-muted-foreground">Timestamp</th>
                  <th className="text-left py-4 text-base font-semibold text-muted-foreground">Receiver</th>
                  <th className="text-right py-4 text-base font-semibold text-muted-foreground">Amount</th>
                  <th className="text-center py-4 text-base font-semibold text-muted-foreground">Block</th>
                  <th className="text-center py-4 text-base font-semibold text-muted-foreground">Status</th>
                  <th className="text-center py-4 text-base font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-base text-muted-foreground">Loading transactions...</p>
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <p className="text-base text-muted-foreground">
                        {account ? 'No transactions found' : 'Connect wallet to view transactions'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                      <td className="py-5 text-base font-mono">
                        <div className="flex items-center gap-2">
                          {formatAddress(transaction.id)}
                          <Badge variant="outline" className={`${getTypeColor(transaction.type)} text-xs`}>
                            {transaction.type.toUpperCase()}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-5 text-base text-muted-foreground">{transaction.timestamp}</td>
                      <td className="py-5">
                        <div>
                          <div className="font-medium text-base">{formatAddress(transaction.receiver)}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {transaction.note || 'Algorand transaction'}
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-base font-semibold text-right">
                        <span className={transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'}>
                          {transaction.type === 'sent' ? '-' : '+'}{transaction.amount.toFixed(6)} ALGO
                        </span>
                      </td>
                      <td className="py-5 text-center">
                        <Badge variant="outline" className="text-sm px-3 py-1">
                          Block #{transaction.blockNumber}
                        </Badge>
                      </td>
                      <td className="py-5 text-center">
                        <Badge variant={getStatusColor(transaction.status) as any} className="text-sm px-3 py-1">
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="py-5 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-base"
                          onClick={() => openExplorer(transaction.id)}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No transactions found matching your search.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-8">
            <p className="text-base text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" className="text-base" disabled>
                Previous
              </Button>
              <Button variant="outline" className="text-base" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};