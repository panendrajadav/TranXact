import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ReceiveFundsModal } from "./ReceiveFundsModal";
import { useNavigate } from "react-router-dom";

export const TranXactCheckBalance = () => {
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleSend = () => {
    console.log("Navigate to send");
  };

  const handleReceiveFunds = () => {
    setShowReceiveModal(true);
  };

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
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6 p-0 h-auto text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome</h1>
          <p className="text-xl text-foreground mb-1">To TranXact, NGO Charity</p>
          <p className="text-sm text-text-light">Blockchain ID: 0x1a2b3c4d5e6f7890</p>
        </div>

        {/* Balance Display - Featured prominently */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Your Balance</h2>
            <p className="text-6xl font-bold text-primary mb-2">$2,847.50</p>
            <p className="text-sm text-muted-foreground">Available for donations</p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={handleSend}
            className="bg-primary hover:bg-primary/90 text-white px-6"
          >
            Send
          </Button>
          <Button 
            onClick={handleReceiveFunds}
            className="bg-primary hover:bg-primary/90 text-white px-6"
          >
            💰 Receive Funds
          </Button>
        </div>

        {/* My Impact - Same as dashboard */}
        <div className="mb-8">
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

        {/* Giving Reports - Same as dashboard */}
        <div className="mb-8">
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

        {/* Transaction Feed - Same as dashboard */}
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
      </div>

      <ReceiveFundsModal 
        isOpen={showReceiveModal} 
        onClose={() => setShowReceiveModal(false)} 
      />
    </div>
  );
};