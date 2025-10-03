
import { useState } from "react";
import { Application } from "@/services/application-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { ApplicationDetailDialog } from "./application-detail/application-detail-dialog";
import ProfileImage from "@/components/ui/profile-image";
import { formatDate, getStatusColor } from "./application-utils";

interface ApplicationListProps {
  applications: Application[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ApplicationList({ applications, page, totalPages, onPageChange }: ApplicationListProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No applications found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {applications.map((application) => (
            <Card key={application.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <ProfileImage 
                      src={application.logo_url} 
                      alt={`${application.first_name || ''} ${application.last_name || ''}`} 
                      size="md"
                    />
                    <div>
                      <CardTitle className="text-xl">
                        {application.first_name} {application.last_name}
                      </CardTitle>
                      <CardDescription>
                        {application.headline || "Job Applicant"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Applied on</p>
                    <p className="text-sm text-foreground">{formatDate(application.created_at)}</p>
                  </div>
                  {application.experience_level && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Experience</p>
                      <p className="text-sm text-foreground">{application.experience_level}</p>
                    </div>
                  )}
                  {application.location && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-sm text-foreground">{application.location}</p>
                    </div>
                  )}
                </div>

                {application.skills && application.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill, i) => (
                        <span key={i} className="text-xs bg-muted/30 px-2 py-1 rounded-full text-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => handleViewApplication(application)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => onPageChange(page - 1)}  
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        isActive={pageNum === page}
                        onClick={() => onPageChange(pageNum)}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => onPageChange(page + 1)} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {selectedApplication && (
            <ApplicationDetailDialog
              application={selectedApplication}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
            />
          )}
        </>
      )}
    </div>
  );
}
