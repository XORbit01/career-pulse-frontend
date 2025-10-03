
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner = ({ className, size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  return (
    <div className="flex items-center justify-center h-64">
      <div className={cn(
        "animate-spin rounded-full border-b-2 border-jobify-blue",
        sizeClasses[size],
        className
      )}></div>
    </div>
  );
};

export default LoadingSpinner;
