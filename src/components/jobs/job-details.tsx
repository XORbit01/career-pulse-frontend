
import { Job } from "@/services/job-service";
import { formatSalary, formatJobType } from "@/utils/formatting";

interface JobDetailsProps {
  job: Job;
}

const JobDetails = ({ job }: JobDetailsProps) => {
  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="flex items-center">
        <span className="text-foreground text-sm font-medium">Salary:</span>
        <span className="ml-2 text-sm text-muted-foreground">{formatSalary(job.salary_min, job.salary_max)}</span>
      </div>
      <div className="flex items-center">
        <span className="text-foreground text-sm font-medium">Job Type:</span>
        <span className="ml-2 text-sm text-muted-foreground">
          {formatJobType(job.job_type)}
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-foreground text-sm font-medium">Experience:</span>
        <span className="ml-2 text-sm text-muted-foreground">{job.experience_level}</span>
      </div>
      <div className="flex items-center">
        <span className="text-foreground text-sm font-medium">Category:</span>
        <span className="ml-2 text-sm text-muted-foreground">{job.category || "Not specified"}</span>
      </div>
    </div>
  );
};

export default JobDetails;
