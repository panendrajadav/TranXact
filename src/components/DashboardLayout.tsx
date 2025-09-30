import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthProvider";
import { PrivateDashboard } from "@/components/PrivateDashboard";
import { PublicDashboard } from "@/components/PublicDashboard";
import DashboardReports from "@/components/DashboardReports";
import DashboardHistory from "@/components/DashboardHistory";
import DashboardSettings from "@/components/DashboardSettings";

const DashboardLayout = () => {
  const { userType } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              {userType === 'private' ? <PrivateDashboard /> : <PublicDashboard />}
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