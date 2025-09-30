import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import UnderDevelopmentDialog from "@/components/UnderDevelopmentDialog";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in real app, validate credentials
    navigate('/dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex items-center p-12 align-left w-1/3">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm">Remember for 30 days</Label>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>

          <div className="text-center">
            <span className="text-muted-foreground">or</span>
          </div>

          <div className="space-y-3">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={() => handleSocialLogin('google')}
            >
              <img src="src/assets/google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
              Sign in with Google
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={() => handleSocialLogin('apple')}
            >
              <img src="src/assets/apple-logo.png" alt="Apple" className="w-5 h-5 mr-2" />
              Sign in with Apple
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button className="text-primary hover:underline" onClick={() => setShowDialog(true)}>Sign up</button>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="flex-1 bg-muted/30 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br flex items-center justify-center">
          <img src="src/assets/children1.jpg" alt="Community Impact" className="w-full h-full object-cover rounded-l-3xl" />
        </div>
      </div>

      <UnderDevelopmentDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
};

export default Login;