import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ArrowUpRight,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { ReceiveFundsModal } from "./ReceiveFundsModal";
import { useNavigate } from "react-router-dom";

export const TranXactDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSend = () => {
    console.log("Navigate to send");
  };

  const handleCheckBalance = () => {
    navigate("/check-balance");
  };

  const handleReceiveFunds = () => {
    setShowReceiveModal(true);
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  // Mock transaction data for history
  const transactions = [
    {
      id: "0xabc103",
      blockNumber: "123460",
      timestamp: "2024-01-15 10:30 AM",
      sender: "0xSenderAddress1",
      receiver: "0xReceiverAddress1",
      gasFees: "0.001 ETH"
    },
    {
      id: "0xdef456",
      blockNumber: "123467",
      timestamp: "2024-01-15 11:30 AM",
      sender: "0xSenderAddress2",
      receiver: "0xReceiverAddress2",
      gasFees: "0.002 ETH"
    },
    {
      id: "0xgh789",
      blockNumber: "123468",
      timestamp: "2024-01-16 02:00 PM",
      sender: "0xSenderAddress3",
      receiver: "0xReceiverAddress3",
      gasFees: "0.0015 ETH"
    },
    {
      id: "0xjk012",
      blockNumber: "123469",
      timestamp: "2024-01-16 04:15 PM",
      sender: "0xSenderAddress4",
      receiver: "0xReceiverAddress4",
      gasFees: "0.0012 ETH"
    },
    {
      id: "0xmn345",
      blockNumber: "123460",
      timestamp: "2024-01-17 09:15 AM",
      sender: "0xSenderAddress5",
      receiver: "0xReceiverAddress5",
      gasFees: "0.0018 ETH"
    }
  ];

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.receiver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span className="text-xs text-white font-bold">X</span>
                </div>
                <span className="text-xl font-bold">TranXact</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-muted-foreground hover:text-foreground">Explore</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Projects</a>
                <a href="#" className="text-muted-foreground hover:text-foreground">Assistance</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Connect Wallet
              </Button>
              <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome</h1>
          <p className="text-xl text-foreground mb-1">To TranXact, NGO Charity</p>
          <p className="text-sm text-text-light">Blockchain ID: 0x1a2b3c4d5e6f7890</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={handleSend}
            className="bg-primary hover:bg-primary/90 text-white px-6"
          >
            Send
          </Button>
          <Button 
            onClick={handleCheckBalance}
            className="bg-button-secondary hover:bg-button-secondary/80 text-button-secondary-foreground px-6"
          >
            Check Balance
          </Button>
          <Button 
            onClick={handleReceiveFunds}
            className="bg-primary hover:bg-primary/90 text-white px-6"
          >
            💰 Receive Funds
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings" onClick={handleSettings}>Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* My Impact */}
            <div>
              <h2 className="text-2xl font-bold mb-6">My Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Donations</p>
                    <p className="text-3xl font-bold">$15,000</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Projects Supported</p>
                    <p className="text-3xl font-bold">25</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-2">Lives Impacted</p>
                    <p className="text-3xl font-bold">500+</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Giving Reports */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Giving Reports</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Donations by Category */}
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">Donations by Category</h3>
                      <p className="text-3xl font-bold">$8,000</p>
                      <p className="text-sm text-muted-foreground">Last Year</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-12 bg-primary rounded"></div>
                          <span className="text-sm">Education</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-8 bg-blue-400 rounded"></div>
                          <span className="text-sm">Healthcare</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-6 bg-green-400 rounded"></div>
                          <span className="text-sm">Environment</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-orange-400 rounded"></div>
                          <span className="text-sm">Disaster Relief</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Donations Over Time */}
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">Donations Over Time</h3>
                      <p className="text-3xl font-bold">$15,000</p>
                      <p className="text-sm text-muted-foreground">All Time</p>
                    </div>
                    {/* Simple line chart visualization */}
                    <div className="h-32 flex items-end space-x-2">
                      <div className="flex-1 bg-primary/20 h-8 rounded-t"></div>
                      <div className="flex-1 bg-primary/30 h-12 rounded-t"></div>
                      <div className="flex-1 bg-primary/40 h-6 rounded-t"></div>
                      <div className="flex-1 bg-primary/50 h-20 rounded-t"></div>
                      <div className="flex-1 bg-primary/60 h-16 rounded-t"></div>
                      <div className="flex-1 bg-primary h-24 rounded-t"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Transaction Feed */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Transaction Feed</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Donation to Education for All</p>
                        <p className="text-xs text-muted-foreground">$500</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Received Donation from Friend</p>
                        <p className="text-xs text-muted-foreground">$100</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Donation to Healthcare Access</p>
                        <p className="text-xs text-muted-foreground">$250</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Reports Overview</h2>
              
              {/* Donation Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Donation Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">Total Donations</p>
                      <p className="text-3xl font-bold">$15,000</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">Projects Supported</p>
                      <p className="text-3xl font-bold">25</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-2">Lives Impacted</p>
                      <p className="text-3xl font-bold">500+</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Donations by Category and Over Time */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">Donations by Category</h3>
                      <p className="text-3xl font-bold">$8,000</p>
                      <p className="text-sm text-muted-foreground">Last Year</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-12 bg-primary rounded"></div>
                          <span className="text-sm">Education</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-8 bg-blue-400 rounded"></div>
                          <span className="text-sm">Healthcare</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-6 bg-green-400 rounded"></div>
                          <span className="text-sm">Environment</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-orange-400 rounded"></div>
                          <span className="text-sm">Disaster Relief</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-1">Donations Over Time</h3>
                      <p className="text-3xl font-bold">$15,000</p>
                      <p className="text-sm text-muted-foreground">All Time</p>
                    </div>
                    <div className="h-32 flex items-end space-x-2">
                      <div className="flex-1 bg-primary/20 h-8 rounded-t"></div>
                      <div className="flex-1 bg-primary/30 h-12 rounded-t"></div>
                      <div className="flex-1 bg-primary/40 h-6 rounded-t"></div>
                      <div className="flex-1 bg-primary/50 h-20 rounded-t"></div>
                      <div className="flex-1 bg-primary/60 h-16 rounded-t"></div>
                      <div className="flex-1 bg-primary h-24 rounded-t"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Donor Insights */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Donor Insights & Platform Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Explore detailed insights into your giving patterns and the collective impact of our community. Stay informed with our latest 
                    platform enhancements and features designed to improve your experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Transaction Details</h2>
              <p className="text-sm text-muted-foreground mb-6">
                View detailed information about your blockchain transactions.
              </p>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-md"
                />
              </div>

              {/* Transaction Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Transaction ID</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Block Number</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Timestamp</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Sender</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Receiver</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Gas Fees</th>
                          <th className="text-left p-4 text-sm font-medium text-muted-foreground">Explorer Link</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((transaction, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-4 text-sm font-mono">{transaction.id}</td>
                            <td className="p-4 text-sm">{transaction.blockNumber}</td>
                            <td className="p-4 text-sm">{transaction.timestamp}</td>
                            <td className="p-4 text-sm">{transaction.sender}</td>
                            <td className="p-4 text-sm">{transaction.receiver}</td>
                            <td className="p-4 text-sm">{transaction.gasFees}</td>
                            <td className="p-4">
                              <Button variant="ghost" size="sm" className="text-primary">
                                View on Explorer
                                <ExternalLink className="h-3 w-3 ml-1" />
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
                </CardContent>
              </Card>
            </div>
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