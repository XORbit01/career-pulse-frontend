
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Job } from "@/services/job-service";
import ProfileImage from "@/components/ui/profile-image";

interface JobDetailCardProps {
  job: Job;
  isEmployerView?: boolean;
}

const JobDetailCard = ({ job, isEmployerView }: JobDetailCardProps) => {
  // Function to format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Not specified";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Function to determine the color of the status badge
  const getStatusColor = (status?: string): string => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <ProfileImage 
            src={job.logo_url} 
            alt={job.company_name || 'Company Logo'}
            className="h-12 w-12 rounded-md"
            fallbackClassName="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
            <div>
              <CardTitle className="text-xl mb-1 text-foreground">{job.title}</CardTitle>
              <div className="flex items-center gap-2">
                {job.company_name && job.employer_id ? (
                  <Link 
                    to={`/profile/${job.employer_id}`} 
                    className="text-sm text-jobify-blue hover:underline flex items-center"
                  >
                    {job.company_name}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                ) : (
                  <div className="text-sm text-muted-foreground">{job.company_name}</div>
                )}
              </div>
            </div>
          </div>
          {job.status && (
            <Badge className={`${getStatusColor(job.status)} ml-auto`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
          )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {job.job_type && (
            <div className="text-sm">
              <span className="text-muted-foreground">Job Type: </span>
              <span className="text-foreground font-medium">{job.job_type}</span>
            </div>
          )}
          
          {job.salary_range && (
            <div className="text-sm">
              <span className="text-muted-foreground">Salary: </span>
              <span className="text-foreground font-medium">{job.salary_range}</span>
            </div>
          )}
          
          {job.location && (
            <div className="text-sm">
              <span className="text-muted-foreground">Location: </span>
              <span className="text-foreground font-medium">{job.location}</span>
            </div>
          )}
          
          {job.created_at && (
            <div className="text-sm">
              <span className="text-muted-foreground">Posted on: </span>
              <span className="text-foreground font-medium">{formatDate(job.created_at)}</span>
            </div>
          )}
          
          {job.deadline && (
            <div className="text-sm">
              <span className="text-muted-foreground">Apply before: </span>
              <span className="text-foreground font-medium">{formatDate(job.deadline)}</span>
            </div>
          )}
          
          {job.experience_level && (
            <div className="text-sm">
              <span className="text-muted-foreground">Experience: </span>
              <span className="text-foreground font-medium">{job.experience_level}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2 text-foreground">Job Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">{job.description}</p>
          </div>
          
          {job.responsibilities && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Responsibilities</h3>
              <p className="text-muted-foreground whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}
          
          {job.requirements && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Requirements</h3>
              <p className="text-muted-foreground whitespace-pre-line">{job.requirements}</p>
            </div>
          )}
          
          {job.benefits && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Benefits</h3>
              <p className="text-muted-foreground whitespace-pre-line">{job.benefits}</p>
            </div>
          )}
          
          {job.required_skills && job.required_skills.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2 text-foreground">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobDetailCard;
