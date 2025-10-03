
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import ProfileService, { JobSeekerProfile, EmployerProfile } from "@/services/profile-service";
import JobService from "@/services/job-service";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProfileHeader from "@/components/profile/profile-header";
import ProfileContent from "@/components/profile/profile-content";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileSkeleton from "@/components/profile/profile-skeleton";
import { getProfileName } from "@/components/profile/profile-utils";
import { useToast } from "@/hooks/use-toast";
import { useChat } from "@/context/chat-context";
import AuthService from "@/services/auth-service";

const ProfilePage = () => {
  const { id: profileId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUserId = AuthService.getUserId();
  const { openChat } = useChat();

  // Fetch profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => profileId ? ProfileService.getProfileById(profileId) : Promise.reject('No profile ID provided'),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Could not load profile. The profile may not exist or you may not have permission to view it.",
          variant: "destructive"
        });
      }
    }
  });

  // Fetch employer jobs if profile is employer type
  const employerUserId = profile?.user_id || profile?.id;
  const { data: employerJobs } = useQuery({
    queryKey: ['employerJobs', employerUserId],
    queryFn: () => JobService.getJobsByEmployerId(employerUserId),
    enabled: !!profile && profile.profileType === 'employer' && !!employerUserId,
  });

  if (error || !profile && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto pt-24 pb-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-6">
              Sorry, the profile you're looking for doesn't exist or you don't have permission to view it.
            </p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const isJobSeeker = profile?.profileType === 'job_seeker';
  const jobSeekerProfile = isJobSeeker ? profile as JobSeekerProfile : null;
  const employerProfile = !isJobSeeker ? profile as EmployerProfile : null;

  // Chat functionality
  const profileUserId = profile?.user_id || profile?.id;
  const currentUserIdNum = currentUserId ? parseInt(currentUserId.toString()) : null;
  const profileUserIdNum = profileUserId ? parseInt(profileUserId.toString()) : null;
  const canChat = isAuthenticated && currentUserIdNum && profileUserIdNum && currentUserIdNum !== profileUserIdNum;

  const handleMessageClick = () => {
    if (profileUserIdNum) {
      const profileName = getProfileName(profile, isJobSeeker);
      openChat(profileUserIdNum, profileName);
      window.dispatchEvent(new CustomEvent('openChatSidebar', { 
        detail: { userId: profileUserIdNum, userName: profileName } 
      }));
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <motion.div
            key="profile-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container max-w-4xl mx-auto pt-24 pb-16 px-4"
          >
            <ProfileHeader
              profile={profile}
              isJobSeeker={isJobSeeker}
              canChat={canChat}
              onMessageClick={handleMessageClick}
            />

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <ProfileContent
                profile={profile}
                isJobSeeker={isJobSeeker}
                isAuthenticated={isAuthenticated}
                employerJobs={employerJobs}
              />
              
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <ProfileSidebar
                  profile={profile}
                  isJobSeeker={isJobSeeker}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
