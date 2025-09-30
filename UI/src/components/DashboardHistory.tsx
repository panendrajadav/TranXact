import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState } from "react";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const DashboardHistory = () => {
  const [showDialog, setShowDialog] = useState(false);

  const history = [
    { type: "donation", description: "Donation to Education for All", amount: "$500" },
    { type: "received", description: "Received Donation from Friend", amount: "$100" },
    { type: "donation", description: "Donation to Healthcare Access", amount: "$200" }
  ];

  const transactions = [
    {
      id: "0x4c102c",
      blockNumber: "1234567",
      timestamp: "2024-01-15 10:00 AM",
      sender: "0xdef...9030455687",
      receiver: "0xdef...7453255666",
      gasFees: "0.001 ETH",
      status: "confirmed"
    },
    {
      id: "0x4c458B",
      blockNumber: "1234567",
      timestamp: "2024-01-15 09:30 AM", 
      sender: "0xdef...9030455687",
      receiver: "0xdef...123684265",
      gasFees: "0.0012 ETH",
      status: "confirmed"
    },
    {
      id: "0x4c1F88",
      blockNumber: "1234567",
      timestamp: "2024-01-15 09:00 AM",
      sender: "0xdef...9030455687",
      receiver: "0xdef...129842255",
      gasFees: "0.0015 ETH",
      status: "confirmed"
    },
    {
      id: "0x4c1A92",
      blockNumber: "1234567",
      timestamp: "2024-01-15 08:45 AM",
      sender: "0xdef...9030455687",
      receiver: "0xdef...458743285",
      gasFees: "0.0018 ETH",
      status: "confirmed"
    },
    {
      id: "0xemm543",
      blockNumber: "1234600",
      timestamp: "2024-01-17 05:30 AM",
      sender: "0xdef...9030455687",
      receiver: "0xdef...753045568",
      gasFees: "0.0010 ETH",
      status: "confirmed"
    }
  ];

  return (
    <div className="space-y-8">
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

      {/* Transaction Details */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Transaction Details</h2>
        <p className="text-muted-foreground mb-4">View detailed information about your blockchain transactions</p>
        
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Block Number</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Gas Fees</TableHead>
                  <TableHead>Explorer Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                    <TableCell>{tx.blockNumber}</TableCell>
                    <TableCell className="text-sm">{tx.timestamp}</TableCell>
                    <TableCell className="font-mono text-sm">{tx.sender}</TableCell>
                    <TableCell className="font-mono text-sm">{tx.receiver}</TableCell>
                    <TableCell className="text-sm">{tx.gasFees}</TableCell>
                    <TableCell>
                      <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => setShowDialog(true)}>
                        View on Explorer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default DashboardHistory;