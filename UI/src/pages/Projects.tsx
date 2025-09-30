import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Calendar, MapPin, Target } from "lucide-react";
import { useState } from "react";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const Projects = () => {
  const [showDialog, setShowDialog] = useState(false);

  const projects = [
    {
      title: "Rural School Development",
      organization: "Education for All",
      description: "Building new classrooms and providing educational materials for children in remote villages.",
      category: "Education",
      location: "Kenya, East Africa",
      target: 50000,
      raised: 35000,
      backers: 245,
      daysLeft: 23,
      status: "active",
      image: "src/assets/children1.jpg"
    },
    {
      title: "Clean Water Access Project",
      organization: "Clean Water Initiative",
      description: "Installing water purification systems in communities without access to clean drinking water.",
      category: "Environment",
      location: "Bangladesh",
      target: 75000,
      raised: 68000,
      backers: 412,
      daysLeft: 45,
      status: "active",
      image: "src/assets/water1.jpg"
    },
    {
      title: "Emergency Medical Supplies",
      organization: "Healthcare Access",
      description: "Providing essential medical equipment and supplies to rural healthcare centers.",
      category: "Healthcare",
      location: "Guatemala",
      target: 30000,
      raised: 30000,
      backers: 198,
      daysLeft: 0,
      status: "completed",
      image: "src/assets/medical.jpg"
    },
    {
      title: "Reforestation Initiative",
      organization: "Environmental Protection Alliance",
      description: "Planting native trees to restore damaged ecosystems and combat climate change.",
      category: "Environment",
      location: "Brazil",
      target: 100000,
      raised: 25000,
      backers: 156,
      daysLeft: 67,
      status: "active",
      image: "src/assets/reforestation.webp"

    },
    {
      title: "Disaster Recovery Support",
      organization: "Disaster Relief Coalition",
      description: "Helping communities rebuild after natural disasters with emergency housing and supplies.",
      category: "Disaster Relief",
      location: "Philippines",
      target: 120000,
      raised: 89000,
      backers: 523,
      daysLeft: 12,
      status: "urgent",
      image: "src/assets/disaster.jpg"
    },
    {
      title: "Child Nutrition Program",
      organization: "Children's Health Initiative",
      description: "Providing nutritious meals and supplements to undernourished children.",
      category: "Healthcare",
      location: "Ethiopia",
      target: 40000,
      raised: 18000,
      backers: 134,
      daysLeft: 34,
      status: "active",
      image: "src/assets/nutrition.png"
    }
  ];

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
                <div className="text-3xl font-bold text-primary">45</div>
                <div className="text-muted-foreground">Active Projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">$1.2M</div>
                <div className="text-muted-foreground">Funds Raised</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">15K+</div>
                <div className="text-muted-foreground">Total Backers</div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
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
                      <span className="font-medium">${project.raised.toLocaleString()}</span>
                      <span className="text-muted-foreground">
                        of ${project.target.toLocaleString()}
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