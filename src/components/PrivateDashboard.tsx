import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/WalletProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

export function PrivateDashboard() {
  const { wallet, account, isConnected } = useWallet();
  const { userName } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
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
  }, [isConnected, account, wallet]);

  const impactStats = [
    { label: "Total Donations", value: "2,500 ALGO" },
    { label: "Projects Supported", value: "8" },
    { label: "Lives Impacted", value: "150+" }
  ];

  const donations = [
    {
      amount: "125 ALGO",
      description: "School books for children",
      category: "Education",
      date: "2024-01-15"
    },
    {
      amount: "75 ALGO",
      description: "Medical supplies",
      category: "Healthcare", 
      date: "2024-01-10"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {userName || (account ? 'Wallet User' : 'Private Donor')}!</h1>
          <p className="text-muted-foreground text-lg">Track your personal donations and impact</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Your Balance:</div>
          <div className="text-3xl font-bold text-primary">
            {balance !== null ? `${balance.toFixed(6)} ALGO` : '--'}
          </div>
          {account && (
            <div className="text-xs text-muted-foreground mt-1">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => window.location.href = '/send'}>
          Make Donation
        </Button>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Impact</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {impactStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Donations</h2>
        <div className="space-y-4">
          {donations.map((donation, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">💰</span>
                    </div>
                    <div>
                      <div className="font-medium">Donation of {donation.amount}</div>
                      <div className="text-sm text-muted-foreground">{donation.description}</div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {donation.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{donation.date}</div>
                    <Button variant="outline" size="sm" onClick={() => setShowDialog(true)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
}