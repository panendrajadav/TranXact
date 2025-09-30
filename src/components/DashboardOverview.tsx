import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";
import { useState } from "react";

const DashboardOverview = () => {
  const [showDialog, setShowDialog] = useState(false);

  const impactStats = [
    { label: "Total Donations", value: "$15,000" },
    { label: "Projects Supported", value: "25" },
    { label: "Lives Impacted", value: "500+" }
  ];

  const donations = [
    {
      amount: "$500",
      description: "School books purchased for 100 children",
      category: "Education",
      status: "active"
    },
    {
      amount: "$200",
      description: "Medical supplies for underserved communities",
      category: "Healthcare",
      status: "active"
    }
  ];

  const history = [
    { type: "donation", description: "Donation to Education for All", amount: "$500" },
    { type: "received", description: "Received Donation from Friend", amount: "$100" },
    { type: "donation", description: "Donation to Healthcare Access", amount: "$200" }
  ];

  return (
    <div className="space-y-8">
      {/* My Impact Stats */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Impact</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {impactStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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

      {/* Donation History */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Donation History</h2>
        <div className="space-y-3">
          {history.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs">💰</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.description}</div>
                    <div className="text-sm text-muted-foreground">{item.amount}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Impact Tracker */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Impact Tracker</h2>
        <Card>
          <CardContent className="p-6 align-center">
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-1">Donation Distribution</div>
              <div className="text-2xl font-bold">$700</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 items-end">
              <div className="text-center flex flex-col justify-end">
                <div className="h-16 bg-primary/20 rounded mb-2"></div>
                <div className="text-sm text-primary">Education (60%)</div>
              </div>
              <div className="text-center flex flex-col justify-end">
                <div className="h-12 bg-teal/20 rounded mb-2"></div>
                <div className="text-sm text-teal">Healthcare (30%)</div>
              </div>
              <div className="text-center flex flex-col justify-end">
                <div className="h-8 bg-muted rounded mb-2"></div>
                <div className="text-sm text-muted-foreground">Other (10%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default DashboardOverview;