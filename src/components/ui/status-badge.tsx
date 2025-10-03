
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/components/applications/application-utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <Badge className={`${getStatusColor(status)} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;
