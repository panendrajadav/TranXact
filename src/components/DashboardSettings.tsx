import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, Edit } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useWallet } from "@/contexts/WalletProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const DashboardSettings = () => {
  const { userName, userEmail, userPhone, theme, updateProfile, toggleTheme } = useAuth();
  const { wallet, account, isConnected } = useWallet();
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userName || 'User');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState(userPhone || '');
  const [balance, setBalance] = useState<number | null>(null);

  useState(() => {
    const fetchBalance = async () => {
      if (isConnected && account) {
        try {
          const algoService = new AlgorandService(wallet, APP_CONFIG.algorand.useTestNet);
          const accountBalance = await algoService.getBalance(account);
          setBalance(accountBalance);
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        }
      }
    };
    fetchBalance();
  });

  const handleSaveProfile = () => {
    updateProfile(name, email, phone);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully",
      duration: 3000,
    });
  };

  return (
    <div className="max-w-2xl space-y-8 align-center mx-auto py-12">
      {/* Profile Section */}
      <section className="text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src="src/assets/walter white.jpg" alt={userName || 'User'} />
          <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="text-center text-2xl font-bold w-48"
              />
              <Button size="sm" onClick={handleSaveProfile}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold">{userName || 'User'}</h2>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        {isEditing && (
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSaveProfile}>Save All Changes</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        )}
        
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="mt-4">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
        <p className="text-muted-foreground">Wallet Address: {account ? `${account.slice(0, 8)}...${account.slice(-8)}` : '--'}</p>
        <p className="text-muted-foreground">Balance: {balance !== null ? `${balance.toFixed(6)} ALGO` : '--'}</p>
        
        <div className="flex gap-4 mt-6 justify-center">
          <Button size="lg">Send</Button>
          <Button size="lg" variant="default" onClick={() => setShowDialog(true)}>Receive Funds</Button>
          <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
        </div>
      </section>

      {/* Account Information */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Account Information</h3>
        <div className="space-y-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">Email</div>
                  {isEditing ? (
                    <Input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="mt-1"
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">{email || 'Not set'}</div>
                  )}
                </div>
                {!isEditing && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">Phone Number</div>
                  {isEditing ? (
                    <Input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="mt-1"
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">{phone || 'Not set'}</div>
                  )}
                </div>
                {!isEditing && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Wallet Address</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {account || 'Not connected'}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Privacy */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Privacy</h3>
        <div className="space-y-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Manage Data Sharing</div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Privacy Policy</div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* App Preferences */}
      <section>
        <h3 className="text-xl font-semibold mb-4">App Preferences</h3>
        <div className="space-y-1">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Language</div>
                <div className="text-muted-foreground">English</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Theme</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{theme === 'light' ? 'Light' : 'Dark'}</span>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default DashboardSettings;