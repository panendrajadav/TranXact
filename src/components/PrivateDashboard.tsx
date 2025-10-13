import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/WalletProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { useDonations } from "@/contexts/DonationProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

export function PrivateDashboard() {
  const { wallet, account, isConnected } = useWallet();
  const { userName } = useAuth();
  const { donations, loadDonationsFromDB } = useDonations();
  const [balance, setBalance] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isConnected && account) {
        try {
          // Load fresh donations from database
          await loadDonationsFromDB(account);
          
          // Fetch wallet balance
          const algoService = new AlgorandService(wallet, APP_CONFIG.algorand.useTestNet);
          const accountBalance = await algoService.getBalance(account);
          setBalance(accountBalance);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      }
    };
    fetchData();
    
    // Also refresh every 10 seconds to show real-time updates
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [isConnected, account, wallet, loadDonationsFromDB]);

  // Calculate real stats from donations
  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalAllocated = donations.reduce((sum, donation) => {
    return sum + (donation.allocations?.reduce((allocSum, alloc) => allocSum + alloc.amount, 0) || 0);
  }, 0);
  const totalRemaining = totalDonated - totalAllocated;
  const uniqueOrganizations = new Set(donations.map(d => d.organizationName)).size;
  const uniqueProjects = new Set(
    donations.flatMap(d => d.allocations?.map(a => a.projectName) || [])
  ).size;
  
  const impactStats = [
    { label: "Total Donated", value: `${totalDonated.toFixed(2)} ALGO` },
    { label: "Funds Allocated", value: `${totalAllocated.toFixed(2)} ALGO` },
    { label: "Projects Funded", value: uniqueProjects.toString() }
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
        <Button variant="outline" onClick={() => loadDonationsFromDB(account || '')}>
          Refresh Data
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
          {donations.length > 0 ? (
            donations.map((donation, index) => {
              const allocatedAmount = donation.allocations?.reduce((sum, alloc) => sum + alloc.amount, 0) || 0;
              const remainingAmount = donation.amount - allocatedAmount;
              
              return (
                <Card key={donation.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">💰</span>
                        </div>
                        <div>
                          <div className="font-medium">Donation of {donation.amount} ALGO</div>
                          <div className="text-sm text-muted-foreground">{donation.reason}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {donation.organizationName}
                            </Badge>
                            {allocatedAmount > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {allocatedAmount.toFixed(2)} ALGO allocated
                              </Badge>
                            )}
                            {remainingAmount > 0 && (
                              <Badge variant="default" className="text-xs">
                                {remainingAmount.toFixed(2)} ALGO remaining
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {new Date(donation.date).toLocaleDateString()}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowDialog(true)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                    
                    {/* Show allocations if any */}
                    {donation.allocations && donation.allocations.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-sm font-medium mb-2">Fund Usage:</div>
                        <div className="space-y-1">
                          {donation.allocations.map((allocation, allocIndex) => (
                            <div key={allocIndex} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                📊 {allocation.projectName}
                              </span>
                              <span className="font-medium">
                                {allocation.amount} ALGO
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">
                  {account ? 'No donations found for this wallet' : 'Connect your wallet to view donations'}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      
      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
}