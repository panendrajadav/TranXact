import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, MapPin, Target } from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletProvider";
import { useProjects } from "@/contexts/ProjectProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import { toast } from "@/components/ui/use-toast";

const SendFundsPublic = () => {
  const navigate = useNavigate();
  const { wallet, account, isConnected } = useWallet();
  const { projects, updateProjectFunding } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);



  const handleConfirmDonation = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a donation",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProject || !amount || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a project, enter an amount, and provide a reason",
        variant: "destructive",
      });
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const algoService = new AlgorandService(wallet, APP_CONFIG.algorand.useTestNet);
      const project = projects.find(p => p.id === selectedProject);
      
      if (!project) {
        throw new Error('Project not found');
      }

      toast({
        title: "Transaction Initiated",
        description: "Please check your Pera Wallet to sign the transaction",
      });

      const txnId = await algoService.sendPayment({
        from: account,
        to: project.wallet,
        amount: AlgorandService.algoToMicroAlgos(amountNum),
        note: `${reason} - Donation to ${project.title}`
      });

      // Update project funding in context
      updateProjectFunding(selectedProject, amountNum);

      toast({
        title: "Transaction Successful",
        description: `Transaction ID: ${txnId.slice(0, 10)}...`,
      });

      navigate('/success', { 
        state: { 
          organization: project.title,
          amount: amount,
          reason: reason,
          transactionId: txnId
        }
      });
    } catch (error: any) {
      console.error('Transaction failed:', error);
      let errorMessage = "Failed to process donation";
      
      if (error.message?.includes('User rejected') || error.message?.includes('cancelled')) {
        errorMessage = "Transaction was cancelled by user";
      } else if (error.message?.includes('insufficient')) {
        errorMessage = "Insufficient balance for transaction";
      }
      
      toast({
        title: "Transaction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold">Send Funds to Projects</h1>

          {/* Select Project */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Select Project</h2>
            
            <div className="space-y-2">
              <Label htmlFor="project">Choose Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project to fund" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center space-x-2">
                        <span>{project.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {project.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedProjectData && (
                <Card className="mt-4">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold">{selectedProjectData.title}</h3>
                          <p className="text-muted-foreground">{selectedProjectData.organization}</p>
                        </div>
                        <Badge variant="secondary">{selectedProjectData.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{selectedProjectData.description}</p>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {selectedProjectData.location}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{selectedProjectData.raised.toLocaleString()} ALGO</span>
                          <span className="text-muted-foreground">
                            of {selectedProjectData.target.toLocaleString()} ALGO
                          </span>
                        </div>
                        <Progress 
                          value={(selectedProjectData.raised / selectedProjectData.target) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Target className="h-4 w-4 mr-1" />
                        {selectedProjectData.backers} backers
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Donation Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Send Details</h2>
            
            <div className="grid gap-6">
              <div>
                <Label htmlFor="amount">Amount (ALGO)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.000001"
                  placeholder="Enter amount in ALGO"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="reason">Funding Purpose</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the purpose of your funding (e.g., Project milestone, Emergency support, etc.)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* Wallet Status */}
          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your Pera Wallet to distribute funds. You can connect your wallet from the header.
              </AlertDescription>
            </Alert>
          )}

          {/* Review Transaction */}
          {selectedProject && amount && reason.trim() && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Review Transaction</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Project</span>
                      <span className="font-medium">
                        {selectedProjectData?.title}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Organization</span>
                      <span className="font-medium">
                        {selectedProjectData?.organization}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">{amount} ALGO</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purpose</span>
                      <span className="font-medium text-right max-w-xs">{reason}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network</span>
                      <span className="font-medium">Algorand TestNet</span>
                    </div>
                    
                    {isConnected && account && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">From</span>
                        <span className="font-medium text-xs">
                          {account.slice(0, 6)}...{account.slice(-4)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">To</span>
                      <span className="font-medium text-xs">
                        {selectedProjectData?.wallet.slice(0, 6)}...{selectedProjectData?.wallet.slice(-4)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleConfirmDonation}
                className="w-full mt-6"
                size="lg"
                disabled={!isConnected || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Transaction...
                  </>
                ) : (
                  "Send Funds"
                )}
              </Button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default SendFundsPublic;