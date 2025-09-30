import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-2xl mx-auto h-50 w-100">
          <div className="flex items-center justify-center">
            <img src="logo.png" className="h-30 w-30" alt=""  />
            <h1 className="text-9xl font-bold text-foreground">TranXact</h1>
          </div>
          
          <p className="text-2xl text-muted-foreground mb-8">
            From Wallet to Welfare – Trace Every Step
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate('/get-started')}
            className="px-8 py-3 text-lg bg-blue-500 text-white hover:bg-blue-600"
          >
            Get Started
          </Button>
        </div>
      </main>
    
  );
};

export default Landing;