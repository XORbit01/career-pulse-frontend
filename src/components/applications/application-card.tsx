
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Application } from "@/services/application-service";
import ApplicationService from "@/services/application-service";
import { formatDate } from "./application-utils";
import StatusBadge from "@/components/ui/status-badge";

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteApplication = useMutation({
    mutationFn: (id: number) => ApplicationService.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success("Application withdrawn successfully");
      setDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to withdraw application. Please try again.");
    }
  });

  const handleDelete = () => {
    deleteApplication.mutate(application.id);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-foreground hover:text-jobify-blue transition-colors">
              <Link to={`/jobs/${application.job_id}`}>{application.job_title}</Link>
            </h3>
            <p className="text-muted-foreground">{application.company_name || "Company"}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center">
            <span className="text-foreground text-sm font-medium">Applied On:</span>
            <span className="ml-2 text-sm text-muted-foreground">{formatDate(application.created_at)}</span>
          </div>
          {application.updated_at !== application.created_at && (
            <div className="flex items-center">
              <span className="text-foreground text-sm font-medium">Last Updated:</span>
              <span className="ml-2 text-sm text-muted-foreground">{formatDate(application.updated_at)}</span>
            </div>
          )}
        </div>

        {application.cover_letter && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Cover Letter:</h4>
            <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-md text-sm text-muted-foreground max-h-32 overflow-y-auto">
              <p className="whitespace-pre-line">{application.cover_letter}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800/50 dark:hover:bg-red-900/20">
                Withdraw Application
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Withdraw Application</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to withdraw your application for {application.job_title}? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                  Withdraw
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
