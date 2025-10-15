import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@/contexts/WalletProvider";
import { useAuth } from "@/contexts/AuthProvider";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const Login = () => {
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showDevDialog, setShowDevDialog] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  // Demo credentials
  const PRIVATE_DONOR = { email: "private@tranxact.com", password: "private123" };
  const PUBLIC_DONOR = { email: "public@tranxact.com", password: "public123" };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    
    if (email === PRIVATE_DONOR.email && password === PRIVATE_DONOR.password) {
      login('private');
      navigate('/dashboard');
    } else if (email === PUBLIC_DONOR.email && password === PUBLIC_DONOR.password) {
      login('public');
      navigate('/dashboard');
    }
  };

  const isPrivateLogin = email === PRIVATE_DONOR.email && password === PRIVATE_DONOR.password;
  const isPublicLogin = email === PUBLIC_DONOR.email && password === PUBLIC_DONOR.password;
  const isLoginEnabled = (isPrivateLogin || isPublicLogin) && isConnected;

  const handleSocialLogin = () => {
    setShowDevDialog(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex items-center justify-center p-8 w-1/2">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold">Welcome back!</h1>
            <p className="text-lg text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <div className="space-y-4">
            <WalletConnect />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base">Email address</Label>
              <Input 
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-base py-3"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-base">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-base py-3"
              />
              <div className="text-right">
                <button type="button" className="text-base text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox 
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-base">Remember for 30 days</Label>
            </div>

            <Button type="submit" className="w-full text-base py-3" disabled={!isLoginEnabled}>
              Login
            </Button>
          </form>

          <div className="text-center">
            <span className="text-base text-muted-foreground">or</span>
          </div>

          <div className="space-y-3">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center text-base py-3"
              onClick={handleSocialLogin}
            >
              <img src="src/assets/google-logo.png" alt="Google" className="w-5 h-5 mr-3" />
              Sign in with Google
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center text-base py-3"
              onClick={handleSocialLogin}
            >
              <img src="src/assets/apple-logo.png" alt="Apple" className="w-5 h-5 mr-3" />
              Sign in with Apple
            </Button>

            {!isConnected && (
              <p className="text-sm text-red-500 text-center">
                ⚠️ Wallet connection required for login
              </p>
            )}

            <div className="bg-muted/50 p-4 rounded text-sm space-y-3">
              <p className="font-medium text-base">Demo Credentials:</p>
              
              <div className="space-y-2">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium text-blue-700 text-base">Private Donor:</p>
                  <p className="text-sm">Email: {PRIVATE_DONOR.email}</p>
                  <p className="text-sm">Password: {PRIVATE_DONOR.password}</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEmail(PRIVATE_DONOR.email);
                      setPassword(PRIVATE_DONOR.password);
                    }}
                    className="w-full mt-2 text-sm"
                  >
                    Auto-fill Private
                  </Button>
                </div>
                
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium text-green-700 text-base">Public Donor:</p>
                  <p className="text-sm">Email: {PUBLIC_DONOR.email}</p>
                  <p className="text-sm">Password: {PUBLIC_DONOR.password}</p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEmail(PUBLIC_DONOR.email);
                      setPassword(PUBLIC_DONOR.password);
                    }}
                    className="w-full mt-2 text-sm"
                  >
                    Auto-fill Public
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-base">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button className="text-primary hover:underline" onClick={() => setShowDialog(true)}>Sign up</button>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 bg-muted/30 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br flex items-center justify-center">
          <img src="src/assets/image.jpg" alt="Community Impact" className="w-full h-full object-cover" />
        </div>
      </div>

      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
      <UnderDevelopmentDialog open={showDevDialog} onClose={() => setShowDevDialog(false)} />
    </div>
  );
};

export default Login;