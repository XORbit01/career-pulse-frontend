
import { Job } from "@/services/job-service";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import ProfileImage from "@/components/ui/profile-image";

interface RecentJobsListProps {
  jobs: Job[];
  loading: boolean;
}

export function RecentJobsList({ jobs, loading }: RecentJobsListProps) {
  // Format salary range
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && !max) return `$${min.toLocaleString()}+`;
    if (!min && max) return `Up to $${max.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  // Format date to time ago
  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg shadow-sm animate-pulse p-6 border border-border">
            <div className="h-6 w-3/4 bg-muted rounded mb-3"></div>
            <div className="h-4 w-1/2 bg-muted rounded mb-3"></div>
            <div className="h-4 w-1/3 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-6 text-center border border-border">
        <p className="text-muted-foreground">No jobs found. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Link
          to={`/jobs/${job.id}`}
          key={job.id}
          className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col border border-border"
        >
          <div className="flex items-start gap-3 mb-4">
            <ProfileImage 
              src={job.logo_url} 
              alt={job.company_name || "Company"} 
              size="sm"
            />
            <div>
              <h3 className="font-medium text-lg text-foreground line-clamp-1">{job.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{job.company_name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-foreground">{job.location}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-foreground">{job.category || "Not specified"}</p>
            </div>
          </div>
          
          <div className="mb-3 text-sm">
            <p className="text-xs text-muted-foreground">Salary</p>
            <p className="text-foreground">{formatSalary(job.salary_min, job.salary_max)}</p>
          </div>
          
          {job.required_skills && job.required_skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {job.required_skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="text-xs bg-muted/30 px-2 py-1 rounded-full text-foreground">
                    {skill}
                  </span>
                ))}
                {job.required_skills.length > 3 && (
                  <span className="text-xs bg-muted/30 px-2 py-1 rounded-full text-foreground">
                    +{job.required_skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-auto pt-3 border-t border-border text-xs text-muted-foreground">
            {job.created_at ? formatTimeAgo(job.created_at) : "Recently posted"}
          </div>
        </Link>
      ))}
    </div>
  );
}
