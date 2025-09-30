import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

interface HeaderProps {
  showAuthButtons?: boolean;
}

const Header = ({ showAuthButtons = false }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const isAuthenticated = location.pathname.includes('/dashboard') || 
                         location.pathname.includes('/balance') || 
                         location.pathname.includes('/send') ||
                         location.pathname.includes('/success');

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
      <div className="flex items-center space-x-2">
        <Link to="/" className="flex items-center space-x-2" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="TranXact Logo" className="h-7 w-7"/>
          <span className="text-xl font-bold text-foreground">TranXact</span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <button 
          onClick={() => handleNavigation('/explore')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Explore
        </button>
        <button 
          onClick={() => handleNavigation('/projects')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Projects
        </button>
        <button 
          onClick={() => handleNavigation('/assistance')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Assistance
        </button>
      </nav>

      <div className="flex items-center space-x-4">
        {showAuthButtons && !isAuthenticated && (
          <Button 
            variant="default"
            onClick={() => handleNavigation('/login')}
          >
            Login
          </Button>
        )}
        
        {isAuthenticated && (
          <>
            <Button variant="default" onClick={() => setShowDialog(true)}>Connect Wallet</Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src="src/assets/walter white.jpg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground">WW</AvatarFallback>
            </Avatar>
          </>
        )}
      </div>

      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </header>
  );
};

export default Header;