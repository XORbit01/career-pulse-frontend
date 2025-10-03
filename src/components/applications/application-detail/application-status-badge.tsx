
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "../application-utils";

interface ApplicationStatusBadgeProps {
  status: "pending" | "reviewed" | "interview" | "rejected" | "accepted";
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <Badge className={getStatusColor(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
