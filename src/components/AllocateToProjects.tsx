import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDonations } from "@/contexts/DonationProvider";
import { useProjects } from "@/contexts/ProjectProvider";
import { useWallet } from "@/contexts/WalletProvider";
import { useAuth } from "@/contexts/AuthProvider";
import { AlgorandService } from "@/lib/algorand";
import { TransactionAPI } from "@/lib/transactionAPI";
import { toast } from "@/components/ui/use-toast";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

export function AllocateToProjects() {
  const { getOrganizationDonations, addAllocation } = useDonations();
  const { projects, updateProjectFunding } = useProjects();
  const { userName } = useAuth();
  const [selectedDonation, setSelectedDonation] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [amount, setAmount] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [organizationDonations, setOrganizationDonations] = useState<any[]>([]);
  const { wallet, account, isConnected } = useWallet();

  useEffect(() => {
    const fetchDonations = async () => {
      if (account) {
        try {
          // Only get organization-specific donations to avoid duplicates
          const orgDonations = await getOrganizationDonations(account);
          setOrganizationDonations(orgDonations);
        } catch (error) {
          console.error('Failed to fetch donations:', error);
        }
      }
    };
    
    fetchDonations();
  }, [account, getOrganizationDonations]);

  const availableDonations = organizationDonations.filter(d => {
    const allocated = d.allocations?.reduce((sum: number, a: any) => sum + a.amount, 0) || 0;
    const hasRemainingFunds = d.amount > allocated;
    return hasRemainingFunds;
  });

  const handleAllocate = async () => {
    if (isProcessing) return; // Prevent duplicate calls
    
    if (!isConnected || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to allocate funds",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDonation || !selectedProject || !amount) return;

    const donation = organizationDonations.find(d => d.id === selectedDonation);
    const project = projects.find(p => p.id === selectedProject);
    const allocAmount = parseFloat(amount);

    if (!donation || !project) return;

    const allocated = donation.allocations?.reduce((sum, a) => sum + a.amount, 0) || 0;
    if (allocated + allocAmount > donation.amount) {
      toast({
        title: "Invalid Amount",
        description: `Cannot allocate ${allocAmount} ALGO. Only ${(donation.amount - allocated).toFixed(2)} ALGO remaining.`,
        variant: "destructive"
      });
      return;
    }

    if (!project.wallet) {
      toast({
        title: "No Wallet Address",
        description: `Project ${project.title} does not have a wallet address configured`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const algoService = new AlgorandService(wallet, true);
      
      toast({
        title: "Processing Transaction",
        description: "Please confirm the transaction in your wallet"
      });

      // Transfer funds to project wallet
      const txnId = await algoService.sendPayment({
        from: account,
        to: project.wallet,
        amount: AlgorandService.algoToMicroAlgos(allocAmount),
        note: `Fund allocation to ${project.title}`
      });

      // Store sent transaction in CosmosDB (non-blocking)
      TransactionAPI.storeTransaction({
        transactionId: `alloc_sent_${Date.now()}`,
        type: 'sent',
        organization: project.title,
        amount: allocAmount,
        status: 'confirmed',
        gasUsed: 0.001,
        notes: `Fund allocation to ${project.title}`
      }).catch(error => console.error('Failed to store sent transaction:', error));

      // Store received transaction for project (non-blocking)
      TransactionAPI.storeTransaction({
        transactionId: `alloc_received_${Date.now()}`,
        type: 'received',
        organization: project.organization,
        amount: allocAmount,
        status: 'confirmed',
        gasUsed: 0,
        notes: `Received allocation for ${project.title}`
      }).catch(error => console.error('Failed to store received transaction:', error));

      // Add allocation to the donation record
      const allocation = {
        projectName: project.title,
        projectId: selectedProject,
        amount: allocAmount,
        status: 'completed',
        date: new Date().toISOString(),
        allocatedBy: account,
        transactionId: txnId
      };
      
      // Update the donation's allocations array in the database
      await TransactionAPI.addAllocation(selectedDonation, allocation);
      
      // Refresh the donations list to show updated allocations (don't use context to avoid duplicates)
      const orgDonations = await getOrganizationDonations(account);
      setOrganizationDonations(orgDonations);

      toast({
        title: "Allocation Successful",
        description: `${allocAmount} ALGO transferred to ${project.title}. Tx: ${txnId.slice(0, 8)}...`
      });

      setSelectedDonation("");
      setSelectedProject("");
      setAmount("");
    } catch (error: any) {
      console.error('Allocation failed:', error);
      toast({
        title: "Allocation Failed",
        description: error.message || "Failed to transfer funds to project",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
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
            {organizationDonations.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground">
                No donations found for this organization
              </div>
            ) : availableDonations.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground">
                All donations are fully allocated
                <div className="mt-2 text-sm">
                  {organizationDonations.map(d => {
                    const allocated = d.allocations?.reduce((sum: number, a: any) => sum + a.amount, 0) || 0;
                    return (
                      <div key={d.id} className="p-2 border rounded mt-1">
                        {d.amount} ALGO (allocated: {allocated})
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              availableDonations.map((donation, index) => {
                const allocated = donation.allocations?.reduce((sum: number, a: any) => sum + a.amount, 0) || 0;
                const remaining = donation.amount - allocated;
                return (
                  <div key={`${donation.id}-${index}`} className="p-3 border rounded">
                    <div className="font-medium">{donation.amount} ALGO from Donor</div>
                    <div className="text-sm text-muted-foreground">{donation.reason}</div>
                    <div className="text-sm">Remaining: {remaining.toFixed(2)} ALGO</div>
                  </div>
                );
              })
            )}
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
                  {availableDonations.map((donation, index) => {
                    const allocated = donation.allocations?.reduce((sum: number, a: any) => sum + a.amount, 0) || 0;
                    const remaining = donation.amount - allocated;
                    return (
                      <SelectItem key={`${donation.id}-${index}`} value={donation.id}>
                        {remaining.toFixed(2)} ALGO remaining - {donation.reason}
                      </SelectItem>
                    );
                  })}
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

            <Button onClick={handleAllocate} className="w-full" disabled={isProcessing || !isConnected}>
              {isProcessing ? "Processing..." : "Allocate Funds"}
            </Button>
            {!isConnected && (
              <p className="text-sm text-muted-foreground text-center">
                Connect your wallet to allocate funds
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
}