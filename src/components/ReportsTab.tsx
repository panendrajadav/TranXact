import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart3,
  Calendar,
  DollarSign
} from "lucide-react";
import { TransactionAPI } from '@/lib/transactionAPI';
import { ReportsService } from '@/lib/reportsService';
import { useDonations } from '@/contexts/DonationProvider';
import { useProjects } from '@/contexts/ProjectProvider';
import { useWallet } from '@/contexts/WalletProvider';
import { AlgorandService } from '@/lib/algorand';
import { APP_CONFIG } from '@/lib/config';

export const ReportsTab = () => {
  const { donations, loadDonationsFromDB } = useDonations();
  const { projects } = useProjects();
  const { wallet, account, isConnected } = useWallet();
  const [fundingStats, setFundingStats] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [privateFunds, setPrivateFunds] = useState<any>(null);
  const [remainingFunds, setRemainingFunds] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [lastDataUpdate, setLastDataUpdate] = useState<string>('');

  useEffect(() => {
    const fetchAndStoreData = async () => {
      // Load donations from database when wallet connects
      if (account) {
        await loadDonationsFromDB(account);
        
        // Also load all donations for public reporting
        try {
          const allDonationsResponse = await fetch('http://localhost:3002/api/donations/donor/XG2SGTDHQMMGZECHVU3CH3WXFBLLDNYJIAZ3C2VOGP774IYJMNJ4MEDWAY');
          const allDonations = await allDonationsResponse.json();
          
          // Get organization donations too
          const orgDonationsResponse = await fetch(`http://localhost:3002/api/donations/organization/${account}`);
          const orgDonations = await orgDonationsResponse.json();
          
          // Combine all donations for reporting
          const combinedDonations = [...allDonations, ...orgDonations];
          
          // Update donations context with all data
          combinedDonations.forEach(donation => {
            if (!donations.find(d => d.id === donation.id)) {
              donations.push(donation);
            }
          });
        } catch (error) {
          console.error('Failed to load all donations for reporting:', error);
        }
      }
      
      // Allow loading for private donations even without wallet connection
      const walletAddress = account || 'private_donor';

      try {
        // Fetch wallet balance if connected
        let balance = 0;
        if (isConnected && account && wallet) {
          const algoService = new AlgorandService(wallet, APP_CONFIG.algorand.useTestNet);
          balance = await algoService.getBalance(account);
        }
        setWalletBalance(balance);

        // Calculate real statistics from donations and allocations
        const totalFunds = donations.reduce((sum, donation) => sum + donation.amount, 0);
        const totalAllocated = donations.reduce((sum, donation) => {
          const donationAllocations = donation.allocations || [];
          return sum + donationAllocations.reduce((allocSum, alloc) => allocSum + alloc.amount, 0);
        }, 0);
        const totalRemainingFunds = balance - totalAllocated;
        const uniqueOrganizations = new Set(donations.map(d => d.organizationName)).size;
        const avgDonation = donations.length > 0 ? totalFunds / donations.length : 0;
        const totalAllocationCount = donations.reduce((sum, donation) => {
          return sum + (donation.allocations?.length || 0);
        }, 0);

        // Store funding statistics in database
        const fundingStatsData = {
          walletAddress: account || 'private_donor',
          totalFunds,
          totalAllocated,
          remainingFunds: totalRemainingFunds,
          uniqueOrganizations,
          avgDonation,
          totalAllocationCount,
          lastUpdated: new Date().toISOString()
        };
        
        await ReportsService.storeFundingStatistics(fundingStatsData);
        setFundingStats(fundingStatsData);

        // Calculate and store category statistics
        const categoryStats = projects.reduce((acc, project) => {
          let categoryAmount = 0;
          donations.forEach(donation => {
            if (donation.allocations) {
              donation.allocations.forEach(alloc => {
                if (alloc.projectId === project.id) {
                  categoryAmount += alloc.amount;
                }
              });
            }
          });
          
          if (categoryAmount > 0) {
            acc[project.category] = (acc[project.category] || 0) + categoryAmount;
          }
          return acc;
        }, {} as Record<string, number>);

        const donationsByCategory = Object.entries(categoryStats).map(([name, amount], index) => {
          const colors = ['hsl(147 86% 40%)', 'hsl(37 100% 55%)', 'hsl(217 91% 60%)', 'hsl(280 100% 70%)', 'hsl(25 95% 53%)'];
          const percentage = totalAllocated > 0 ? (amount / totalAllocated) * 100 : 0;
          return {
            name,
            value: Math.round(percentage),
            amount,
            color: colors[index % colors.length]
          };
        });

        if (donationsByCategory.length > 0) {
          await ReportsService.storeCategoryStatistics({
            walletAddress,
            categoryData: donationsByCategory,
            lastUpdated: new Date().toISOString()
          });
        }

        // Calculate and store donations timeline
        const donationsOverTime = donations.reduce((acc, donation) => {
          const month = new Date(donation.date).toLocaleDateString('en-US', { month: 'short' });
          const existing = acc.find(item => item.month === month);
          if (existing) {
            existing.amount += donation.amount;
          } else {
            acc.push({ month, amount: donation.amount });
          }
          return acc;
        }, [] as Array<{month: string, amount: number}>);

        if (donationsOverTime.length > 0) {
          await ReportsService.storeDonationsTimeline({
            walletAddress,
            timelineData: donationsOverTime,
            lastUpdated: new Date().toISOString()
          });
        }

        // Fetch additional data from API
        const [allocs, privateFundsData, remainingFundsData, allDonationsData] = await Promise.all([
          TransactionAPI.getAllAllocations().catch(() => []),
          TransactionAPI.getPrivateFunds().catch(() => null),
          TransactionAPI.getRemainingFunds().catch(() => []),
          fetch('http://localhost:3002/api/donations/donor/XG2SGTDHQMMGZECHVU3CH3WXFBLLDNYJIAZ3C2VOGP774IYJMNJ4MEDWAY')
            .then(res => res.json()).catch(() => [])
        ]);
        
        setAllocations(allocs);
        setPrivateFunds(privateFundsData);
        setRemainingFunds(remainingFundsData);
        
        // Use all donations data for calculations if available
        const reportingDonations = allDonationsData.length > 0 ? allDonationsData : donations;
        setLastDataUpdate(new Date().toISOString());
        
      } catch (error) {
        console.error('Failed to fetch and store funding data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndStoreData();
  }, [donations, projects, isConnected, account, wallet]);

  // Use all donations for public reporting
  const [allDonationsForReporting, setAllDonationsForReporting] = useState([]);
  
  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        const response = await fetch('http://localhost:3002/api/donations/donor/XG2SGTDHQMMGZECHVU3CH3WXFBLLDNYJIAZ3C2VOGP774IYJMNJ4MEDWAY');
        const allDonations = await response.json();
        console.log('Donations in reports:', allDonations);
        setAllDonationsForReporting(allDonations);
      } catch (error) {
        console.error('Failed to fetch all donations:', error);
      }
    };
    fetchAllDonations();
  }, []);
  
  // Use all donations for calculations
  const reportingDonations = allDonationsForReporting.length > 0 ? allDonationsForReporting : donations;
  console.log('Private donations processed:', reportingDonations);
  
  const totalFunds = reportingDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalAllocated = reportingDonations.reduce((sum, donation) => {
    const donationAllocations = donation.allocations || [];
    return sum + donationAllocations.reduce((allocSum, alloc) => allocSum + alloc.amount, 0);
  }, 0);
  
  console.log('Total funds calculated:', totalFunds);
  console.log('Total allocated calculated:', totalAllocated);
  const totalRemainingFunds = fundingStats?.remainingFunds || (walletBalance - totalAllocated);
  const uniqueOrganizations = fundingStats?.uniqueOrganizations || new Set(donations.map(d => d.organizationName)).size;
  const avgDonation = fundingStats?.avgDonation || (donations.length > 0 ? totalFunds / donations.length : 0);
  const totalAllocationCount = fundingStats?.totalAllocationCount || donations.reduce((sum, donation) => {
    return sum + (donation.allocations?.length || 0);
  }, 0);

  // Group allocations by project using all donations
  const projectStats = {};
  reportingDonations.forEach(donation => {
    if (donation.allocations) {
      donation.allocations.forEach(alloc => {
        const projectName = alloc.projectName || 'Unknown Project';
        projectStats[projectName] = (projectStats[projectName] || 0) + alloc.amount;
      });
    }
  });
  
  // Group by category for category chart
  const categoryStats = projects.reduce((acc, project) => {
    let categoryAmount = 0;
    reportingDonations.forEach(donation => {
      if (donation.allocations) {
        donation.allocations.forEach(alloc => {
          if (alloc.projectId === project.id) {
            categoryAmount += alloc.amount;
          }
        });
      }
    });
    
    if (categoryAmount > 0) {
      acc[project.category] = (acc[project.category] || 0) + categoryAmount;
    }
    return acc;
  }, {} as Record<string, number>);

  const donationsByCategory = Object.entries(categoryStats).map(([name, amount], index) => {
    const colors = ['hsl(147 86% 40%)', 'hsl(37 100% 55%)', 'hsl(217 91% 60%)', 'hsl(280 100% 70%)', 'hsl(25 95% 53%)'];
    const percentage = totalAllocated > 0 ? (amount / totalAllocated) * 100 : 0;
    return {
      name,
      value: Math.round(percentage),
      amount,
      color: colors[index % colors.length]
    };
  });

  // Group donations by month
  const donationsOverTime = donations.reduce((acc, donation) => {
    const month = new Date(donation.date).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.amount += donation.amount;
    } else {
      acc.push({ month, amount: donation.amount });
    }
    return acc;
  }, [] as Array<{month: string, amount: number}>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading funding reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reports Overview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports Overview</h2>
          <p className="text-muted-foreground">Comprehensive analysis of your giving patterns</p>
          {lastDataUpdate && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {new Date(lastDataUpdate).toLocaleString()}
            </p>
          )}
        </div>
        <Badge variant="outline" className="bg-card">
          <Calendar className="h-3 w-3 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Private Funding</p>
                <p className="text-2xl font-bold text-primary">{totalFunds.toFixed(2)} ALGO</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">Total funding received</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Allocated</p>
                <p className="text-2xl font-bold text-orange-500">{totalAllocated.toFixed(2)} ALGO</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">Allocated to projects</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Donation</p>
                <p className="text-2xl font-bold text-accent">{avgDonation.toFixed(2)} ALGO</p>
              </div>
              <PieChartIcon className="h-8 w-8 text-accent" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">Per donation average</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Organizations</p>
                <p className="text-2xl font-bold text-info">{uniqueOrganizations}</p>
              </div>
              <Calendar className="h-8 w-8 text-info" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">Unique organizations funded</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Funding Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-success" />
              Project Funding Allocation
            </CardTitle>
            <CardDescription>Funds allocated to each project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {Object.keys(projectStats).length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(projectStats).map(([name, amount]) => ({ name, amount }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value) => [`${value} ALGO`, 'Allocated']}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No project allocations available
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {Object.entries(projectStats).map(([project, amount], index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{project}</span>
                  <span className="text-sm font-medium">{amount.toFixed(2)} ALGO</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Donations by Category */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-primary" />
              Donations by Category
            </CardTitle>
            <CardDescription>Distribution of your donations across different causes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donationsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {donationsByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {donationsByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-sm font-medium">{category.amount.toFixed(2)} ALGO</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Donations Over Time */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-accent" />
              Donations Over Time
            </CardTitle>
            <CardDescription>Monthly donation trends throughout the year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {donationsOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={donationsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value) => [`${value} ALGO`, 'Amount']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No donation data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation Summary Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Donation Summary</CardTitle>
          <CardDescription>Detailed breakdown of your giving by organization type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Organizations</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Total Amount</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Avg Donation</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryStats).map(([category, total], index) => {
                  const categoryProjects = projects.filter(p => p.category === category);
                  let categoryAllocationCount = 0;
                  donations.forEach(donation => {
                    if (donation.allocations) {
                      donation.allocations.forEach(alloc => {
                        if (categoryProjects.some(p => p.id === alloc.projectId)) {
                          categoryAllocationCount++;
                        }
                      });
                    }
                  });
                  const avgAllocation = categoryAllocationCount > 0 ? total / categoryAllocationCount : 0;
                  const percent = totalAllocated > 0 ? Math.round((total / totalAllocated) * 100) : 0;
                  
                  return (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 text-sm font-medium">{category}</td>
                      <td className="py-3 text-sm text-right">{categoryProjects.length}</td>
                      <td className="py-3 text-sm text-right font-medium">{total.toFixed(2)} ALGO</td>
                      <td className="py-3 text-sm text-right">{avgAllocation.toFixed(2)} ALGO</td>
                      <td className="py-3 text-sm text-right">
                        <Badge variant={percent > 0 ? "default" : "secondary"}>
                          {percent}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};