import React, { useState } from 'react';
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
  Clock
} from "lucide-react";

export const HistoryTab = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock transaction data
  const transactions = [
    {
      id: "TXN001234567",
      timestamp: "2024-01-15 14:30:25",
      sender: "You",
      receiver: "Clean Water Initiative",
      amount: 250.00,
      status: "Completed",
      category: "Health",
      impact: "Provided clean water for 25 people"
    },
    {
      id: "TXN001234566",
      timestamp: "2024-01-10 09:15:10",
      sender: "You", 
      receiver: "Education For All",
      amount: 500.00,
      status: "Completed",
      category: "Education",
      impact: "Sponsored 2 children's education for 6 months"
    },
    {
      id: "TXN001234565",
      timestamp: "2024-01-05 16:45:33",
      sender: "You",
      receiver: "Food Bank Network",
      amount: 150.00,
      status: "Completed",
      category: "Food Security",
      impact: "Fed 30 families for a week"
    },
    {
      id: "TXN001234564",
      timestamp: "2023-12-28 11:20:18",
      sender: "You",
      receiver: "Green Earth Foundation",
      amount: 300.00,
      status: "Completed",
      category: "Environment",
      impact: "Planted 150 trees in deforested areas"
    },
    {
      id: "TXN001234563",
      timestamp: "2023-12-20 13:55:42",
      sender: "You",
      receiver: "Medical Aid International",
      amount: 750.00,
      status: "Completed",
      category: "Health",
      impact: "Provided medical supplies for rural clinic"
    },
    {
      id: "TXN001234562",
      timestamp: "2023-12-15 10:30:07",
      sender: "You",
      receiver: "Children's Learning Center",
      amount: 425.00,
      status: "Completed",
      category: "Education",
      impact: "Purchased learning materials for 50 students"
    },
    {
      id: "TXN001234561",
      timestamp: "2023-12-10 08:45:15",
      sender: "You",
      receiver: "Disaster Relief Fund",
      amount: 1000.00,
      status: "Completed",
      category: "Emergency",
      impact: "Emergency shelter for 20 families"
    },
    {
      id: "TXN001234560",
      timestamp: "2023-12-01 15:20:30",
      sender: "You",
      receiver: "Wildlife Conservation",
      amount: 200.00,
      status: "Completed",
      category: "Environment",
      impact: "Protected 5 acres of wildlife habitat"
    }
  ];

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Education":
        return "bg-primary/10 text-primary";
      case "Health":
        return "bg-success/10 text-success";
      case "Environment":
        return "bg-info/10 text-info";
      case "Emergency":
        return "bg-destructive/10 text-destructive";
      case "Food Security":
        return "bg-accent/10 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
          <p className="text-muted-foreground">Complete record of your donation transactions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
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
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-primary">{transactions.length}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-success">3</p>
              </div>
              <Calendar className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-info">100%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>Search and filter your donation history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by organization, transaction ID, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Transaction ID</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Timestamp</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Receiver</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-center py-3 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-4 text-sm font-mono">{transaction.id}</td>
                    <td className="py-4 text-sm text-muted-foreground">{transaction.timestamp}</td>
                    <td className="py-4">
                      <div>
                        <div className="font-medium text-sm">{transaction.receiver}</div>
                        <div className="text-xs text-muted-foreground">{transaction.impact}</div>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-medium text-right">${transaction.amount.toFixed(2)}</td>
                    <td className="py-4 text-center">
                      <Badge variant="outline" className={getCategoryColor(transaction.category)}>
                        {transaction.category}
                      </Badge>
                    </td>
                    <td className="py-4 text-center">
                      <Badge variant={getStatusColor(transaction.status) as any}>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-center">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found matching your search.</p>
            </div>
          )}

          {/* Pagination could go here */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};