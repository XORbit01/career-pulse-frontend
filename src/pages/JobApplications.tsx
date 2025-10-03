import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ApplicationService from "@/services/application-service";
import JobService from "@/services/job-service";
import { ApplicationList } from "@/components/applications/application-list";
import JobDetailCard from "@/components/jobs/job-detail-card";

const JobApplications = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("applications");

  // Fetch job details
  const { data: job, isLoading: isLoadingJob } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => JobService.getJobById(Number(jobId)),
    enabled: !!jobId,
    meta: {
      onError: () => {
        toast.error("Failed to load job details");
        navigate("/dashboard/employer");
      }
    }
  });

  // Fetch applications for this job
  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ["jobApplications", jobId, page],
    queryFn: () => ApplicationService.getJobApplications(Number(jobId), page),
    enabled: !!jobId,
    meta: {
      onError: () => {
        toast.error("Failed to load applications");
      }
    }
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-20 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb navigation */}
          <div className="flex items-center space-x-2 mb-6 text-sm">
            <button 
              onClick={() => navigate("/dashboard/employer")} 
              className="text-muted-foreground hover:text-jobify-blue"
            >
              Dashboard
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-jobify-blue font-medium">Applications</span>
          </div>

          {isLoadingJob ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jobify-blue"></div>
            </div>
          ) : job ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Applications for {job.title}</h1>
                  <p className="text-muted-foreground">Review and manage candidates for this position</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/jobs/${jobId}`)}
                  >
                    View Job Listing
                  </Button>
                </div>
              </div>

              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                  <TabsTrigger value="applications" className="data-[state=active]:bg-card">Applications</TabsTrigger>
                  <TabsTrigger value="jobDetails" className="data-[state=active]:bg-card">Job Details</TabsTrigger>
                </TabsList>

                <TabsContent value="applications">
                  {isLoadingApplications ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jobify-blue"></div>
                    </div>
                  ) : applications && applications.data ? (
                    <ApplicationList 
                      applications={Array.isArray(applications.data) ? applications.data : [applications.data]} 
                      page={page}
                      totalPages={applications.total_pages || 1}
                      onPageChange={handlePageChange}
                    />
                  ) : (
                    <div className="bg-card rounded-lg shadow-sm p-10 text-center border border-border">
                      <h3 className="text-lg font-medium text-foreground">No applications yet</h3>
                      <p className="text-muted-foreground mt-2">There are no applications for this job position yet.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="jobDetails">
                  {job && <JobDetailCard job={job} isEmployerView={true} />}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="bg-card rounded-lg shadow-sm p-10 text-center border border-border">
              <h3 className="text-lg font-medium text-foreground">Job not found</h3>
              <p className="text-muted-foreground mt-2">The job listing you're looking for doesn't exist or has been removed.</p>
              <Button 
                className="mt-6 bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90"
                onClick={() => navigate("/dashboard/employer")}
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobApplications;
