
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to ZamaniVault</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="h-5 px-2 text-xs"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Demo accounts:</span>
            <div className="flex flex-col gap-1 mt-1">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  setEmail("user@example.com");
                  setPassword("password");
                }}
              >
                User (Free)
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => {
                  setEmail("admin@example.com");
                  setPassword("password");
                }}
              >
                Admin
              </Button>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-col gap-4 mt-2">
          <div className="text-center text-sm w-full">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
