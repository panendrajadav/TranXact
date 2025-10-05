import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDonationTracking } from "@/contexts/DonationTrackingProvider";
import { useProjects } from "@/contexts/ProjectProvider";
import { useWallet } from "@/contexts/WalletProvider";
import { toast } from "@/components/ui/use-toast";

export function AllocateFunds() {
  const { donations, addAllocation } = useDonationTracking();
  const { projects } = useProjects();
  const { account } = useWallet();
  const [selectedDonation, setSelectedDonation] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [allocationAmount, setAllocationAmount] = useState("");

  // Get donations received by this NGO (simplified - in real app would filter by NGO wallet)
  const receivedDonations = donations.filter(donation => 
    donation.organizationId === 'global-relief' || 
    donation.organizationId === 'childrens-health' ||
    donation.organizationId === 'environmental-protection'
  );

  const handleAllocate = () => {
    if (!selectedDonation || !selectedProject || !allocationAmount) {
      toast({
        title: "Missing Information",
        description: "Please select donation, project, and amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(allocationAmount);
    const donation = receivedDonations.find(d => d.id === selectedDonation);
    const project = projects.find(p => p.id === selectedProject);

    if (!donation || !project) return;

    // Check if allocation amount doesn't exceed remaining donation
    const totalAllocated = donation.allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
    const remaining = donation.amount - totalAllocated;

    if (amount > remaining) {
      toast({
        title: "Invalid Amount",
        description: `Cannot allocate more than remaining amount: ${remaining.toFixed(2)} ALGO`,
        variant: "destructive"
      });
      return;
    }

    addAllocation({
      donationId: selectedDonation,
      projectId: selectedProject,
      projectName: project.title,
      amount: amount,
      status: 'in-progress',
      date: new Date().toISOString(),
      transactionId: `ALLOC_${Date.now()}`
    });

    toast({
      title: "Allocation Successful",
      description: `${amount} ALGO allocated to ${project.title}`,
    });

    setSelectedDonation("");
    setSelectedProject("");
    setAllocationAmount("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Allocate Funds</h2>
        <p className="text-lg text-muted-foreground">Allocate received donations to specific projects</p>
      </div>

      {/* Received Donations */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Received Donations</h3>
        <div className="space-y-3">
          {receivedDonations.map((donation) => {
            const totalAllocated = donation.allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
            const remaining = donation.amount - totalAllocated;
            
            return (
              <Card key={donation.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{donation.amount.toFixed(2)} ALGO from Donor</div>
                      <div className="text-sm text-muted-foreground">{donation.reason}</div>
                      <div className="text-xs text-muted-foreground">{new Date(donation.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Remaining: <span className="font-medium">{remaining.toFixed(2)} ALGO</span></div>
                      <Badge variant={remaining > 0 ? "secondary" : "outline"}>
                        {remaining > 0 ? "Available" : "Fully Allocated"}
                      </Badge>
                    </div>
                  </div>
                  {donation.allocations.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm font-medium mb-2">Allocations:</div>
                      {donation.allocations.map((alloc) => (
                        <div key={alloc.id} className="flex justify-between text-sm">
                          <span>{alloc.projectName}</span>
                          <span>{alloc.amount.toFixed(2)} ALGO</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Allocation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select Donation</Label>
            <Select value={selectedDonation} onValueChange={setSelectedDonation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose donation to allocate from" />
              </SelectTrigger>
              <SelectContent>
                {receivedDonations.filter(d => {
                  const totalAllocated = d.allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
                  return d.amount > totalAllocated;
                }).map((donation) => (
                  <SelectItem key={donation.id} value={donation.id}>
                    {donation.amount.toFixed(2)} ALGO - {donation.reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Project</Label>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger>
                <SelectValue placeholder="Choose project to fund" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.title} - {project.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Allocation Amount (ALGO)</Label>
            <Input
              type="number"
              value={allocationAmount}
              onChange={(e) => setAllocationAmount(e.target.value)}
              placeholder="Enter amount to allocate"
            />
          </div>

          <Button onClick={handleAllocate} className="w-full">
            Allocate Funds
          </Button>
        </CardContent>
      </Card>

      {/* Project Status Overview */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Project Funding Status</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-muted-foreground">{project.organization}</div>
                    </div>
                    <Badge variant="secondary">{project.category}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>${project.raised.toLocaleString()} / ${project.target.toLocaleString()}</span>
                    </div>
                    <Progress value={(project.raised / project.target) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}