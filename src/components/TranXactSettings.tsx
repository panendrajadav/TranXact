import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { ReceiveFundsModal } from "./ReceiveFundsModal";
import { useNavigate } from "react-router-dom";

export const TranXactSettings = () => {
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
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

        {/* Profile Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-orange-400 rounded-full overflow-hidden">
                {/* Profile image placeholder */}
                <div className="w-full h-full bg-orange-400"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Any Organization</h2>
                <p className="text-sm text-text-light">Blockchain ID: 0x1a2b3c4d5e6f7890</p>
                <p className="text-sm text-muted-foreground">Balance: $2,000</p>
              </div>
              <Button 
                onClick={handleReceiveFunds}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
              >
                💰 Receive Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs Indicator */}
        <div className="flex space-x-6 mb-8 border-b">
          <button className="pb-2 text-muted-foreground">Overview</button>
          <button className="pb-2 text-muted-foreground">Reports</button>
          <button className="pb-2 text-muted-foreground">History</button>
          <button className="pb-2 text-foreground border-b-2 border-primary">Settings</button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Account Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">olivia.thompson@email.com</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-sm text-muted-foreground">+1*******890</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                <div>
                  <p className="font-medium">Donor ID</p>
                  <p className="text-sm text-muted-foreground">Donor0x1a2b3c4d5e6f7890NGOCharity789blockchain1234567B</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Linked Accounts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Linked Accounts</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                <p className="font-medium">Connect Social Media</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                <p className="font-medium">Connect Crypto Wallet</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Privacy</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                <p className="font-medium">Manage Data Sharing</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                <p className="font-medium">Privacy Policy</p>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div>
            <h3 className="text-lg font-semibold mb-4">App Preferences</h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                <p className="font-medium">Language</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">English</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border">
                <p className="font-medium">Theme</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Light</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReceiveFundsModal 
        isOpen={showReceiveModal} 
        onClose={() => setShowReceiveModal(false)} 
      />
    </div>
  );
};