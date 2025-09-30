import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { Shield, Target, Users } from "lucide-react";

const GetStarted = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Transparency & Security",
      description: "Every transaction is recorded on the blockchain, ensuring complete transparency and security of your donations."
    },
    {
      icon: Target,
      title: "Direct Impact",
      description: "Your contribution goes directly to the cause, eliminating intermediaries and maximizing impact."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a global network of donors and organizations committed to making a difference."
    }
  ];

  const organizations = [
    {
      title: "Education for All",
      description: "Supporting education in rural areas",
      image: "/src/assets/education.jpg"
    },
    {
      title: "Healthcare Access",
      description: "Providing medical supplies to underserved communities",
      image: "/src/assets/healthcare.jpg"
    },
    {
      title: "Clean Water Initiative",
      description: "Building wells for clean water access",
      image: "/src/assets/water.jpg"
    }
  ];

  const impactStats = [
    { label: "Total Lives Impacted", value: "1,500+" },
    { label: "Projects Completed", value: "30" },
    { label: "Total Donations", value: "$25,000" }
  ];

  const globalStats = [
    { label: "Total Donations", value: "$15,000" },
    { label: "Projects Supported", value: "25" },
    { label: "Lives Impacted", value: "500+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuthButtons />
      
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Why Choose TranXact Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose TranXact?</h2>
            <p className="text-muted-foreground text-lg">
              Experience a new standard in charitable giving with our blockchain-powered platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Organizations */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Featured Organizations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {organizations.map((org, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-muted">
                  <img src={org.image} alt={org.title} className="object-cover w-full h-full" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{org.title}</h3>
                  <p className="text-muted-foreground text-sm">{org.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Stats */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Impact of Donations</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {impactStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Global Impact */}
        <section>
          <h2 className="text-3xl font-bold mb-8">Global Impact</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {globalStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default GetStarted;