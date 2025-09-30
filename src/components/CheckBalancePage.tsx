import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Send,
  QrCode,
  Eye,
  EyeOff,
  Copy,
  DollarSign,
  Calendar,
  Target
} from "lucide-react";
import { ReceiveFundsModal } from "./ReceiveFundsModal";

export const CheckBalancePage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const handleBack = () => {
    window.history.back();
  };

  const handleSendFunds = () => {
    console.log("Navigate to send funds");
  };

  const handleReceiveFunds = () => {
    setShowReceiveModal(true);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b8D4d6F3C7dA9999FA");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Check Balance</h1>
                <p className="text-sm text-muted-foreground">Detailed balance and reports</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Balance Display */}
        <Card className="shadow-elegant mb-8 bg-gradient-card">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <h2 className="text-lg font-medium text-muted-foreground mr-4">Your Balance</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowBalance(!showBalance)}
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-5xl font-bold text-primary mb-2">
                {showBalance ? "$2,847.50" : "****"}
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-success mr-1" />
                  <span>+5.2% this month</span>
                </div>
                <Badge variant="secondary">USD</Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center space-x-4 mt-8">
              <Button onClick={handleSendFunds} className="flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Send Funds
              </Button>
              <Button variant="outline" onClick={handleReceiveFunds}>
                <QrCode className="h-4 w-4 mr-2" />
                Receive Funds
              </Button>
            </div>

            {/* Wallet Address */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Wallet Address</p>
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                  0x742d35Cc6634C0532925a3b8D4d6F3C7dA9999FA
                </code>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Balance Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-primary" />
                Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">$2,847.50</div>
              <p className="text-xs text-muted-foreground">Ready to donate</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-success" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">$0.00</div>
              <p className="text-xs text-muted-foreground">In processing</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2 text-accent" />
                Reserved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">$500.00</div>
              <p className="text-xs text-muted-foreground">For recurring donations</p>
            </CardContent>
          </Card>
        </div>

        {/* Giving Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Annual Giving Goal
              </CardTitle>
              <CardDescription>Track your progress towards your yearly goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">$12,450 / $15,000</span>
              </div>
              <Progress value={83} className="h-3" />
              <div className="flex justify-between text-sm">
                <span className="text-success">83% Complete</span>
                <span className="text-muted-foreground">$2,550 remaining</span>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
                <h4 className="font-medium mb-2">On Track!</h4>
                <p className="text-sm text-muted-foreground">
                  You're ahead of schedule. At this pace, you'll exceed your goal by December.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-accent" />
                Monthly Summary
              </CardTitle>
              <CardDescription>This month's giving activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-xl font-bold text-primary">3</div>
                  <div className="text-xs text-muted-foreground">Donations</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-xl font-bold text-success">$900</div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recent Organizations</h4>
                {[
                  { name: "Clean Water Initiative", amount: "$250", date: "Jan 15" },
                  { name: "Education For All", amount: "$500", date: "Jan 10" },
                  { name: "Food Bank Network", amount: "$150", date: "Jan 5" }
                ].map((org, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <div className="text-sm font-medium">{org.name}</div>
                      <div className="text-xs text-muted-foreground">{org.date}</div>
                    </div>
                    <div className="text-sm font-medium text-primary">{org.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History Preview */}
        <Card className="shadow-card mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest donation activity</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  id: "TXN001234567", 
                  org: "Clean Water Initiative", 
                  amount: "$250.00", 
                  date: "Jan 15, 2024",
                  status: "Completed"
                },
                { 
                  id: "TXN001234566", 
                  org: "Education For All", 
                  amount: "$500.00", 
                  date: "Jan 10, 2024",
                  status: "Completed"
                },
                { 
                  id: "TXN001234565", 
                  org: "Food Bank Network", 
                  amount: "$150.00", 
                  date: "Jan 5, 2024",
                  status: "Completed"
                }
              ].map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Send className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{tx.org}</div>
                        <div className="text-xs text-muted-foreground">{tx.id}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{tx.amount}</div>
                    <div className="text-xs text-muted-foreground">{tx.date}</div>
                  </div>
                  <Badge variant="secondary" className="ml-3">
                    {tx.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ReceiveFundsModal 
        isOpen={showReceiveModal} 
        onClose={() => setShowReceiveModal(false)} 
      />
    </div>
  );
};