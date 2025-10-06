import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDonations } from "@/contexts/DonationProvider";
import { useProjects } from "@/contexts/ProjectProvider";
import { toast } from "@/components/ui/use-toast";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

export function AllocateToProjects() {
  const { donations, addAllocation } = useDonations();
  const { projects, updateProjectFunding } = useProjects();
  const [selectedDonation, setSelectedDonation] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [amount, setAmount] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const availableDonations = donations.filter(d => {
    const allocated = d.allocations.reduce((sum, a) => sum + a.amount, 0);
    return d.amount > allocated;
  });

  const handleAllocate = () => {
    if (!selectedDonation || !selectedProject || !amount) return;

    const donation = donations.find(d => d.id === selectedDonation);
    const project = projects.find(p => p.id === selectedProject);
    const allocAmount = parseFloat(amount);

    if (!donation || !project) return;

    const allocated = donation.allocations.reduce((sum, a) => sum + a.amount, 0);
    if (allocated + allocAmount > donation.amount) {
      toast({
        title: "Invalid Amount",
        description: "Cannot allocate more than available donation amount",
        variant: "destructive"
      });
      return;
    }

    addAllocation(selectedDonation, {
      projectName: project.title,
      projectId: selectedProject,
      amount: allocAmount,
      status: 'in-progress',
      date: new Date().toISOString()
    });

    // Update project funding
    updateProjectFunding(selectedProject, allocAmount);

    toast({
      title: "Allocation Successful",
      description: `${allocAmount} ALGO allocated to ${project.title}`
    });

    setSelectedDonation("");
    setSelectedProject("");
    setAmount("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Allocate to Projects</h2>
        <p className="text-lg text-muted-foreground">Allocate received donations to specific projects</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Donations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableDonations.map((donation) => {
              const allocated = donation.allocations.reduce((sum, a) => sum + a.amount, 0);
              const remaining = donation.amount - allocated;
              return (
                <div key={donation.id} className="p-3 border rounded">
                  <div className="font-medium">{donation.amount} ALGO from Donor</div>
                  <div className="text-sm text-muted-foreground">{donation.reason}</div>
                  <div className="text-sm">Remaining: {remaining.toFixed(2)} ALGO</div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Allocate Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Donation</Label>
              <Select value={selectedDonation} onValueChange={setSelectedDonation}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose donation" />
                </SelectTrigger>
                <SelectContent>
                  {availableDonations.map((donation) => (
                    <SelectItem key={donation.id} value={donation.id}>
                      {donation.amount} ALGO - {donation.reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Amount (ALGO)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            <Button onClick={handleAllocate} className="w-full">
              Allocate Funds
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
}