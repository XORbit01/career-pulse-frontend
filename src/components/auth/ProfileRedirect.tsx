
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthService from "@/services/auth-service";
import ProfileService from "@/services/profile-service";

interface ProfileRedirectProps {
  children: React.ReactNode;
}

// Inline helper functions to check if profiles are complete
const isEmployerProfileComplete = (profile: any) => {
  if (!profile) return false;
  return !!profile.company_name; // At minimum, company name must exist
};

const isJobSeekerProfileComplete = (profile: any) => {
  if (!profile) return false;
  return !!profile.first_name; // At minimum, first name must exist
};

const ProfileRedirect = ({ children }: ProfileRedirectProps) => {
  const navigate = useNavigate();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  
  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        // Only check profile if logged in
        if (AuthService.isAuthenticated()) {
          const userRole = AuthService.getRole();
          
          if (userRole === "employer") {
            // First check if profile exists
            const profile = await ProfileService.getEmployerProfile();
            
            if (!profile) {
              // No profile exists, redirect to create one
              toast.info("Please create your company profile to continue");
              navigate("/dashboard/employer?tab=profile");
              setIsCheckingProfile(false);
              return;
            }
            
            // Profile exists, check if it's complete
            const isProfileComplete = isEmployerProfileComplete(profile);
            if (!isProfileComplete) {
              toast.info("Please complete your company profile to continue");
              navigate("/dashboard/employer?tab=profile");
            }
            
          } else if (userRole === "job_seeker") {
            // First check if profile exists
            const profile = await ProfileService.getJobSeekerProfile();
            
            if (!profile) {
              // No profile exists, redirect to create one
              toast.info("Please create your profile to continue");
              navigate("/dashboard/jobseeker?tab=profile");
              setIsCheckingProfile(false);
              return;
            }
            
            // Profile exists, check if it's complete
            const isProfileComplete = isJobSeekerProfileComplete(profile);
            if (!isProfileComplete) {
              toast.info("Please complete your profile to continue");
              navigate("/dashboard/jobseeker?tab=profile");
            }
          }
        }
        
        setIsCheckingProfile(false);
      } catch (error) {
        console.error("Error in profile redirect:", error);
        setIsCheckingProfile(false);
      }
    };
    
    checkProfileStatus();
  }, [navigate]);
  
  // Show loading while checking profile status
  if (isCheckingProfile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jobify-blue"></div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProfileRedirect;
