
interface EmptyStateProps {
  title: string;
  description: string;
  className?: string;
}

const EmptyState = ({ title, description, className }: EmptyStateProps) => {
  return (
    <div className={`bg-card p-10 rounded-lg shadow-sm text-center border border-border ${className}`}>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-foreground/60 mt-2">{description}</p>
    </div>
  );
};

export default EmptyState;
