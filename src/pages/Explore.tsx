import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Header from "@/components/Header";

const Explore = () => {
  const organizations = [
    {
      name: "Education for All",
      description: "Supporting education in rural areas by providing school supplies and infrastructure",
      category: "Education",
      impact: "2,500 students helped",
      funding: "$45,000 raised",
      image: "src/assets/education.jpg"
    },
    {
      name: "Healthcare Access",
      description: "Providing medical supplies and healthcare services to underserved communities",
      category: "Healthcare", 
      impact: "10,000 patients treated",
      funding: "$78,000 raised",
      image: "src/assets/healthcare.jpg"
    },
    {
      name: "Clean Water Initiative",
      description: "Building wells and water purification systems in communities without clean water access",
      category: "Environment",
      impact: "50 wells built",
      funding: "$120,000 raised",
      image: "src/assets/water.jpg"
    },
    {
      name: "Environmental Protection Alliance",
      description: "Protecting natural habitats and promoting sustainable practices",
      category: "Environment",
      impact: "5,000 trees planted",
      funding: "$32,000 raised",
      image: "src/assets/environment.jpeg"
    },
    {
      name: "Disaster Relief Coalition",
      description: "Providing emergency aid and support to communities affected by natural disasters",
      category: "Disaster Relief",
      impact: "1,200 families helped",
      funding: "$95,000 raised",
      image: "src/assets/disaster.jpg"
    },
    {
      name: "Children's Health Initiative",
      description: "Improving children's health through vaccination programs and nutrition support",
      category: "Healthcare",
      impact: "3,000 children vaccinated",
      funding: "$56,000 raised",
      image: "src/assets/children.jpg"
    }
  ];

  const categories = ["All", "Education", "Healthcare", "Environment", "Disaster Relief"];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuthButtons />
      
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Explore Organizations</h1>
            <p className="text-muted-foreground text-lg">
              Discover impactful organizations and causes you can support
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search organizations..."
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant={category === "All" ? "default" : "secondary"}
                  className="cursor-pointer"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Organizations Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="h-48 rounded-t-lg overflow-hidden">
                  <img src={org.image} alt={org.name} className="object-cover w-full h-full" />
                </div>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{org.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {org.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {org.description}
                    </p>
                    
                    <div className="space-y-1 text-sm">
                      <div className="text-success font-medium">{org.impact}</div>
                      <div className="text-primary font-medium">{org.funding}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Statistics */}
          <section className="text-center pt-12">
            <h2 className="text-3xl font-semibold mb-8">Platform Impact</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary">150+</div>
                  <div className="text-muted-foreground">Organizations</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary">$2.5M</div>
                  <div className="text-muted-foreground">Total Donated</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-muted-foreground">Lives Impacted</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary">25+</div>
                  <div className="text-muted-foreground">Countries</div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Explore;