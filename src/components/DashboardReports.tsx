import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletProvider";
import { TransactionService } from "@/lib/transactionService";
import { useProjects } from "@/contexts/ProjectProvider";
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

  // Data formats for charts
  const pieData = projectData.map(p => ({ name: p.name, value: p.funded, color: p.color }));
  const barData = projectData.map(p => ({ name: p.name, Funded: p.funded, Spent: p.spent }));

  // Fallback donations (private view)
  const donations = [
    {
      amount: "125.5 ALGO",
      description: "School books purchased for 100 children",
      category: "Education",
      status: "active"
    },
    {
      amount: "50.2 ALGO",
      description: "Medical supplies for underserved communities",
      category: "Healthcare",
      status: "active"
    }
  ];

  if (isPublic) {
    return (
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Public Funding Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">Total Funded</div>
                <div className="text-2xl font-bold">{totalFunded.toLocaleString()} ALGO</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-bold text-destructive">{totalSpent.toLocaleString()} ALGO</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">Remaining</div>
                <div className="text-2xl font-bold text-primary">{(totalFunded - totalSpent).toLocaleString()} ALGO</div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contributions by Project</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Contribution (Pie)</CardTitle>
                <CardDescription>Share of funded amounts per project</CardDescription>
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
                  {projectData.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: p.color }} />
                        <span className="text-sm">{p.name}</span>
                      </div>
                      <span className="text-sm font-medium">{p.funded.toLocaleString()} ALGO</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funded vs Spent (Bar)</CardTitle>
                <CardDescription>Comparison of funding vs spending per project</CardDescription>
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
                      <Bar dataKey="Spent" fill="hsl(37 100% 55%)" />
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

  // Default (private) view remains similar to previous behavior
  return (
    <div className="space-y-8">
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
                  <Button variant="outline" size="sm" onClick={() => setShowDialog(true)}>
                    View Proofs
                  </Button>
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