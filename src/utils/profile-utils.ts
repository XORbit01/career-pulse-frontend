
import { EmployerProfile, JobSeekerProfile } from "@/services/profile-service";
import AuthService from "@/services/auth-service";

// Check if employer profile has all mandatory fields filled
export const isEmployerProfileComplete = (profile: EmployerProfile | null | undefined): boolean => {
  if (!profile) return false;
  return !!profile.company_name; // Only company name is mandatory
};

// Check if job seeker profile has all mandatory fields filled
export const isJobSeekerProfileComplete = (profile: JobSeekerProfile | null | undefined): boolean => {
  if (!profile) return false;
  return !!profile.first_name; // Only first name is mandatory
};

// Get the profile completion status based on user role
export const checkProfileCompletion = async (): Promise<boolean> => {
  try {
    const userRole = AuthService.getRole();
    
    if (userRole === "employer") {
      const profile = await import("@/services/profile-service").then(
        module => module.default.getEmployerProfile()
      );
      return isEmployerProfileComplete(profile);
    } else if (userRole === "job_seeker") {
      const profile = await import("@/services/profile-service").then(
        module => module.default.getJobSeekerProfile()
      );
      return isJobSeekerProfileComplete(profile);
    }
    
    return false;
  } catch (error) {
    console.error("Error checking profile completion:", error);
    return false;
  }
};

// Helper for generating profile URLs
export const getProfileUrl = (profileId: string) => {
  return `/profile/${profileId}`;
};
