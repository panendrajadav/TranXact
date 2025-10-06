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
    duration: ""
  });

  // Organization wallet addresses (same as in SendFunds)
  const NGO_WALLETS = {
    'Global Relief Fund': '6JSEKQ6JGA56ECOZ25ABSLJVKLDOME3KUGDFKPEQCA3LCNMA5E2ZZNC23E',
    'Children\'s Health Initiative': 'OFDV5E5ZTP45MHXCQQ5EHIXAKIJ2BXGMFAAYU6Z2NG4MZTNCB3BOYXIBSQ',
    'Environmental Protection Alliance': 'B6JK2QA7LUPS2S7H3Y3L33ROXUFSDJICDJZC4FUJMRJWBXDQJVKL2LCGJM',
    'Animal Welfare Society': 'PC26UP77QZPOUSTG4O4NG4GOQ3KXFBZ2UPF67XN5JOAYSW4CUKG6ML5VMA',
    'Disaster Relief Coalition': 'TBEJZ26MKWXQXTQW5K43DN7NQQA6OGC76DHYIPXDQMDPZF4R3HKFMNZSDI',
    'TranXact Foundation': '6JSEKQ6JGA56ECOZ25ABSLJVKLDOME3KUGDFKPEQCA3LCNMA5E2ZZNC23E' // Default
  } as const;

  // Fetch wallet balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!wallet) return;
      
      const algoService = new AlgorandService(wallet, APP_CONFIG.algorand.useTestNet);
      const balances: {[key: string]: number} = {};
      
      for (const [orgName, address] of Object.entries(NGO_WALLETS)) {
        try {
          const balance = await algoService.getBalance(address);
          balances[address] = balance;
        } catch (error) {
          console.error(`Failed to fetch balance for ${orgName}:`, error);
          balances[address] = 0;
        }
      }
      
      setWalletBalances(balances);
    };
    
    fetchBalances();
  }, [wallet, projects]);

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.target) return;

    const orgName = newProject.organization || "TranXact Foundation";
    const walletAddress = NGO_WALLETS[orgName as keyof typeof NGO_WALLETS] || NGO_WALLETS['TranXact Foundation'];

    const project = {
      id: Date.now().toString(),
      title: newProject.title,
      organization: orgName,
      description: newProject.description,
      category: newProject.category,
      location: newProject.location,
      target: parseInt(newProject.target),
      raised: 0,
      backers: 0,
      wallet: walletAddress
    };

    addProject(project);
    setNewProject({
      title: "",
      organization: "",
      description: "",
      category: "",
      location: "",
      target: "",
      duration: ""
    });
    setShowCreateForm(false);
  };

  const handleDeleteProject = (projectId: string) => {
    removeProject(projectId);
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
              <div>
                <Label htmlFor="organization">Organization</Label>
                <Select value={newProject.organization} onValueChange={(value) => setNewProject({...newProject, organization: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Global Relief Fund">Global Relief Fund</SelectItem>
                    <SelectItem value="Children's Health Initiative">Children's Health Initiative</SelectItem>
                    <SelectItem value="Environmental Protection Alliance">Environmental Protection Alliance</SelectItem>
                    <SelectItem value="Animal Welfare Society">Animal Welfare Society</SelectItem>
                    <SelectItem value="Disaster Relief Coalition">Disaster Relief Coalition</SelectItem>
                    <SelectItem value="TranXact Foundation">TranXact Foundation</SelectItem>
                  </SelectContent>
                </Select>
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
                  <span className="text-muted-foreground">
                    of {(() => {
                      const baseTarget = project.target > 100 ? (project.target > 1000 ? 10 : 5) : project.target;
                      const currentFunded = walletBalances[project.wallet] || 0;
                      return currentFunded >= (baseTarget - 5) ? baseTarget + 5 : baseTarget;
                    })()} ALGO
                  </span>
                </div>
                <Progress 
                  value={(() => {
                    const baseTarget = project.target > 100 ? (project.target > 1000 ? 10 : 5) : project.target;
                    const currentFunded = walletBalances[project.wallet] || 0;
                    const adjustedTarget = currentFunded >= (baseTarget - 5) ? baseTarget + 5 : baseTarget;
                    return (currentFunded / adjustedTarget) * 100;
                  })()} 
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