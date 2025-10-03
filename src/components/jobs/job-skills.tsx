
import { Job } from "@/services/job-service";
import { Badge } from "@/components/ui/badge";

interface JobSkillsProps {
  job: Job;
}

const JobSkills = ({ job }: JobSkillsProps) => {
  if (!job.required_skills || job.required_skills.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <span className="text-foreground text-sm font-medium">Skills:</span>
      <div className="flex flex-wrap gap-2 mt-1">
        {job.required_skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="bg-muted/30 text-foreground">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default JobSkills;
