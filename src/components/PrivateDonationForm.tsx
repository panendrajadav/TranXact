import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TransactionAPI } from "@/lib/transactionAPI";
import { toast } from "@/components/ui/use-toast";

export function PrivateDonationForm() {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await TransactionAPI.addPrivateDonation({
        donorAddress: donorName || 'anonymous',
        organizationName: 'Private Donor',
        amount: donationAmount,
        reason: reason,
        date: new Date().toISOString(),
        transactionId: `private_${Date.now()}`
      });

      toast({
        title: "Private Donation Added",
        description: `${donationAmount} ALGO private donation recorded successfully`
      });

      // Reset form
      setAmount("");
      setReason("");
      setDonorName("");
      
      // Refresh the page to update totals
      window.location.reload();
    } catch (error: any) {
      console.error('Failed to add private donation:', error);
      toast({
        title: "Failed to Add Donation",
        description: error.message || "An error occurred while adding the private donation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Add Private Donation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="donorName">Donor Name (Optional)</Label>
            <Input
              id="donorName"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Anonymous"
            />
          </div>
          
          <div>
            <Label htmlFor="amount">Amount (ALGO) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="reason">Reason *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Purpose of the donation"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Private Donation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}