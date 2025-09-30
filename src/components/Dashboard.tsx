import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Send, 
  DollarSign, 
  QrCode, 
  TrendingUp, 
  Heart, 
  Users, 
  Calendar,
  ArrowUpRight,
  Wallet
} from "lucide-react";
import { ReportsTab } from "./ReportsTab";
import { HistoryTab } from "./HistoryTab";
import { ReceiveFundsModal } from "./ReceiveFundsModal";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  const handleSendFunds = () => {
    // Navigate to send funds page
    console.log("Navigate to send funds");
  };

  const handleCheckBalance = () => {
    // Navigate to check balance page
    window.location.href = "/check-balance";
  };

  const handleReceiveFunds = () => {
    setShowReceiveModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">GiveChain</h1>
                <p className="text-sm text-muted-foreground">Transparent Giving Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-secondary">
                <Wallet className="h-3 w-3 mr-1" />
                Balance: $2,847.50
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-shadow cursor-pointer" onClick={handleSendFunds}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Send Funds</h3>
                  <p className="text-sm text-muted-foreground">Transfer funds to organizations</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-shadow cursor-pointer" onClick={handleReceiveFunds}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                    <QrCode className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Receive Funds</h3>
                  <p className="text-sm text-muted-foreground">Get your receiving address</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-shadow cursor-pointer" onClick={handleCheckBalance}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-info/10 flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-info" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Check Balance</h3>
                  <p className="text-sm text-muted-foreground">View detailed balance info</p>
                </CardContent>
              </Card>
            </div>

            {/* My Impact Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                    My Impact
                  </CardTitle>
                  <CardDescription>Your giving impact this year</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">$12,450</div>
                      <div className="text-sm text-muted-foreground">Total Donated</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-success">47</div>
                      <div className="text-sm text-muted-foreground">Organizations Helped</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Goal Progress</span>
                      <span className="text-muted-foreground">$12,450 / $15,000</span>
                    </div>
                    <Progress value={83} className="h-2" />
                    <p className="text-xs text-muted-foreground">83% of your annual giving goal</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-accent" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest donations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { org: "Clean Water Initiative", amount: "$250", date: "2 days ago", impact: "Provided clean water for 25 people" },
                    { org: "Education For All", amount: "$500", date: "1 week ago", impact: "Sponsored 2 children's education" },
                    { org: "Food Bank Network", amount: "$150", date: "2 weeks ago", impact: "Fed 30 families for a week" }
                  ].map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{donation.org}</div>
                        <div className="text-sm text-muted-foreground">{donation.impact}</div>
                        <div className="text-xs text-muted-foreground">{donation.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">{donation.amount}</div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground ml-auto" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Giving Reports Preview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-info" />
                    Giving Reports Preview
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("reports")}>
                    View Full Reports
                  </Button>
                </CardTitle>
                <CardDescription>Quick overview of your giving patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                    <div className="text-xl font-bold text-primary">68%</div>
                    <div className="text-sm text-muted-foreground">Education Focus</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-success/5 to-success/10 rounded-lg">
                    <div className="text-xl font-bold text-success">23%</div>
                    <div className="text-sm text-muted-foreground">Health & Wellness</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg">
                    <div className="text-xl font-bold text-accent">9%</div>
                    <div className="text-sm text-muted-foreground">Environmental</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <ReportsTab />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>

      <ReceiveFundsModal 
        isOpen={showReceiveModal} 
        onClose={() => setShowReceiveModal(false)} 
      />
    </div>
  );
};