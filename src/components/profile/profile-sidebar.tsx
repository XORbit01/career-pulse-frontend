
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, Globe, FileText, Award } from "lucide-react";
import { JobSeekerProfile, EmployerProfile } from "@/services/profile-service";
import { formatImageUrl } from "@/services/api";

interface ProfileSidebarProps {
  profile: JobSeekerProfile | EmployerProfile;
  isJobSeeker: boolean;
}

const ProfileSidebar = ({ profile, isJobSeeker }: ProfileSidebarProps) => {
  const jobSeekerProfile = isJobSeeker ? profile as JobSeekerProfile : null;
  const employerProfile = !isJobSeeker ? profile as EmployerProfile : null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {isJobSeeker && jobSeekerProfile ? (
              <>
                {jobSeekerProfile.experience_level && (
                  <li className="flex items-start gap-3">
                    <Award className="text-jobify-blue mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium">Experience Level</p>
                      <p className="text-sm text-muted-foreground">{jobSeekerProfile.experience_level}</p>
                    </div>
                  </li>
                )}
                {jobSeekerProfile.website && (
                  <li className="flex items-start gap-3">
                    <Globe className="text-jobify-blue mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a href={jobSeekerProfile.website} target="_blank" rel="noopener noreferrer" 
                        className="text-sm text-jobify-blue hover:underline">
                        {jobSeekerProfile.website}
                      </a>
                    </div>
                  </li>
                )}
                {jobSeekerProfile.resume_url && (
                  <li className="flex items-start gap-3">
                    <FileText className="text-jobify-blue mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium">Resume</p>
                      <a href={formatImageUrl(jobSeekerProfile.resume_url)} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-jobify-blue hover:underline">
                        View Resume
                      </a>
                    </div>
                  </li>
                )}
              </>
            ) : employerProfile && (
              <>
                {employerProfile.industry && (
                  <li className="flex items-start gap-3">
                    <Briefcase className="text-jobify-blue mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium">Industry</p>
                      <p className="text-sm text-muted-foreground">{employerProfile.industry}</p>
                    </div>
                  </li>
                )}
                {employerProfile.company_size && (
                  <li className="flex items-start gap-3">
                    <User className="text-jobify-blue mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium">Company Size</p>
                      <p className="text-sm text-muted-foreground">{employerProfile.company_size}</p>
                    </div>
                  </li>
                )}
                {employerProfile.website && (
                  <li className="flex items-start gap-3">
                    <Globe className="text-jobify-blue mt-1" size={18} />
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <a href={employerProfile.website} target="_blank" rel="noopener noreferrer" 
                        className="text-sm text-jobify-blue hover:underline">
                        {employerProfile.website}
                      </a>
                    </div>
                  </li>
                )}
              </>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Skills section - only shown for job seekers */}
      {isJobSeeker && jobSeekerProfile?.skills && jobSeekerProfile.skills.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {jobSeekerProfile.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ProfileSidebar;
