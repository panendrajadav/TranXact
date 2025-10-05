import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthProvider";

interface HeaderProps {
  showAuthButtons?: boolean;
}

const Header = ({ showAuthButtons = false }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userName, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showBackButton = location.pathname !== '/' && location.pathname !== '/dashboard';

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2">
          <img src="/logo.png" alt="TranXact Logo" className="h-7 w-7"/>
          <span className="text-xl font-bold text-foreground">TranXact</span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        {isAuthenticated && (
          <button 
            onClick={() => handleNavigation('/dashboard')}
            className={`transition-colors ${
              location.pathname === '/dashboard' 
                ? 'text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Dashboard
          </button>
        )}
        <button 
          onClick={() => handleNavigation('/explore')}
          className={`transition-colors ${
            location.pathname === '/explore' 
              ? 'text-primary font-medium' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Explore
        </button>
        <button 
          onClick={() => handleNavigation('/projects')}
          className={`transition-colors ${
            location.pathname === '/projects' 
              ? 'text-primary font-medium' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Projects
        </button>
        <button 
          onClick={() => handleNavigation('/assistance')}
          className={`transition-colors ${
            location.pathname === '/assistance' 
              ? 'text-primary font-medium' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
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
            <span className="text-sm text-muted-foreground">
              Welcome, {userName || 'User'}
            </span>
            <Avatar className="h-10 w-10">
              <AvatarImage src="src/assets/walter white.jpg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>


    </header>
  );
};

export default Header;