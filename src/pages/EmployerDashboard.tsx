import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import JobService from "@/services/job-service";
import ProfileService from "@/services/profile-service";
import EmployerJobCard from "@/components/jobs/employer-job-card";
import EmployerProfileForm from "@/components/profile/employer-profile-form";
import { Eye } from "lucide-react";

const EmployerDashboard = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  
  const [page, setPage] = useState(1);
  const [profileTab, setProfileTab] = useState(tabFromUrl === 'profile' ? 'profile' : 'jobs');
  
  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['employerJobs', page],
    queryFn: () => JobService.getEmployerJobs(page, 10),
  });
  
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['employerProfile'],
    queryFn: () => ProfileService.getEmployerProfile(),
  });

  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabFromUrl === 'profile') {
      setProfileTab('profile');
    }
  }, [tabFromUrl]);

  const handleTabChange = (value: string) => {
    setProfileTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-20 px-6 md:px-12 py-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Employer Dashboard</h1>
              <p className="text-muted-foreground">Manage your jobs and company profile</p>
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
                <Link to="/jobs/post">Post a New Job</Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue={profileTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="jobs">My Job Listings</TabsTrigger>
              <TabsTrigger value="profile">Company Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs">
              {isLoadingJobs ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jobify-blue"></div>
                </div>
              ) : jobs && jobs.data && jobs.data.length > 0 ? (
                <div className="space-y-6">
                  {jobs.data.map((job) => (
                    <EmployerJobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="bg-card p-10 rounded-lg shadow-sm border border-border text-center">
                  <h3 className="text-lg font-medium text-foreground">No job listings yet</h3>
                  <p className="text-muted-foreground mt-2">Start posting jobs to attract the best talent</p>
                  <Button asChild className="mt-6 bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90">
                    <Link to="/jobs/post">Post Your First Job</Link>
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
                <EmployerProfileForm initialData={profile} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EmployerDashboard;
