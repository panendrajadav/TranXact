import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletProvider";
import { TransactionService } from "@/lib/transactionService";
import { useProjects } from "@/contexts/ProjectProvider";
import { useDonations } from "@/contexts/DonationProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import { TransactionAPI } from "@/lib/transactionAPI";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

type Props = {
  isPublic?: boolean;
};

const DashboardReports = ({ isPublic = false }: Props) => {
  const [showDialog, setShowDialog] = useState(false);

  const { wallet, account } = useWallet();
  const { projects } = useProjects();
  const { donations } = useDonations();
  const { userType } = useAuth();
  const [walletBalances, setWalletBalances] = useState<{[key: string]: number}>({});
  const [organizationDonations, setOrganizationDonations] = useState<any[]>([]);

  // projectData will be derived from real transactions when isPublic
  const [projectData, setProjectData] = useState(() => projects.map(p => ({
    id: p.id,
    name: p.title,
    wallet: p.wallet,
    funded: 0,
    spent: 0,
    color: undefined as string | undefined
  })));

  const [totalFunded, setTotalFunded] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    const fetchWalletBalances = async () => {
      if (!wallet || !isPublic) return;
      
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

    const fetchOrganizationDonations = async () => {
      if (account && isPublic) {
        try {
          const orgDonations = await TransactionAPI.getOrganizationDonations(account);
          setOrganizationDonations(orgDonations);
        } catch (error) {
          console.error('Failed to fetch organization donations:', error);
        }
      }
    };

    fetchWalletBalances();
    fetchOrganizationDonations();
  }, [wallet, account, projects, isPublic]);

  // Calculate total funding using wallet balances + unallocated donations (same as PublicDashboard)
  const totalWalletBalance = Object.values(walletBalances).reduce((sum, balance) => sum + balance, 0);
  const totalAllocations = organizationDonations.reduce((sum, donation) => {
    const allocated = donation.allocations?.reduce((allocSum: number, alloc: any) => allocSum + alloc.amount, 0) || 0;
    return sum + allocated;
  }, 0);
  const totalDonationsReceived = organizationDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const unallocatedDonations = totalDonationsReceived - totalAllocations;
  const totalFunding = totalWalletBalance + unallocatedDonations;
  const remainingFunds = totalFunding - totalWalletBalance;

  // Use wallet balances for project funding data
  const projectFundingData = projects.map((project, idx) => {
    const walletBalance = walletBalances[project.wallet] || 0;
    
    return {
      name: project.title,
      funded: walletBalance,
      allocated: walletBalance,
      color: `hsl(${idx * 137.5 % 360}, 70%, 50%)`
    };
  });
  
  // Data formats for charts
  const pieData = isPublic ? 
    projectFundingData.map(p => ({ name: p.name, value: p.funded, color: p.color })) :
    projectData.map(p => ({ name: p.name, value: p.funded, color: p.color }));
    
  const barData = isPublic ?
    projectFundingData.map(p => ({ name: p.name, Funded: p.funded, Allocated: p.allocated })) :
    projectData.map(p => ({ name: p.name, Funded: p.funded, Spent: p.spent }));

  // Get donations with project allocations for private users
  const privateDonations = donations.map(donation => ({
    ...donation,
    allocations: donation.allocations?.map(allocation => {
      const project = projects.find(p => p.id === allocation.projectId);
      return {
        project: allocation.projectName,
        amount: allocation.amount,
        status: allocation.status,
        projectDetails: project ? {
          organization: project.organization,
          category: project.category,
          location: project.location
        } : null
      };
    }) || []
  }));

  // Debug logging
  console.log('Wallet Balances:', walletBalances);
  console.log('Total Wallet Balance:', totalWalletBalance);
  console.log('Total Funding:', totalFunding);
  console.log('Project funding data:', projectFundingData);

  if (isPublic) {
    return (
      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Public Funding Summary</h2>
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  console.log('=== DEBUG INFO ===');
                  console.log('Donations:', donations);
                  console.log('Projects:', projects);
                  console.log('Project Funding Data:', projectFundingData);
                  console.log('Pie Data:', pieData);
                  console.log('Bar Data:', barData);
                }}
              >
                Debug Data
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">Total Funding</div>
                <div className="text-2xl font-bold text-primary">{totalFunding.toFixed(2)} ALGO</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">Total Allocated</div>
                <div className="text-2xl font-bold text-green-600">{totalWalletBalance.toFixed(2)} ALGO</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">Remaining Funds</div>
                <div className="text-2xl font-bold text-orange-600">{remainingFunds.toFixed(2)} ALGO</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contributions by Project</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fund Allocation by Project</CardTitle>
                <CardDescription>Distribution of allocated funds across projects</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {pieData.filter(p => p.value > 0).length > 0 ? (
                  <>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={pieData.filter(p => p.value > 0)} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={80} 
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          >
                            {pieData.filter(p => p.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => [`${value.toFixed(2)} ALGO`, 'Allocated']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      {projectFundingData.filter(p => p.allocated > 0).map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: p.color }} />
                            <span className="text-sm">{p.name}</span>
                          </div>
                          <span className="text-sm font-medium">{p.allocated.toFixed(2)} ALGO</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p>No fund allocations yet</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Funding Comparison</CardTitle>
                <CardDescription>Allocated amounts per project</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {barData.filter(p => p.Allocated > 0).length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData.filter(p => p.Allocated > 0)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`${value.toFixed(2)} ALGO`, 'Allocated']} />
                        <Bar dataKey="Allocated" fill="hsl(147 86% 40%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-72 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p>No fund allocations yet</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
      </div>
    );
  }

  // Default (private) view with project allocation tracking
  return (
    <div className="space-y-8">
      {/* Donation Tracking */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Donation Tracking</h2>
          {process.env.NODE_ENV === 'development' && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => console.log('Current donations:', donations)}
              >
                Debug Log
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  const { clearDonations } = require('@/contexts/DonationProvider');
                  if (window.confirm('Clear all donations? This cannot be undone.')) {
                    localStorage.removeItem('tranxact-donations');
                    window.location.reload();
                  }
                }}
              >
                Clear Data
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {privateDonations.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Donations Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any donations yet. Start making a difference by supporting organizations and projects.
                </p>
                <Button onClick={() => window.location.href = '/send'}>
                  Make Your First Donation
                </Button>
              </CardContent>
            </Card>
          ) : privateDonations.map((donation) => (
            <Card key={donation.id}>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">💰</span>
                      </div>
                      <div>
                        <div className="font-medium">{donation.amount} ALGO to {donation.organizationName}</div>
                        <div className="text-sm text-muted-foreground">Your reason: {donation.reason}</div>
                        <div className="text-xs text-muted-foreground">{new Date(donation.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowDialog(true)}>
                      View on Blockchain
                    </Button>
                  </div>
                  
                  <div className="ml-14">
                    <div className="text-sm font-medium mb-2">Fund Allocation by Organization:</div>
                    <div className="space-y-2">
                      {donation.allocations.length > 0 ? donation.allocations.map((allocation, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <div className="text-sm font-medium">{allocation.project}</div>
                            {allocation.projectDetails && (
                              <div className="text-xs text-muted-foreground">
                                {allocation.projectDetails.organization} • {allocation.projectDetails.category}
                              </div>
                            )}
                            <Badge variant={allocation.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {allocation.status}
                            </Badge>
                          </div>
                          <div className="text-sm font-medium">{allocation.amount} ALGO</div>
                        </div>
                      )) : (
                        <div className="p-2 bg-muted/50 rounded text-sm text-muted-foreground text-center">
                          Not yet allocated to specific projects
                        </div>
                      )}
                    </div>
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
};

export default DashboardReports;