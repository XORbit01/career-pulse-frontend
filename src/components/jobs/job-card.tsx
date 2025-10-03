
import { Job } from "@/services/job-service";
import JobHeader from "./job-header";
import JobDetails from "./job-details";
import JobSkills from "./job-skills";
import JobActions from "./job-actions";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md border border-border">
      <div className="p-6">
        <JobHeader job={job} />
        <JobDetails job={job} />
        <JobSkills job={job} />
        <JobActions jobId={job.id} />
      </div>
    </div>
  );
};

export default JobCard;
