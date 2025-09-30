import React from 'react';
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

export const ReportsTab = () => {
  // Mock data for charts
  const donationsByCategory = [
    { name: 'Education', value: 68, amount: 8500, color: 'hsl(147 86% 40%)' },
    { name: 'Health', value: 23, amount: 2870, color: 'hsl(37 100% 55%)' },
    { name: 'Environment', value: 9, amount: 1080, color: 'hsl(217 91% 60%)' }
  ];

  const donationsOverTime = [
    { month: 'Jan', amount: 850 },
    { month: 'Feb', amount: 1200 },
    { month: 'Mar', amount: 980 },
    { month: 'Apr', amount: 1550 },
    { month: 'May', amount: 1100 },
    { month: 'Jun', amount: 1650 },
    { month: 'Jul', amount: 1400 },
    { month: 'Aug', amount: 1750 },
    { month: 'Sep', amount: 1300 },
    { month: 'Oct', amount: 1600 },
    { month: 'Nov', amount: 1450 },
    { month: 'Dec', amount: 1200 }
  ];

  const monthlyBreakdown = [
    { category: 'Education', jan: 600, feb: 800, mar: 650, apr: 1050, may: 750 },
    { category: 'Health', jan: 200, feb: 350, mar: 280, apr: 400, may: 300 },
    { category: 'Environment', jan: 50, feb: 50, mar: 50, apr: 100, may: 50 }
  ];

  return (
    <div className="space-y-8">
      {/* Reports Overview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports Overview</h2>
          <p className="text-muted-foreground">Comprehensive analysis of your giving patterns</p>
        </div>
        <Badge variant="outline" className="bg-card">
          <Calendar className="h-3 w-3 mr-1" />
          Year to Date
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Donations</p>
                <p className="text-2xl font-bold text-primary">$12,450</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-sm text-success">+23% from last year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Organizations</p>
                <p className="text-2xl font-bold text-success">47</p>
              </div>
              <BarChart3 className="h-8 w-8 text-success" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-sm text-success">+12 new this year</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Donation</p>
                <p className="text-2xl font-bold text-accent">$265</p>
              </div>
              <PieChartIcon className="h-8 w-8 text-accent" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-success mr-1" />
              <span className="text-sm text-success">+8% increase</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goal Progress</p>
                <p className="text-2xl font-bold text-info">83%</p>
              </div>
              <Calendar className="h-8 w-8 text-info" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-muted-foreground">$2,550 remaining</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <span className="text-sm font-medium">${category.amount.toLocaleString()}</span>
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
                    formatter={(value) => [`$${value}`, 'Amount']}
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
                {[
                  { category: 'Education', orgs: 18, total: 8500, avg: 472, percent: 68 },
                  { category: 'Health & Wellness', orgs: 12, total: 2870, avg: 239, percent: 23 },
                  { category: 'Environmental', orgs: 8, total: 1080, avg: 135, percent: 9 },
                  { category: 'Emergency Relief', orgs: 5, total: 0, avg: 0, percent: 0 },
                  { category: 'Animal Welfare', orgs: 4, total: 0, avg: 0, percent: 0 }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 text-sm font-medium">{row.category}</td>
                    <td className="py-3 text-sm text-right">{row.orgs}</td>
                    <td className="py-3 text-sm text-right font-medium">${row.total.toLocaleString()}</td>
                    <td className="py-3 text-sm text-right">${row.avg}</td>
                    <td className="py-3 text-sm text-right">
                      <Badge variant={row.percent > 0 ? "default" : "secondary"}>
                        {row.percent}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};