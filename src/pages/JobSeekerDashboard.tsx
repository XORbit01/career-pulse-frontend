import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ApplicationService from "@/services/application-service";
import ProfileService from "@/services/profile-service";
import ApplicationCard from "@/components/applications/application-card";
import JobSeekerProfileForm from "@/components/profile/job-seeker-profile-form";
import { Eye } from "lucide-react";

const JobSeekerDashboard = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');

  const [page, setPage] = useState(1);
  const [profileTab, setProfileTab] = useState(tabFromUrl === 'profile' ? 'profile' : 'applications');
  
  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['applications', page],
    queryFn: () => ApplicationService.getJobSeekerApplications(page, 10),
  });
  
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['jobSeekerProfile'],
    queryFn: () => ProfileService.getJobSeekerProfile(),
  });

  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabFromUrl === 'profile') {
      setProfileTab('profile');
    } else if (tabFromUrl === 'applications') {
      setProfileTab('applications');
    }
  }, [tabFromUrl]);

  const handleTabChange = (value: string) => {
    setProfileTab(value);
  };

  // Helper function to check if applications data is an array and has items
  const hasApplications = () => {
    if (!applications || !applications.data) return false;
    return Array.isArray(applications.data) 
      ? applications.data.length > 0 
      : true; // If it's a single application object, it exists
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-20 px-6 md:px-12 py-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-muted-foreground">Manage your job applications and profile</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              {profile && profile.user_id && (
                <Button asChild variant="outline" className="flex items-center gap-2">
                  <Link to={`/profile/${profile.user_id}`}>
                    <Eye size={18} />
                    View Public Profile
                  </Link>
                </Button>
              )}
              <Button asChild className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue={profileTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="applications">My Applications</TabsTrigger>
              <TabsTrigger value="profile">My Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              {isLoadingApplications ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jobify-blue"></div>
                </div>
              ) : hasApplications() ? (
                <div className="space-y-6">
                  {Array.isArray(applications.data) ? (
                    applications.data.map((application) => (
                      <ApplicationCard key={application.id} application={application} />
                    ))
                  ) : (
                    <ApplicationCard application={applications.data} />
                  )}
                </div>
              ) : (
                <div className="bg-card p-10 rounded-lg shadow-sm border border-border text-center">
                  <h3 className="text-lg font-medium text-foreground">No applications yet</h3>
                  <p className="text-muted-foreground mt-2">Start applying to jobs and track your applications here</p>
                  <Button asChild className="mt-6 bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90">
                    <Link to="/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile">
              {isLoadingProfile ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jobify-blue"></div>
                </div>
              ) : (
                <JobSeekerProfileForm initialData={profile} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobSeekerDashboard;
