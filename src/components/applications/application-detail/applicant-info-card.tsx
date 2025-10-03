
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, ExternalLink } from "lucide-react";
import ProfileImage from "@/components/ui/profile-image";
import { Application } from "@/services/application-service";
import { formatImageUrl } from "@/services/api";
import { useTheme } from "@/context/theme-context";
import { Link } from "react-router-dom";

interface ApplicantInfoCardProps {
  application: Application;
}

export function ApplicantInfoCard({ application }: ApplicantInfoCardProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Format the resume URL with our API helper function
  const formattedResumeUrl = application.resume_url ? formatImageUrl(application.resume_url) : undefined;

  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <ProfileImage 
          src={application.logo_url} 
          alt={`${application.first_name || ''} ${application.last_name || ''}`}
          size="lg"
          className={`border-2 ${isDarkMode ? 'border-white/20' : 'border-gray-200'} shadow-lg`}
          fallbackClassName={isDarkMode ? "bg-[#1e293b] text-white" : "bg-gray-100 text-gray-600"}
        />
        
        <div className="space-y-1">
          <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {application.first_name} {application.last_name}
          </h3>
          {application.headline && (
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {application.headline}
            </p>
          )}
          
          {application.location && (
            <div className={`flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <MapPin className="mr-1 h-3 w-3" />
              <span>{application.location}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full">
        {application.experience_level && (
          <div className="mb-3">
            <Badge 
              variant="outline" 
              className={`w-full justify-center py-1.5 ${
                isDarkMode 
                  ? 'border-white/20 text-white' 
                  : 'border-gray-300 text-gray-700'
              }`}
            >
              {application.experience_level}
            </Badge>
          </div>
        )}
        
        {application.skills && application.skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            {application.skills.slice(0, 3).map((skill, i) => (
              <Badge 
                key={i} 
                variant="secondary" 
                className={`text-xs ${
                  isDarkMode 
                    ? 'bg-[#1e293b] text-white border-white/10' 
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                {skill}
              </Badge>
            ))}
            {application.skills.length > 3 && (
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  isDarkMode 
                    ? 'border-white/20 text-white' 
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                +{application.skills.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex flex-col gap-2 mt-4">
          {application.resume_url && (
            <Button
              variant="outline"
              size="sm"
              className={`w-full ${
                isDarkMode 
                  ? 'border-white/20 text-white hover:bg-white/10 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              } flex items-center justify-center`}
              onClick={() => window.open(formattedResumeUrl, '_blank')}
            >
              <FileText className="mr-1.5 h-4 w-4" /> View Resume
            </Button>
          )}
          
          {application.job_seeker_id && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className={`w-full ${
                isDarkMode 
                  ? 'border-white/20 text-white hover:bg-white/10 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              } flex items-center justify-center`}
            >
              <Link to={`/profile/${application.job_seeker_id}`}>
                <ExternalLink className="mr-1.5 h-4 w-4" /> View Profile
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
