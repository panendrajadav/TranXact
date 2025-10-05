import { useState } from "react";
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


  const [newProject, setNewProject] = useState({
    title: "",
    organization: "",
    description: "",
    category: "",
    location: "",
    target: "",
    duration: ""
  });

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.target) return;

    const project = {
      id: Date.now().toString(),
      title: newProject.title,
      organization: newProject.organization || "TranXact Foundation",
      description: newProject.description,
      category: newProject.category,
      location: newProject.location,
      target: parseInt(newProject.target),
      raised: 0,
      backers: 0,
      wallet: `WALLET_${Date.now()}`
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
                <Input
                  id="organization"
                  value={newProject.organization}
                  onChange={(e) => setNewProject({...newProject, organization: e.target.value})}
                  placeholder="Organization name"
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