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
import { Loader2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletProvider";
import { AlgorandService } from "@/lib/algorand";
import { APP_CONFIG } from "@/lib/config";
import { toast } from "@/components/ui/use-toast";

const SendFunds = () => {
  const navigate = useNavigate();
  const { wallet, account, isConnected } = useWallet();
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const NGO_WALLETS = {
    'global-relief': '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q',
    'childrens-health': 'OFDV5E5ZTP45MHXCQQ5EHIXAKIJ2BXGMFAAYU6Z2NG4MZTNCB3BOYXIBSQ',
    'environmental-protection': '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q',
    'animal-welfare': '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q',
    'disaster-relief': '7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q'
  } as const;

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



  const handleConfirmDonation = async () => {
    if (!isConnected || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a donation",
        variant: "destructive",
      });
      return;
    }

    if (!selectedOrg || !amount || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an organization, enter an amount, and provide a reason",
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
      const orgWallet = NGO_WALLETS[selectedOrg as keyof typeof NGO_WALLETS];
      
      if (!orgWallet) {
        throw new Error('Organization wallet not found');
      }

      toast({
        title: "Transaction Initiated",
        description: "Please check your Pera Wallet to sign the transaction",
      });

      const txnId = await algoService.sendPayment({
        from: account,
        to: orgWallet,
        amount: AlgorandService.algoToMicroAlgos(amountNum),
        note: `${reason} - Donation to ${organizations.find(org => org.id === selectedOrg)?.name}`
      });

      toast({
        title: "Transaction Successful",
        description: `Transaction ID: ${txnId.slice(0, 10)}...`,
      });

      navigate('/success', { 
        state: { 
          organization: organizations.find(org => org.id === selectedOrg)?.name,
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
      } else if (error.message?.includes('map is not a function')) {
        errorMessage = "Wallet connection issue. Please reconnect your wallet";
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold">Send Funds</h1>

          {/* Select Organization */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Select Organization</h2>
            
            <div className="space-y-2">
              <Label htmlFor="organization">Choose Organization</Label>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      <div className="flex items-center space-x-2">
                        <span>{org.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {org.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedOrg && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold">{organizations.find(org => org.id === selectedOrg)?.name}</h3>
                        <p className="text-sm text-muted-foreground">{organizations.find(org => org.id === selectedOrg)?.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* Donation Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Donation Details</h2>
            
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
                <Label htmlFor="reason">Reason for Donation</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter the reason for your donation (e.g., Emergency relief, Education support, etc.)"
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
                Please connect your Pera Wallet to make donations. You can connect your wallet from the header.
              </AlertDescription>
            </Alert>
          )}

          {/* Review Transaction */}
          {selectedOrg && amount && reason.trim() && (
            <section>
              <h2 className="text-2xl font-semibold mb-4">Review Transaction</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipient</span>
                      <span className="font-medium">
                        {organizations.find(org => org.id === selectedOrg)?.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">{amount} ALGO</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reason</span>
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
                        {NGO_WALLETS[selectedOrg as keyof typeof NGO_WALLETS]?.slice(0, 6)}...{NGO_WALLETS[selectedOrg as keyof typeof NGO_WALLETS]?.slice(-4)}
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
                  "Send Donation"
                )}
              </Button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default SendFunds;