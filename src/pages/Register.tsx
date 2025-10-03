
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import AuthService from "@/services/auth-service";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"job_seeker" | "employer">("job_seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await AuthService.register({ email, password, role });
      toast.success("Account created successfully!");
      
      // Redirect based on user role
      if (response.data.role === "job_seeker") {
        navigate("/dashboard/jobseeker");
      } else if (response.data.role === "employer") {
        navigate("/dashboard/employer");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
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
              <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
              <p className="text-muted-foreground mt-1">Join Jobify to find your next opportunity</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <RadioGroup 
                defaultValue={role} 
                onValueChange={(value) => setRole(value as "job_seeker" | "employer")}
                className="flex justify-center gap-6 mb-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="job_seeker" id="jobSeeker" />
                  <Label htmlFor="jobSeeker">I'm looking for a job</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employer" id="employer" />
                  <Label htmlFor="employer">I'm hiring</Label>
                </div>
              </RadioGroup>
              
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-jobify-blue hover:underline">
                  Sign in
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

export default Register;
