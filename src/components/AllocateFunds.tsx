import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDonations } from "@/contexts/DonationProvider";
import { useProjects } from "@/contexts/ProjectProvider";
import { useWallet } from "@/contexts/WalletProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import { toast } from "@/components/ui/use-toast";
<<<<<<< Updated upstream
=======
import { allocationService } from "@/lib/allocationService";
import { donationService, Donation } from "@/lib/donationService";
>>>>>>> Stashed changes

export function AllocateFunds() {
  const { donations, addAllocation } = useDonations();
  const { projects, updateProjectFunding } = useProjects();
  const { wallet, account, isConnected } = useWallet();
  const [selectedDonation, setSelectedDonation] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [allocationAmount, setAllocationAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dbDonations, setDbDonations] = useState<Donation[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(false);

  // Fetch donations from database when wallet connects
  useEffect(() => {
    const fetchDonations = async () => {
      if (!isConnected || !account) {
        setDbDonations([]);
        return;
      }
      
      setLoadingDonations(true);
      try {
        const walletDonations = await donationService.getDonationsByWallet(account);
        setDbDonations(walletDonations);
      } catch (error) {
        console.error('Failed to fetch donations:', error);
        toast({
          title: "Error",
          description: "Failed to load donations",
          variant: "destructive"
        });
      } finally {
        setLoadingDonations(false);
      }
    };

    fetchDonations();
  }, [account, isConnected]);

  // Filter donations with remaining funds (show only donations that aren't fully allocated)
  const receivedDonations = dbDonations.filter(donation => {
    const remaining = donation.amount - (donation.allocatedAmount || 0);
    return remaining > 0;
  });

  const handleAllocate = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to allocate funds",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDonation || !selectedProject || !allocationAmount) {
      toast({
        title: "Missing Information",
        description: "Please select donation, project, and amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(allocationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid allocation amount",
        variant: "destructive"
      });
      return;
    }

    const donation = receivedDonations.find(d => d.id === selectedDonation);
    const project = projects.find(p => p.id === selectedProject);

    if (!donation || !project) return;

    // Check if allocation amount doesn't exceed remaining donation
    const allocated = donation.allocatedAmount || 0;
    const remaining = donation.amount - allocated;

    if (amount > remaining) {
      toast({
        title: "Invalid Amount",
        description: `Cannot allocate more than remaining amount: ${remaining.toFixed(2)} ALGO`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const algoService = new AlgorandService(wallet, APP_CONFIG.algorand.useTestNet);
      
      toast({
        title: "Transaction Initiated",
        description: "Please check your wallet to sign the transaction"
      });

      // Transfer funds to project wallet
      const txnId = await algoService.sendPayment({
        from: account,
        to: project.wallet,
        amount: AlgorandService.algoToMicroAlgos(amount),
        note: `Fund allocation to ${project.title} from donation ${selectedDonation}`
      });

      // Add allocation record
      addAllocation(selectedDonation, {
        projectId: selectedProject,
        projectName: project.title,
        amount: amount,
        status: 'completed',
        date: new Date().toISOString()
      });

<<<<<<< Updated upstream
=======
      // Store allocation in Cosmos DB
      try {
        await allocationService.createAllocation({
          projectId: selectedProject,
          projectName: project.title,
          amount: amount,
          purpose: `Fund allocation from donation ${selectedDonation}`,
          allocatedBy: account,
          walletAddress: account,
          status: 'completed'
        });
        
        // Update donation allocated amount
        const donation = receivedDonations.find(d => d.id === selectedDonation);
        if (donation) {
          const newAllocatedAmount = (donation.allocatedAmount || 0) + amount;
          await donationService.updateDonation(selectedDonation, {
            allocatedAmount: newAllocatedAmount
          });
          
          // Refresh donations list
          const updatedDonations = await donationService.getDonationsByWallet(account);
          setDbDonations(updatedDonations);
        }
      } catch (dbError) {
        console.error('Failed to store allocation in database:', dbError);
      }

>>>>>>> Stashed changes
      // Update project funding
      updateProjectFunding(selectedProject, amount);

      toast({
        title: "Allocation Successful",
        description: `${amount} ALGO transferred to ${project.title}. Transaction ID: ${txnId.slice(0, 10)}...`
      });

      setSelectedDonation("");
      setSelectedProject("");
      setAllocationAmount("");
    } catch (error: any) {
      console.error('Allocation failed:', error);
      let errorMessage = "Failed to allocate funds";
      
      if (error.message?.includes('User rejected') || error.message?.includes('cancelled')) {
        errorMessage = "Transaction was cancelled by user";
      } else if (error.message?.includes('insufficient')) {
        errorMessage = "Insufficient balance for transaction";
      }
      
      toast({
        title: "Allocation Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Allocate Funds</h2>
          <p className="text-lg text-muted-foreground">Allocate received donations to specific projects</p>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <Button 
            variant="outline" 
            onClick={() => {
              console.log('Current donations:', donations);
              console.log('Current projects:', projects);
              console.log('Connected account:', account);
            }}
          >
            Debug Info
          </Button>
        )}
      </div>

      {/* Received Donations */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Received Donations ({receivedDonations.length})</h3>
        {loadingDonations ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Loading donations...</p>
            </CardContent>
          </Card>
        ) : receivedDonations.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No donations available for allocation.</p>
              <p className="text-sm text-muted-foreground mt-2">Make sure donations have been made through the Send Funds page.</p>
            </CardContent>
          </Card>
        ) : null}
        <div className="space-y-3">
          {receivedDonations.map((donation) => {
            const allocated = donation.allocatedAmount || 0;
            const remaining = donation.amount - allocated;
            
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
                      <div className="text-xs text-muted-foreground">Allocated: {allocated.toFixed(2)} ALGO</div>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
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
                {receivedDonations.map((donation) => {
                  const remaining = donation.amount - (donation.allocatedAmount || 0);
                  return (
                    <SelectItem key={donation.id} value={donation.id}>
                      {remaining.toFixed(2)} ALGO available - {donation.reason}
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
                      <span>{project.raised.toLocaleString()} ALGO / {project.target.toLocaleString()} ALGO</span>
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