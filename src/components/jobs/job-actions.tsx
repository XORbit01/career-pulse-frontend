
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface JobActionsProps {
  jobId: number;
}

const JobActions = ({ jobId }: JobActionsProps) => {
  return (
    <div className="flex justify-end mt-6">
      <Button variant="outline" className="mr-3">Save Job</Button>
      <Button asChild className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90">
        <Link to={`/jobs/${jobId}`}>View Details</Link>
      </Button>
    </div>
  );
};

export default JobActions;
