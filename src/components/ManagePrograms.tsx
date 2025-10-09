import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, MapPin, Target, Calendar, Trash2 } from "lucide-react";
import { useProjects } from "@/contexts/ProjectProvider";
import { useWallet } from "@/contexts/WalletProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";
import { projectService } from "@/lib/projectService";
import { toast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: string;
  location: string;
  target: number;
  raised: number;
  backers: number;
  daysLeft: number;
  status: string;
  image: string;
}

export function ManagePrograms() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { projects, addProject, removeProject } = useProjects();
  const { wallet } = useWallet();
  const [walletBalances, setWalletBalances] = useState<{[key: string]: number}>({});


  const [newProject, setNewProject] = useState({
    title: "",
    organization: "",
    description: "",
    category: "",
    location: "",
    target: "",
    duration: "",
    walletAddress: ""
  });

  // Organization wallet addresses
  const NGO_WALLETS = {
    'Rural Development': 'C357R4KJBSBYRAE4XGV4LVNW5RR3AELXTTWNVEGJIEDK3HAM2GTIJTH5RU',
    'Emergency Food Supplies': 'U6XN23YTKDI6UT3FAE5ZIGJSOHUGHLI4Z4G5V77RPUSI3P5USYW5JFKH3I',
    'Child Healthcare': 'Q2DY24TCFJHIFQO7QAPKMETED5BKKVKQ7UVOCIEREIUUZ7DDKMZMJ2RHRI'
  } as const;

  // Fetch wallet balances
  useEffect(() => {
    const fetchBalances = async () => {
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
    
    fetchBalances();
    
    // Refresh balances every 10 seconds
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [wallet, projects]);

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.target) return;

    const orgName = newProject.organization || "Rural Development";
    const walletAddress = newProject.walletAddress || NGO_WALLETS[orgName as keyof typeof NGO_WALLETS] || NGO_WALLETS['Rural Development'];

    const project = {
      title: newProject.title,
      organization: orgName,
      description: newProject.description,
      category: newProject.category,
      location: newProject.location,
      target: parseInt(newProject.target),
      raised: 0,
      backers: 0,
      wallet: walletAddress,
      status: 'active' as const
    };

    try {
      // Store in Cosmos DB
      const savedProject = await projectService.createProject(project);
      
      // Add to local state
      addProject(savedProject);
      
      toast({
        title: "Project Created",
        description: `${project.title} has been created successfully`
      });
    } catch (error) {
      console.error('Failed to create project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    }
    setNewProject({
      title: "",
      organization: "",
      description: "",
      category: "",
      location: "",
      target: "",
      duration: "",
      walletAddress: ""
    });
    setShowCreateForm(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      // Delete from Cosmos DB
      await projectService.deleteProject(projectId);
      
      // Remove from local state
      removeProject(projectId);
      
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully"
      });
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Manage Programs</h2>
          <p className="text-lg text-muted-foreground">Create and manage funding programs for private donors</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  placeholder="Enter project title"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                placeholder="Describe the project and its impact"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newProject.category} onValueChange={(value) => setNewProject({...newProject, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Disaster Relief">Disaster Relief</SelectItem>
                    <SelectItem value="Food Security">Food Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newProject.location}
                  onChange={(e) => setNewProject({...newProject, location: e.target.value})}
                  placeholder="Project location"
                />
              </div>
              <div>
                <Label htmlFor="target">Target Amount (ALGO)</Label>
                <Input
                  id="target"
                  type="number"
                  value={newProject.target}
                  onChange={(e) => setNewProject({...newProject, target: e.target.value})}
                  placeholder="Funding goal"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="walletAddress">Project Wallet Address</Label>
              <Input
                id="walletAddress"
                value={newProject.walletAddress}
                onChange={(e) => setNewProject({...newProject, walletAddress: e.target.value})}
                placeholder="Enter Algorand wallet address for receiving funds"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleCreateProject}>Create Project</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <div className="h-48 rounded-t-lg overflow-hidden relative">
              <img src="src/assets/children.jpg" alt={project.title} className="object-cover w-full h-full" />
              <Badge className="absolute top-3 right-3 text-white bg-primary">
                Active
              </Badge>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-3 left-3"
                onClick={() => handleDeleteProject(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
                  <span className="font-medium">{(walletBalances[project.wallet] || 0).toFixed(2)} ALGO</span>
                  <span className="text-muted-foreground">of {project.target} ALGO target</span>
                </div>
                <Progress 
                  value={((walletBalances[project.wallet] || 0) / project.target) * 100} 
                  className="h-2"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-1" />
                  {project.backers} backers
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowDialog(true)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowDialog(true)}>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
}