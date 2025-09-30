import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  QrCode,
  Copy,
  Save,
  Heart,
  Building
} from "lucide-react";
import { ReceiveFundsModal } from "./ReceiveFundsModal";

export const SettingsPage = () => {
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [notifications, setNotifications] = useState({
    donations: true,
    reports: true,
    marketing: false
  });

  const handleBack = () => {
    window.history.back();
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
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-card">
              <Building className="h-3 w-3 mr-1" />
              NGO Charity
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>Update your personal and organization details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Sarah" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Johnson" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="sarah@ngocharity.org" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input id="organization" defaultValue="NGO Charity Foundation" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Program Director" />
                </div>

                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-accent" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="donation-notifications">Donation Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when donations are received</p>
                  </div>
                  <Switch 
                    id="donation-notifications" 
                    checked={notifications.donations}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, donations: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="report-notifications">Monthly Reports</Label>
                    <p className="text-sm text-muted-foreground">Receive monthly giving summaries</p>
                  </div>
                  <Switch 
                    id="report-notifications"
                    checked={notifications.reports}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reports: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-notifications">Marketing Updates</Label>
                    <p className="text-sm text-muted-foreground">News and feature announcements</p>
                  </div>
                  <Switch 
                    id="marketing-notifications"
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-success" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                    <Button variant="outline" size="sm">Change Password</Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Download Data</Label>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Export your account data</p>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleReceiveFunds}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Receive Funds
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  View Impact Report
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Globe className="h-4 w-4 mr-2" />
                  Public Profile
                </Button>
              </CardContent>
            </Card>

            {/* Wallet Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Wallet Information</CardTitle>
                <CardDescription>Your receiving address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Primary Address</Label>
                    <div className="flex items-center justify-between mt-1 p-2 bg-muted rounded">
                      <code className="text-xs font-mono">
                        0x742d35...9999FA
                      </code>
                      <Button variant="ghost" size="sm" onClick={copyAddress}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Badge variant="secondary" className="w-full justify-center">
                      ✓ Verified
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <p className="font-medium">NGO Charity</p>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Registration</Label>
                  <p className="font-medium">#501c3-2024-001</p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Badge variant="default" className="bg-success">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Palette className="h-4 w-4 mr-2" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme">Dark Mode</Label>
                  <Switch id="theme" />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact">Compact View</Label>
                  <Switch id="compact" />
                </div>
              </CardContent>
            </Card>
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