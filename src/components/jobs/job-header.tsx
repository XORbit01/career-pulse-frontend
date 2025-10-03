
import { Link } from "react-router-dom";
import { Job } from "@/services/job-service";
import { Badge } from "@/components/ui/badge";
import { getRelativeTime } from "@/utils/formatting";

interface JobHeaderProps {
  job: Job;
}

const JobHeader = ({ job }: JobHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4 overflow-hidden">
          {job.logo_url ? (
            <img 
              src={job.logo_url.startsWith('https') ? job.logo_url : `https://api.example.com${job.logo_url}`} 
              alt={job.company_name || "Company logo"} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-xl font-bold text-muted-foreground">
              {(job.company_name || "C")[0]}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground hover:text-jobify-blue transition-colors">
            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
          </h3>
          <p className="text-muted-foreground">{job.company_name || "Company"}</p>
        </div>
      </div>
      <div className="flex flex-col items-end text-sm">
        <Badge variant="outline" className="mb-2">{job.location}</Badge>
        <span className="text-muted-foreground">{getRelativeTime(job.created_at)}</span>
      </div>
    </div>
  );
};

export default JobHeader;
