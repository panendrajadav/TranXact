import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import DashboardOverview from "@/components/DashboardOverview";
import DashboardReports from "@/components/DashboardReports";
import DashboardHistory from "@/components/DashboardHistory";
import DashboardSettings from "@/components/DashboardSettings";

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Welcome</h1>
              <p className="text-muted-foreground text-lg">To TranXact, Walter White</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => window.location.href = '/send'}>
                Send
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/balance'}
              >
                Check Balance
              </Button>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <DashboardOverview />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <DashboardReports />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <DashboardHistory />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <DashboardSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;