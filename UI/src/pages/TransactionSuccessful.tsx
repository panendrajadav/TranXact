import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import celebrationImage from "@/assets/celebration-success.jpg";
import { useState } from "react";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const TransactionSuccessful = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  
  // Get data passed from SendFunds page
  const { organization = "Global Relief Fund", amount = "$10.00" } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center space-y-8">
          {/* Success Message */}
          <div>
            <h1 className="text-4xl font-bold mb-4">Thank you for your donation!</h1>
            <p className="text-muted-foreground text-lg">
              Your generous contribution is making a real difference in the lives of those in need. We appreciate your support.
            </p>
          </div>

          {/* Success Illustration */}
          <div className="flex justify-center">
            <Card className="w-96 h-64 flex items-center justify-center bg-gradient-to-br from-teal-light/30 to-primary/20 overflow-hidden">
              <img 
                src={celebrationImage} 
                alt="Celebration - Donation Successful" 
                className="w-full h-full object-cover"
              />
            </Card>
          </div>

          {/* Donation Details */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Donation Details</h2>
            
            <Card className="text-left max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">{amount}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipient</span>
                    <span className="font-semibold">{organization}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-sm">0xabc12f5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Blockchain Explorer Link */}
          <div>
            <Button variant="link" onClick={() => setShowDialog(true)}>
              View on Blockchain Explorer
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setShowDialog(true)}>
              Share
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </main>

      {/* Under Development Dialog */}
      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default TransactionSuccessful;