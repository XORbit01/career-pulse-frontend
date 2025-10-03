
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { JobSeekerProfile, EmployerProfile } from "@/services/profile-service";
import EmployerJobCard from "@/components/jobs/employer-job-card";

interface ProfileContentProps {
  profile: JobSeekerProfile | EmployerProfile;
  isJobSeeker: boolean;
  isAuthenticated: boolean;
  employerJobs?: any;
}

const ProfileContent = ({ profile, isJobSeeker, isAuthenticated, employerJobs }: ProfileContentProps) => {
  const jobSeekerProfile = isJobSeeker ? profile as JobSeekerProfile : null;
  const employerProfile = !isJobSeeker ? profile as EmployerProfile : null;

  return (
    <div className="lg:col-span-2">
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
          {isJobSeeker && <TabsTrigger value="experience" className="flex-1">Experience</TabsTrigger>}
          {!isJobSeeker && <TabsTrigger value="jobs" className="flex-1">Job Listings</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {isJobSeeker && jobSeekerProfile ? (
                <p>{jobSeekerProfile.summary || "No summary information available."}</p>
              ) : (
                <p>{employerProfile?.description || "No company description available."}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Experience information not available yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Job Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {!isJobSeeker && (
                <>
                  {isAuthenticated ? (
                    employerJobs?.data?.length > 0 ? (
                      <div className="space-y-4">
                        {employerJobs.data.map((job: any) => (
                          <EmployerJobCard key={job.id} job={job} isProfileView={true} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">This company has no active job listings.</p>
                    )
                  ) : (
                    <div className="relative">
                      {/* Blurred mock content */}
                      <div className="space-y-4 blur-sm pointer-events-none">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-4 border rounded-lg">
                            <h3 className="text-lg font-medium mb-1">Job Position {i}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                              Sed do eiusmod tempor incididunt ut labore.
                            </p>
                            <div className="flex justify-between">
                              <span className="text-sm">Full-time</span>
                              <span className="text-sm">Remote</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Login overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 rounded-lg backdrop-blur-sm">
                        <div className="text-center p-6">
                          <Lock className="h-10 w-10 text-jobify-blue mx-auto mb-4" />
                          <h3 className="text-xl font-bold mb-3">Login to View Job Listings</h3>
                          <p className="text-muted-foreground mb-6">
                            Sign in to access complete job listings from this employer
                          </p>
                          <Button asChild className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90">
                            <Link to="/login">Login to View</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContent;
