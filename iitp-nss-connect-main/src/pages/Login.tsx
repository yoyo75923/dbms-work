import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/MockAuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Email is required");
      return;
    }
    
    // Validate email format
    if (!email.endsWith('@iitp.ac.in')) {
      toast.error("Only @iitp.ac.in email addresses are allowed");
      return;
    }
    
    if (!password) {
      toast.error("Password is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        toast.error("Login failed. Please check your credentials.");
      }
      // If success, navigation handled by the effect above
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">NSS Portal Login</CardTitle>
          <CardDescription>
            Enter your IIT Patna email and roll number to access the NSS Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email (only @iitp.ac.in)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your roll number as password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2"
              />
              <p className="text-sm text-gray-500">Use your roll number as your password</p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-nss-primary hover:bg-nss-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Example inputs:</h3>
            <ul className="text-xs space-y-1 text-blue-800">
              <li>Volunteer: aaravmehta@iitp.ac.in (any password)</li>
              <li>Mentor: kavyabansal@iitp.ac.in (any password)</li>
              <li>Secretary: riyakapoor@iitp.ac.in (any password)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
