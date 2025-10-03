
import { JobSeekerProfile, EmployerProfile } from "@/services/profile-service";
import { formatImageUrl } from "@/services/api";

export const getInitials = (profile: JobSeekerProfile | EmployerProfile | null, isJobSeeker: boolean) => {
  if (isJobSeeker && profile) {
    const jobSeekerProfile = profile as JobSeekerProfile;
    if (jobSeekerProfile.first_name && jobSeekerProfile.last_name) {
      return `${jobSeekerProfile.first_name.charAt(0)}${jobSeekerProfile.last_name.charAt(0)}`.toUpperCase();
    }
    return jobSeekerProfile.first_name.charAt(0).toUpperCase();
  } else if (profile) {
    const employerProfile = profile as EmployerProfile;
    return employerProfile.company_name.charAt(0).toUpperCase();
  }
  return "?";
};

export const getProfileName = (profile: JobSeekerProfile | EmployerProfile | null, isJobSeeker: boolean) => {
  if (isJobSeeker && profile) {
    const jobSeekerProfile = profile as JobSeekerProfile;
    return `${jobSeekerProfile.first_name} ${jobSeekerProfile.last_name || ''}`;
  } else if (profile) {
    const employerProfile = profile as EmployerProfile;
    return employerProfile.company_name || 'Company';
  }
  return 'Unknown';
};

export const getProfileTitle = (profile: JobSeekerProfile | EmployerProfile | null, isJobSeeker: boolean) => {
  if (isJobSeeker && profile) {
    const jobSeekerProfile = profile as JobSeekerProfile;
    return jobSeekerProfile.headline || 'Professional';
  } else if (profile) {
    const employerProfile = profile as EmployerProfile;
    return employerProfile.industry || 'Business';
  }
  return 'Unknown';
};

export const getProfilePic = (profile: JobSeekerProfile | EmployerProfile | null) => {
  const logoUrl = profile?.logo_url;
  return logoUrl ? formatImageUrl(logoUrl) : undefined;
};
