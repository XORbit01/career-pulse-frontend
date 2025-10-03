
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { toast } from "sonner";
import JobService from "@/services/job-service";
import ApplicationService from "@/services/application-service";
import AuthService from "@/services/auth-service";
import { ExternalLink } from "lucide-react";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [coverLetter, setCoverLetter] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => JobService.getJobById(id as string),
    enabled: !!id,
  });

  if (error) {
    toast.error("Failed to load job details. Please try again later.");
  }

  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getRole();
  const canApply = isAuthenticated && userRole === "job_seeker";

  // Format salary range for display
  const formatSalary = () => {
    if (!job) return "";
    
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `$${job.salary_min.toLocaleString()}+`;
    }
    return "Salary not specified";
  };

  const handleApply = async () => {
    if (!id) return;
    
    setIsApplying(true);
    try {
      await ApplicationService.applyForJob(Number(id), coverLetter);
      toast.success("Application submitted successfully!");
      setDialogOpen(false);
      setCoverLetter("");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error(error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-20 px-6 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jobify-blue"></div>
            </div>
          ) : job ? (
            <>
              <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-8">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                      <div className="mt-2 flex items-center">
                        {job.company_name && job.employer_id ? (
                          <Link 
                            to={`/profile/${job.employer_id}`} 
                            className="text-lg text-jobify-blue hover:underline flex items-center"
                          >
                            {job.company_name}
                            <ExternalLink className="ml-1 h-4 w-4" />
                          </Link>
                        ) : job.company_name ? (
                          <span className="text-lg text-muted-foreground">{job.company_name}</span>
                        ) : null}
                        <span className="mx-2 text-muted-foreground">•</span>
                        <Badge variant="outline">{job.location}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end">
                      <div className="flex flex-col md:items-end mb-4">
                        <span className="text-lg font-medium text-foreground">{formatSalary()}</span>
                        <span className="text-sm text-muted-foreground">
                          {job.job_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      
                      {canApply ? (
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="w-full md:w-auto bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90">
                              Apply Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] bg-card">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">Apply for {job.title}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <label htmlFor="coverLetter" className="block text-sm font-medium text-foreground mb-2">
                                Cover Letter
                              </label>
                              <Textarea
                                id="coverLetter"
                                placeholder="Tell the employer why you're a good fit for this position..."
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                className="h-40 bg-card border-input"
                              />
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleApply} 
                                disabled={isApplying || !coverLetter.trim()}
                                className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90"
                              >
                                {isApplying ? "Submitting..." : "Submit Application"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : isAuthenticated && userRole === "employer" ? (
                        <Button disabled className="w-full md:w-auto">
                          Employer Account
                        </Button>
                      ) : (
                        <Button asChild className="w-full md:w-auto bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90">
                          <Link to="/login">Login to Apply</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-border pt-6">
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Job Description</h2>
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      {job.description ? (
                        <p className="whitespace-pre-line text-muted-foreground">{job.description}</p>
                      ) : (
                        <p className="text-muted-foreground">No description provided.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-3 text-foreground">Job Details</h2>
                      <ul className="space-y-3">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Experience Level:</span>
                          <span className="font-medium text-foreground">{job.experience_level}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Job Type:</span>
                          <span className="font-medium text-foreground">
                            {job.job_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium text-foreground">{job.category || "Not specified"}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium text-foreground">{job.location}</span>
                        </li>
                      </ul>
                    </div>
                    
                    {job.required_skills && job.required_skills.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold mb-3 text-foreground">Required Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          {job.required_skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-muted text-foreground">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <Button variant="outline" asChild>
                  <Link to="/jobs">Back to Jobs</Link>
                </Button>
                
                {canApply && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90">
                        Apply Now
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                )}
              </div>
            </>
          ) : (
            <div className="bg-card p-10 rounded-lg shadow-sm text-center border border-border">
              <h3 className="text-lg font-medium text-foreground">Job not found</h3>
              <p className="text-muted-foreground mt-2">The job you're looking for doesn't exist or has been removed</p>
              <Button asChild className="mt-6">
                <Link to="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetail;
