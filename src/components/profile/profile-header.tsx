
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, MessageCircle } from "lucide-react";
import { JobSeekerProfile, EmployerProfile } from "@/services/profile-service";
import { getInitials, getProfileName, getProfileTitle, getProfilePic } from "./profile-utils";

interface ProfileHeaderProps {
  profile: JobSeekerProfile | EmployerProfile;
  isJobSeeker: boolean;
  canChat: boolean;
  onMessageClick: () => void;
}

const ProfileHeader = ({ profile, isJobSeeker, canChat, onMessageClick }: ProfileHeaderProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-8 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-jobify-blue to-jobify-teal" />
        <div className="px-6 pb-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background absolute -top-12">
              <AvatarImage src={getProfilePic(profile)} />
              <AvatarFallback>{getInitials(profile, isJobSeeker)}</AvatarFallback>
            </Avatar>
            <div className="pt-16 mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{getProfileName(profile, isJobSeeker)}</h1>
                  <p className="text-muted-foreground">{getProfileTitle(profile, isJobSeeker)}</p>
                  
                  {profile.location && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin size={16} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>
                
                {canChat && (
                  <Button
                    onClick={onMessageClick}
                    size="icon"
                    className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90"
                    title={`Send message to ${getProfileName(profile, isJobSeeker)}`}
                  >
                    <MessageCircle size={20} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProfileHeader;
