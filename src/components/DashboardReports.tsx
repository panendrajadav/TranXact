import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletProvider";
import { TransactionService } from "@/lib/transactionService";
import { useProjects } from "@/contexts/ProjectProvider";
import { useDonations } from "@/contexts/DonationProvider";
import { useAuth } from "@/contexts/AuthProvider";
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

  const { account } = useWallet();
  const { projects } = useProjects();
  const { donations } = useDonations();
  const { userType } = useAuth();

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
    const load = async () => {
      if (!isPublic || !account) return;

      const transactionService = new TransactionService();

      // Fetch recent transactions for the connected public account
      const txs = await transactionService.getAccountTransactions(account, 200);

      // Map project wallets to aggregates
      const projectMap: Record<string, { funded: number; spent: number; id?: string; name?: string }> = {};
      projects.forEach(p => {
        projectMap[p.wallet] = { funded: 0, spent: 0, id: p.id, name: p.title };
      });

      let fundedSum = 0;
      let spentSum = 0;

      txs.forEach(tx => {
        const amt = tx.amount || 0;

        // Funding: transactions sent by the public account to a project
        if (tx.type === 'sent') {
          const receiver = (tx.receiver || '').toString();

          // 1) Direct wallet match
          if (receiver && projectMap[receiver]) {
            projectMap[receiver].funded += amt;
            fundedSum += amt;
            return;
          }

          // 2) Try matching via decoded note, project id, title, or organization
          const note = (tx.note || '').toLowerCase();
          let matched = false;
          for (const p of projects) {
            const title = (p.title || '').toLowerCase();
            const org = (p.organization || '').toLowerCase();
            const pid = (p.id || '').toLowerCase();
            if (note.includes(title) || note.includes(org) || note.includes(pid)) {
              projectMap[p.wallet].funded += amt;
              fundedSum += amt;
              matched = true;
              break;
            }
          }
          if (matched) return;

          // 3) Fallback: case-insensitive wallet match
          for (const w in projectMap) {
            if (w.toLowerCase() === receiver.toLowerCase()) {
              projectMap[w].funded += amt;
              fundedSum += amt;
              matched = true;
              break;
            }
          }
          if (matched) return;
        }

        // Spent/returns: transactions received by the public account from project wallets
        if (tx.type === 'received') {
          const sender = (tx.sender || '').toString();
          if (sender && projectMap[sender]) {
            projectMap[sender].spent += amt;
            spentSum += amt;
            return;
          }

          const note = (tx.note || '').toLowerCase();
          for (const p of projects) {
            const title = (p.title || '').toLowerCase();
            const org = (p.organization || '').toLowerCase();
            const pid = (p.id || '').toLowerCase();
            if (note.includes(title) || note.includes(org) || note.includes(pid)) {
              projectMap[p.wallet].spent += amt;
              spentSum += amt;
              break;
            }
          }
        }
      });

      // Build projectData with colors
      const colors = ['hsl(147 86% 40%)', 'hsl(37 100% 55%)', 'hsl(217 91% 60%)', 'hsl(280 80% 60%)', 'hsl(200 80% 40%)'];
      const pd = projects.map((p, idx) => ({
        id: p.id,
        name: p.title,
        wallet: p.wallet,
        funded: projectMap[p.wallet]?.funded || 0,
        spent: projectMap[p.wallet]?.spent || 0,
        color: colors[idx % colors.length]
      }));

      setProjectData(pd);
      setTotalFunded(fundedSum);
      setTotalSpent(spentSum);
    };

    load();
  }, [isPublic, account, projects]);

  // Calculate funding data from donations for public view
  const projectFundingData = projects.map((project, idx) => {
    // Calculate total funded by private users to this project
    const totalFunded = donations.reduce((sum, donation) => {
      const projectAllocations = donation.allocations?.filter(alloc => 
        alloc.projectName === project.title
      ) || [];
      return sum + projectAllocations.reduce((allocSum, alloc) => allocSum + alloc.amount, 0);
    }, 0);
    
    return {
      name: project.title,
      funded: totalFunded,
      allocated: totalFunded, // In this context, funded = allocated
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
  console.log('Donations in reports:', donations);
  console.log('Private donations processed:', privateDonations);

  if (isPublic) {
    return (
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Public Funding Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">Total Private Funding</div>
                <div className="text-2xl font-bold">{projectFundingData.reduce((sum, p) => sum + p.funded, 0).toFixed(2)} ALGO</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">Total Allocated</div>
                <div className="text-2xl font-bold text-orange-600">{projectFundingData.reduce((sum, p) => sum + p.allocated, 0).toFixed(2)} ALGO</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">Active Projects</div>
                <div className="text-2xl font-bold text-primary">{projects.length}</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contributions by Project</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Private User Funding by Project</CardTitle>
                <CardDescription>How much private users funded to each project</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} ALGO`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {(isPublic ? projectFundingData : projectData).map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: p.color }} />
                        <span className="text-sm">{p.name}</span>
                      </div>
                      <span className="text-sm font-medium">{p.funded.toFixed(2)} ALGO</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funded vs Allocated (Bar)</CardTitle>
                <CardDescription>Comparison of funded vs allocated amounts per project</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} ALGO`} />
                      <Bar dataKey="Funded" fill="hsl(147 86% 40%)" />
                      <Bar dataKey="Allocated" fill="hsl(37 100% 55%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
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