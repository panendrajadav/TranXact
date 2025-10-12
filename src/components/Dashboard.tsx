import React, { useState, useEffect } from 'react';
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
  Wallet,
  Trophy
} from "lucide-react";
import { ReportsTab } from "./ReportsTab";
import { HistoryTab } from "./HistoryTab";
import { ReceiveFundsModal } from "./ReceiveFundsModal";
import { useProjects } from "@/contexts/ProjectProvider";
import { useDonations } from "@/contexts/DonationProvider";
import { useWallet } from "@/contexts/WalletProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const { projects } = useProjects();
  const { donations } = useDonations();
  const { wallet } = useWallet();
  const [projectBalances, setProjectBalances] = useState<{[key: string]: number}>({});

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

  // Fetch project balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!wallet || projects.length === 0) return;
      
      const algoService = new AlgorandService(wallet, APP_CONFIG.algorand.useTestNet);
      const balances: {[key: string]: number} = {};
      
      for (const project of projects) {
        try {
          const balance = await algoService.getBalance(project.wallet);
          balances[project.wallet] = balance;
        } catch (error) {
          console.error(`Failed to fetch balance for ${project.title}:`, error);
          balances[project.wallet] = 0;
        }
      }
      
      setProjectBalances(balances);
    };
    
    fetchBalances();
  }, [wallet, projects]);

  // Get top 3 funded projects
  const topFundedProjects = projects
    .map(project => ({
      ...project,
      currentFunding: projectBalances[project.wallet] || 0
    }))
    .sort((a, b) => b.currentFunding - a.currentFunding)
    .slice(0, 3);

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
                Balance: {donations.reduce((sum, donation) => sum + donation.amount, 0).toFixed(2)} ALGO
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
                      <div className="text-2xl font-bold text-primary">{donations.reduce((sum, donation) => sum + donation.amount, 0).toFixed(1)} ALGO</div>
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
                      <span className="text-muted-foreground">3,112.5 / 3,750 ALGO</span>
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
                    { org: "Clean Water Initiative", amount: "62.5 ALGO", date: "2 days ago", impact: "Provided clean water for 25 people" },
                    { org: "Education For All", amount: "125 ALGO", date: "1 week ago", impact: "Sponsored 2 children's education" },
                    { org: "Food Bank Network", amount: "37.5 ALGO", date: "2 weeks ago", impact: "Fed 30 families for a week" }
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

            {/* Top Funded Projects */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-warning" />
                  Top Funded Projects
                </CardTitle>
                <CardDescription>Projects with the highest funding levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topFundedProjects.length > 0 ? (
                  topFundedProjects.map((project, index) => {
                    const fundingPercentage = (project.currentFunding / project.target) * 100;
                    return (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{project.title}</div>
                            <div className="text-sm text-muted-foreground">{project.organization}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Progress value={Math.min(fundingPercentage, 100)} className="h-1 flex-1" />
                              <span className="text-xs text-muted-foreground">
                                {fundingPercentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">{project.currentFunding.toFixed(2)} ALGO</div>
                          <div className="text-xs text-muted-foreground">of {project.target} ALGO</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No funded projects available</p>
                  </div>
                )}
              </CardContent>
            </Card>

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