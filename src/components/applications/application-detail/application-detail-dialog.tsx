
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Application } from "@/services/application-service";
import ApplicationService from "@/services/application-service";
import { ApplicationStatusBadge } from "./application-status-badge";
import { ApplicantInfoCard } from "./applicant-info-card";
import { useTheme } from "@/context/theme-context";

interface ApplicationDetailDialogProps {
  application: Application;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApplicationDetailDialog({ application, open, onOpenChange }: ApplicationDetailDialogProps) {
  const [status, setStatus] = useState<Application["status"]>(application.status);
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Application["status"] }) => {
      return ApplicationService.updateApplicationStatus(id, status);
    },
    onSuccess: () => {
      toast.success("Application status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["jobApplications"] });
    },
    onError: () => {
      toast.error("Failed to update application status");
    },
  });

  const handleStatusChange = (newStatus: Application["status"]) => {
    setStatus(newStatus);
    updateStatus.mutate({ id: application.id, status: newStatus });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Application Details</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage the application from {application.first_name} {application.last_name}
          </p>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left column: Applicant details */}
            <div className="space-y-6">
              <ApplicantInfoCard application={application} />
            </div>
            
            {/* Right column: Cover letter and details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Cover Letter</h3>
                <div className="bg-muted/50 p-4 rounded-lg text-sm whitespace-pre-line min-h-[200px]">
                  {application.cover_letter || "No cover letter provided."}
                </div>
              </div>

              {/* Skills */}
              {application.skills && application.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {application.skills.map((skill, i) => (
                      <span key={i} className="text-xs bg-muted px-3 py-1.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Bio */}
              {application.bio && (
                <div>
                  <h3 className="text-lg font-medium mb-3">About</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{application.bio}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between gap-4 border-t p-4">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Status:</span>
            <ApplicationStatusBadge status={status} />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
