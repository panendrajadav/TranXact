import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";

const CheckBalance = () => {
  const { wallet, account, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!isConnected || !account) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const algoService = new AlgorandService(wallet, APP_CONFIG.algorand.useTestNet);
      const accountBalance = await algoService.getBalance(account);
      setBalance(accountBalance);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBalance();
  };

  useEffect(() => {
    if (isConnected && account) {
      fetchBalance();
    }
  }, [isConnected, account]);
  const impactStats = [
    { label: "Total Donations", value: "$15,000" },
    { label: "Projects Supported", value: "25" },
    { label: "Lives Impacted", value: "500+" }
  ];

  const donations = [
    {
      amount: "$500",
      description: "School books purchased for 100 children",
      category: "Education",
      status: "active"
    },
    {
      amount: "$200",
      description: "Medical supplies for underserved communities",
      category: "Healthcare",
      status: "active"
    }
  ];

  const history = [
    { type: "donation", description: "Donation to Education for All", amount: "$500" },
    { type: "received", description: "Received Donation from Friend", amount: "$100" },
    { type: "donation", description: "Donation to Healthcare Access", amount: "$200" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Welcome Section with Balance */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Welcome</h1>
              <p className="text-muted-foreground text-lg">To TranXact, Panendra</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Your Balance:</div>
              <div className="text-3xl font-bold text-primary">
                {isConnected ? (
                  balance !== null ? `${balance.toFixed(6)} ALGO` : '--'
                ) : (
                  'Connect Wallet'
                )}
              </div>
              {isConnected && account && (
                <div className="text-xs text-muted-foreground mt-1">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </div>
              )}
            </div>
          </div>

          {/* Wallet Connection Status */}
          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your Pera Wallet to view your balance and make donations.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.href = '/send'}
              disabled={!isConnected}
            >
              Send
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading || !isConnected}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Balance
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-8">
            {/* My Impact Stats */}
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

            {/* Donation Tracking */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Donation Tracking</h2>
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
                        <Button variant="outline" size="sm">
                          View Proofs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Donation History */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Donation History</h2>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs">💰</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-sm text-muted-foreground">{item.amount}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Impact Tracker */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Impact Tracker</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="text-sm text-muted-foreground mb-1">Donation Distribution</div>
                    <div className="text-2xl font-bold">$700</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="h-16 bg-primary/20 rounded mb-2"></div>
                      <div className="text-sm text-primary">Education (60%)</div>
                    </div>
                    <div className="text-center">
                      <div className="h-12 bg-teal/20 rounded mb-2"></div>
                      <div className="text-sm text-teal">Healthcare (30%)</div>
                    </div>
                    <div className="text-center">
                      <div className="h-8 bg-muted rounded mb-2"></div>
                      <div className="text-sm text-muted-foreground">Other (10%)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckBalance;