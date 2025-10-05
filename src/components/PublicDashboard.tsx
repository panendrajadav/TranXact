import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/contexts/WalletProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import { ManagePrograms } from "@/components/ManagePrograms";
import { AllocateToProjects } from "@/components/AllocateToProjects";

export function PublicDashboard() {
  const { wallet, account, isConnected } = useWallet();
  const { userName } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [showManagePrograms, setShowManagePrograms] = useState(false);
  const [showAllocate, setShowAllocate] = useState(false);


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
    { label: "Total Funding", value: "12,500 ALGO" },
    { label: "NGOs Supported", value: "25" },
    { label: "Lives Impacted", value: "5,000+" }
  ];

  const fundingPrograms = [
    {
      amount: "2,500 ALGO",
      description: "Education Infrastructure Program",
      category: "Education",
      ngos: 5,
      status: "Active"
    },
    {
      amount: "3,750 ALGO", 
      description: "Healthcare Access Initiative",
      category: "Healthcare",
      ngos: 8,
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {userName || 'Public Donor'}!</h1>
          <p className="text-muted-foreground text-lg">Manage large-scale funding and NGO partnerships</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Available Funds:</div>
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
          Send Funds
        </Button>
        <Button variant="outline" onClick={() => {
          setShowManagePrograms(!showManagePrograms);
          if (showAllocate) setShowAllocate(false);
        }}>
          {showManagePrograms ? 'Back to Dashboard' : 'Manage Programs'}
        </Button>
        <Button variant="outline" onClick={() => {
          setShowAllocate(!showAllocate);
          if (showManagePrograms) setShowManagePrograms(false);
        }}>
          {showAllocate ? 'Back to Dashboard' : 'Allocate Funds'}
        </Button>


      </div>

      {showManagePrograms ? (
        <ManagePrograms />
      ) : showAllocate ? (
        <AllocateToProjects />
      ) : (
        <>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Funding Impact</h2>
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
        <h2 className="text-2xl font-semibold mb-4">Active Funding Programs</h2>
        <div className="space-y-4">
          {fundingPrograms.map((program, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">🏛️</span>
                    </div>
                    <div>
                      <div className="font-medium">{program.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {program.amount} • {program.ngos} NGOs participating
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {program.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {program.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm">
                      View Program
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">NGO Performance</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="h-16 bg-primary/20 rounded mb-2"></div>
                <div className="text-sm text-primary">High Performance (60%)</div>
              </div>
              <div className="text-center">
                <div className="h-12 bg-yellow-200 rounded mb-2"></div>
                <div className="text-sm text-yellow-600">Medium Performance (30%)</div>
              </div>
              <div className="text-center">
                <div className="h-8 bg-red-200 rounded mb-2"></div>
                <div className="text-sm text-red-600">Needs Attention (10%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
        </>
      )}
    </div>
  );
}