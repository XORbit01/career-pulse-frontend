
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { BadgeSubscription } from "@/components/ui/badge-subscription";
import AuthService from "@/services/auth-service";
import ThemeToggle from "@/components/theme/theme-toggle";
import ChatNotificationIcon from "@/components/chat/chat-notification-icon";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = AuthService.isAuthenticated();
      const role = AuthService.getRole();
      setIsAuthenticated(authStatus);
      setUserRole(role);
    };

    checkAuth();
    
    // Listen for storage events (like when the user logs out in another tab)
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (userRole === "job_seeker") {
      return "/dashboard/jobseeker";
    } else if (userRole === "employer") {
      return "/dashboard/employer";
    }
    return "/";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="py-4 px-6 md:px-12 w-full bg-background/80 backdrop-blur-sm fixed top-0 z-50 shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-2xl bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">
            Career Pulse
          </span>
          <BadgeSubscription variant="premium" className="hidden md:flex">
            BETA
          </BadgeSubscription>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground/80 hover:text-jobify-blue transition-colors">
            Home
          </Link>
          <Link to="/jobs" className="text-foreground/80 hover:text-jobify-blue transition-colors">
            Find Jobs
          </Link>
          
          {userRole === "employer" && (
            <Link to="/jobs/post" className="text-foreground/80 hover:text-jobify-blue transition-colors">
              Post a Job
            </Link>
          )}
          
          <Link to="/" className="text-foreground/80 hover:text-jobify-blue transition-colors">
            Resources
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ChatNotificationIcon />
          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="hidden md:flex border-2 border-jobify-blue text-jobify-blue hover:bg-jobify-blue/10"
                >
                  My Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>{userRole === "job_seeker" ? "Job Seeker" : "Employer"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()}>Dashboard</Link>
                </DropdownMenuItem>
                {userRole === "job_seeker" ? (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/jobseeker?tab=applications">My Applications</Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/jobs/post">Post a Job</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="hidden md:flex"
              >
                Log in
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90 transition-opacity"
              >
                Sign up
              </Button>
            </>
          )}
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-background pb-4">
          <div className="flex flex-col space-y-4 px-6">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-jobify-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/jobs" 
              className="text-gray-600 hover:text-jobify-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Jobs
            </Link>
            
            {userRole === "employer" && (
              <Link 
                to="/jobs/post" 
                className="text-gray-600 hover:text-jobify-blue transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Post a Job
              </Link>
            )}
            
            <Link 
              to="/" 
              className="text-gray-600 hover:text-jobify-blue transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-600 hover:text-jobify-blue transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-600 hover:text-jobify-blue transition-colors py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-jobify-blue transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-600 hover:text-jobify-blue transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
