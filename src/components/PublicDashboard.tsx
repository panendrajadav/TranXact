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

import { useProjects } from "@/contexts/ProjectProvider";
import { useDonations } from "@/contexts/DonationProvider";
import { TransactionAPI } from "@/lib/transactionAPI";

export function PublicDashboard() {
  const { wallet, account, isConnected } = useWallet();
  const { userName } = useAuth();
  const { donations } = useDonations();
  const { projects } = useProjects();
  const [balance, setBalance] = useState<number | null>(null);
  const [showManagePrograms, setShowManagePrograms] = useState(false);
  const [showAllocate, setShowAllocate] = useState(false);
  const [highlightedProject, setHighlightedProject] = useState<string | null>(null);
  const [privateFunds, setPrivateFunds] = useState<any>(null);
  const [walletBalances, setWalletBalances] = useState<{[key: string]: number}>({});

  const handleViewProject = (projectId: string) => {
    setHighlightedProject(projectId);
    setShowManagePrograms(true);
    if (showAllocate) setShowAllocate(false);
  };

  const getWalletName = (address: string) => {
    const walletNames: { [key: string]: string } = {
      'DYT6HEX5FQY7F26E3CUIRUFP6RQKKXKOMZLXUW5FKITZE74YJWTFNTWDPU': 'Ashaa Foundations',
      'J7LJIQ7JK3Q6OWMUSW6DWIYC3HRNLSXGL5KQ5TFJXILFKXDURSE2PSAFOI': 'MB Foundations',
      'OFDV5E5ZTP45MHXCQQ5EHIXAKIJ2BXGMFAAYU6Z2NG4MZTNCB3BOYXIBSQ': 'United Nations'
    };
    return walletNames[address] || 'Wallet User';
  };


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
    
    const fetchPrivateFunds = async () => {
      try {
        const privateFundsData = await TransactionAPI.getPrivateFunds();
        setPrivateFunds(privateFundsData);
      } catch (error) {
        console.error('Failed to fetch private funds:', error);
      }
    };

    const fetchWalletBalances = async () => {
      if (!wallet) return;
      
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
      
      setWalletBalances(balances);
    };
    
    fetchBalance();
    fetchPrivateFunds();
    fetchWalletBalances();
  }, [isConnected, account, wallet, projects]);

  // Calculate total funding from actual donations only
  const totalFunding = donations.reduce((sum, donation) => sum + donation.amount, 0);
  
  const impactStats = [
    { label: "Total Funding", value: `${totalFunding.toFixed(2)} ALGO` },
    { label: "NGOs Supported", value: "3" },
    { label: "Lives Impacted", value: "5,000+" }
  ];

  // Calculate actual funded amounts from wallet balances
  const projectsWithFunding = projects.map(project => {
    const walletBalance = walletBalances[project.wallet] || 0;
    return { ...project, actualFunded: walletBalance };
  });

  // Get top 3 funded projects based on wallet balance (descending)
  const topFundedProjects = [...projectsWithFunding]
    .sort((a, b) => (b.actualFunded ?? 0) - (a.actualFunded ?? 0))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {userName || (account ? getWalletName(account) : 'Public Donor')}!</h1>
          <p className="text-muted-foreground text-lg">Manage large-scale funding and NGO partnerships</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Available Balance:</div>
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
        <ManagePrograms highlightedProject={highlightedProject} />
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
        <h2 className="text-2xl font-semibold mb-4">Top Funded Projects</h2>
        <div className="space-y-4">
          {(topFundedProjects.length > 0 ? topFundedProjects : projectsWithFunding.slice(0, 3)).map((project, index) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">🎯</span>
                    </div>
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {project.actualFunded.toFixed(2)} ALGO funded • {project.backers} backers
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewProject(project.id)}>
                      View Project
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