
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AuthService from "@/services/auth-service";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await AuthService.login({ email, password });
      toast.success("Login successful!");
      
      // Redirect based on user role
      if (response.data.role === "job_seeker") {
        navigate("/dashboard/jobseeker");
      } else if (response.data.role === "employer") {
        navigate("/dashboard/employer");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-20 px-6 md:px-12 py-12 bg-background flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-sm border border-border p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
              <p className="text-muted-foreground mt-1">Sign in to access your account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-jobify-blue hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-jobify-blue hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
