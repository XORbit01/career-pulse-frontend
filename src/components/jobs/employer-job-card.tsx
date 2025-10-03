
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Job } from "@/services/job-service";
import JobService from "@/services/job-service";

interface EmployerJobCardProps {
  job: Job;
  isProfileView?: boolean;
}

const EmployerJobCard = ({ job, isProfileView = false }: EmployerJobCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Format date in a readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  const deleteJob = useMutation({
    mutationFn: (id: number) => JobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employerJobs'] });
      toast.success("Job listing deleted successfully");
      setDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete job listing. Please try again.");
    }
  });

  const handleDelete = () => {
    deleteJob.mutate(job.id);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-foreground hover:text-jobify-blue transition-colors">
              <Link to={`/jobs/${job.id}`}>{job.title}</Link>
            </h3>
            <p className="text-muted-foreground">{job.location}</p>
          </div>
          <Badge className={getStatusColor(job.status)}>
            {job.status ? (job.status.charAt(0).toUpperCase() + job.status.slice(1)) : "Active"}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center">
            <span className="text-foreground text-sm font-medium">Posted:</span>
            <span className="ml-2 text-sm text-muted-foreground">{formatDate(job.created_at)}</span>
          </div>
          <div className="flex items-center">
            <span className="text-foreground text-sm font-medium">Salary:</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {job.salary_min ? `$${job.salary_min.toLocaleString()}` : "N/A"}
              {job.salary_max ? ` - $${job.salary_max.toLocaleString()}` : "+"}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-foreground text-sm font-medium">Type:</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {job.job_type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button asChild variant="outline">
            <Link to={`/jobs/${job.id}`}>View Listing</Link>
          </Button>
          
          {!isProfileView && (
            <>
              <Button asChild variant="outline">
                <Link to={`/applications/job/${job.id}`}>View Applications</Link>
              </Button>
              
              <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800/50 dark:hover:bg-red-900/20">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-background text-foreground border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Job Listing</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      Are you sure you want to delete this job listing? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerJobCard;
