import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Calendar, MapPin, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { useProjects } from "@/contexts/ProjectProvider";
import { useDonations } from "@/contexts/DonationProvider";
import { useWallet } from "@/contexts/WalletProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import { TransactionService } from "@/lib/transactionService";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const Projects = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { projects } = useProjects();
  const { donations } = useDonations();
  const { wallet } = useWallet();
  const [walletBalances, setWalletBalances] = useState<{[key: string]: number}>({});
  const [transactionCounts, setTransactionCounts] = useState<{[key: string]: number}>({});

  // Fetch wallet balances and transaction counts
  useEffect(() => {
    const fetchData = async () => {
      if (!wallet) return;
      
      const algoService = new AlgorandService(wallet, APP_CONFIG.algorand.useTestNet);
      const transactionService = new TransactionService();
      const balances: {[key: string]: number} = {};
      const txCounts: {[key: string]: number} = {};
      
      for (const project of projects) {
        try {
          const balance = await algoService.getBalance(project.wallet);
          balances[project.wallet] = balance;
          
          const transactions = await transactionService.getAccountTransactions(project.wallet, 100);
          txCounts[project.wallet] = transactions.filter(tx => tx.type === 'received').length;
        } catch (error) {
          console.error(`Failed to fetch data for ${project.title}:`, error);
          balances[project.wallet] = 0;
          txCounts[project.wallet] = 0;
        }
      }
      
      setWalletBalances(balances);
      setTransactionCounts(txCounts);
      
      // Update backers and raised in database
      for (const project of projects) {
        const currentTxCount = txCounts[project.wallet] || 0;
        const currentBalance = balances[project.wallet] || 0;
        try {
          await fetch(`http://localhost:3002/api/projects/${project.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ backers: currentTxCount, raised: currentBalance })
          });
        } catch (error) {
          console.error(`Failed to update project data for ${project.title}:`, error);
        }
      }
    };
    
    fetchData();
  }, [wallet, projects]);

  // Use wallet balances and transaction counts for project data
  const projectsWithAllocations = projects.map(project => {
    const walletBalance = walletBalances[project.wallet] || 0;
    const txCount = transactionCounts[project.wallet] || 0;
    
    return {
      ...project,
      raised: walletBalance,
      backers: txCount,
      daysLeft: Math.floor(Math.random() * 60) + 10,
      status: walletBalance >= project.target ? "completed" : "active",
      image: project.title === "Emergency Food Supplies" ? "src/assets/emergencyfoodsupplies.png" : 
             project.title === "Rural Development" ? "src/assets/ruraldevelopment.png" : 
             "src/assets/children.jpg"
    };
  });



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'urgent':
        return 'bg-red-500';
      default:
        return 'bg-primary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'urgent':
        return 'Urgent';
      default:
        return 'Active';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showAuthButtons />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Active Projects</h1>
            <p className="text-muted-foreground text-lg">
              Support ongoing projects that are making a real impact worldwide
            </p>
          </div>

          {/* Featured Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">{projects.length}</div>
                <div className="text-muted-foreground">Active Projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">{Object.values(walletBalances).reduce((sum, balance) => sum + balance, 0).toFixed(2)} ALGO</div>
                <div className="text-muted-foreground">Funds Raised</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">{Object.values(transactionCounts).reduce((sum, count) => sum + count, 0)}</div>
                <div className="text-muted-foreground">Total Backers</div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsWithAllocations.map((project, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="h-48 rounded-t-lg overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
                  <Badge 
                    className={`absolute top-3 right-3 text-white ${getStatusColor(project.status)}`}
                  >
                    {getStatusText(project.status)}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{project.organization}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{project.raised.toLocaleString()} ALGO</span>
                      <span className="text-muted-foreground">
                        of {project.target.toLocaleString()} ALGO
                      </span>
                    </div>
                    <Progress 
                      value={(project.raised / project.target) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      {project.backers} backers
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {project.daysLeft > 0 ? `${project.daysLeft} days left` : 'Completed'}
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={project.status === 'completed'}
                    onClick={() => setShowDialog(true)}
                  >
                    {project.status === 'completed' ? 'Completed' : 'Support This Project'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default Projects;