import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useWallet } from "@/contexts/WalletProvider";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const DashboardHistory = () => {
  const { userType } = useAuth();
  const { account } = useWallet();
  const [showDialog, setShowDialog] = useState(false);

  const privateHistory = [
    { type: "donation", description: "Donation to Global Relief Fund", amount: "5.5 ALGO", date: "2024-01-15", status: "completed" },
    { type: "donation", description: "Donation to Children's Health Initiative", amount: "3.2 ALGO", date: "2024-01-10", status: "completed" },
    { type: "donation", description: "Donation to Environmental Protection", amount: "2.8 ALGO", date: "2024-01-05", status: "completed" }
  ];

  const publicHistory = [
    { type: "bulk_funding", description: "Education Infrastructure Program", amount: "150.0 ALGO", date: "2024-01-20", status: "completed", ngos: 5 },
    { type: "milestone_release", description: "Healthcare Access Initiative", amount: "75.0 ALGO", date: "2024-01-18", status: "completed", ngos: 3 },
    { type: "program_funding", description: "Disaster Relief Coalition", amount: "200.0 ALGO", date: "2024-01-15", status: "completed", ngos: 8 }
  ];

  const history = userType === 'private' ? privateHistory : publicHistory;

  const privateTransactions = [
    {
      id: "TXN_ABC123",
      blockNumber: "45678901",
      timestamp: "2024-01-15 10:00 AM",
      sender: account?.slice(0, 8) + "..." + account?.slice(-6) || "--",
      receiver: "7ZUECA7H...AIOF6Q",
      amount: "5.5 ALGO",
      fees: "0.001 ALGO",
      status: "confirmed"
    },
    {
      id: "TXN_DEF456",
      blockNumber: "45678890",
      timestamp: "2024-01-10 09:30 AM",
      sender: account?.slice(0, 8) + "..." + account?.slice(-6) || "--",
      receiver: "7ZUECA7H...AIOF6Q",
      amount: "3.2 ALGO",
      fees: "0.001 ALGO",
      status: "confirmed"
    }
  ];

  const publicTransactions = [
    {
      id: "TXN_PUB001",
      blockNumber: "45678920",
      timestamp: "2024-01-20 11:00 AM",
      sender: account?.slice(0, 8) + "..." + account?.slice(-6) || "--",
      receiver: "Multiple NGOs",
      amount: "150.0 ALGO",
      fees: "0.005 ALGO",
      status: "confirmed"
    },
    {
      id: "TXN_PUB002",
      blockNumber: "45678915",
      timestamp: "2024-01-18 02:15 PM",
      sender: account?.slice(0, 8) + "..." + account?.slice(-6) || "--",
      receiver: "Healthcare NGOs",
      amount: "75.0 ALGO",
      fees: "0.003 ALGO",
      status: "confirmed"
    }
  ];

  const transactions = userType === 'private' ? privateTransactions : publicTransactions;

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
                    <div className="text-sm text-muted-foreground">
                      {item.amount} • {item.date}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="default" className="text-xs">{item.status}</Badge>
                      {userType === 'public' && 'ngos' in item && (
                        <Badge variant="outline" className="text-xs">{item.ngos} NGOs</Badge>
                      )}
                    </div>
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Fees</TableHead>
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
                    <TableCell className="text-sm">{tx.amount}</TableCell>
                    <TableCell className="text-sm">{tx.fees}</TableCell>
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