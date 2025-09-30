import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Copy, 
  QrCode, 
  Check
} from "lucide-react";

interface ReceiveFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiveFundsModal: React.FC<ReceiveFundsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  const walletAddress = "0x1a2b3c4d5e6f7890";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            💰 Receive Funds
          </DialogTitle>
          <DialogDescription>
            Share your wallet address to receive cryptocurrency
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="w-48 h-48 bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-border">
              <QrCode className="h-16 w-16 text-primary mb-4" />
              <p className="text-sm text-muted-foreground text-center">
                QR Code for wallet address
              </p>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">Wallet Address</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="address"
                value={walletAddress}
                readOnly
                className="font-mono text-sm bg-muted"
              />
              <Button
                onClick={handleCopyAddress}
                className="bg-primary hover:bg-primary/90 text-white shrink-0"
                size="sm"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-primary font-medium">Address copied to clipboard!</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={onClose}
              variant="outline" 
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              onClick={handleCopyAddress}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              Copy Address
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};