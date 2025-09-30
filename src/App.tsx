import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlgoWalletProvider } from "./contexts/WalletProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import Landing from "./pages/Landing";
import GetStarted from "./pages/GetStarted";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import CheckBalance from "./pages/CheckBalance";
import SendFunds from "./pages/SendFunds";
import TransactionSuccessful from "./pages/TransactionSuccessful";
import Assistance from "./pages/Assistance";
import Explore from "./pages/Explore";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AlgoWalletProvider>
          <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/balance" element={<CheckBalance />} />
            <Route path="/send" element={<SendFunds />} />
            <Route path="/success" element={<TransactionSuccessful />} />
            <Route path="/assistance" element={<Assistance />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/projects" element={<Projects />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </AlgoWalletProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
