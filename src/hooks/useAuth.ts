
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "@/services/auth-service";

export const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
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

  return {
    isAuthenticated,
    userRole,
    handleLogout,
    getDashboardLink,
  };
};
