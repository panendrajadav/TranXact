import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import Header from "@/components/Header";

const SendFunds = () => {
  const navigate = useNavigate();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const organizations = [
    {
      id: "global-relief",
      name: "Global Relief Fund",
      description: "TechCorp's donation of $10,000 helped provide essential supplies to 2,000 families affected by the recent earthquake.",
      image: "/api/placeholder/300/200",
      category: "Disaster Relief"
    },
    {
      id: "childrens-health",
      name: "Children's Health Initiative",
      description: "TechCorp's donation of $5,000 contributed to the vaccination of 1,000 children against preventable diseases.",
      image: "/api/placeholder/300/200",
      category: "Healthcare"
    },
    {
      id: "environmental-protection",
      name: "Environmental Protection Alliance",
      description: "TechCorp's donation of $3,000 supported the planting of 4,000 trees in a reforestation project.",
      image: "/api/placeholder/300/200",
      category: "Environment"
    },
    {
      id: "animal-welfare",
      name: "Animal Welfare Society",
      description: "TechCorp's donation of $1,500 helped provide shelter and care for 600 rescued animals.",
      image: "/api/placeholder/300/200",
      category: "Animal Welfare"
    },
    {
      id: "disaster-relief",
      name: "Disaster Relief Coalition",
      description: "TechCorp's donation of $8,000 assisted in providing temporary housing for 1,200 individuals displaced by the recent floods.",
      image: "/api/placeholder/300/200",
      category: "Disaster Relief"
    }
  ];

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmDonation = () => {
    if (selectedOrg && amount) {
      navigate('/success', { 
        state: { 
          organization: organizations.find(org => org.id === selectedOrg)?.name,
          amount: amount 
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold">Send Funds</h1>

          {/* Select Organization */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Select Organization</h2>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search for an organization"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredOrgs.map((org) => (
                <Card 
                  key={org.id}
                  className={`cursor-pointer transition-all border-2 ${
                    selectedOrg === org.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedOrg(org.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{org.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{org.description}</p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {org.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Donation Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Donation Details</h2>
            
            <div className="grid gap-6">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Currency</Label>
                <div className="mt-1 text-muted-foreground">USD</div>
              </div>
            </div>
          </section>

          {/* Review Transaction */}
          {selectedOrg && amount && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Review Transaction</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organization</span>
                      <span className="font-medium">
                        {organizations.find(org => org.id === selectedOrg)?.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">${amount}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Currency</span>
                      <span className="font-medium">USD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleConfirmDonation}
                className="w-full mt-6"
                size="lg"
              >
                Confirm Donation
              </Button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default SendFunds;