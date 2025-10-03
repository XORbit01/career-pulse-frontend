
const StatsSection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 md:mt-24 pt-8 border-t border-gray-100 dark:border-gray-800 opacity-0 animate-fade-in delay-500">
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">5M+</div>
        <p className="text-sm text-foreground/60 dark:text-foreground/70 mt-1">Active Jobs</p>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">2K+</div>
        <p className="text-sm text-foreground/60 dark:text-foreground/70 mt-1">Companies</p>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">10M+</div>
        <p className="text-sm text-foreground/60 dark:text-foreground/70 mt-1">Job Seekers</p>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">97%</div>
        <p className="text-sm text-foreground/60 dark:text-foreground/70 mt-1">Success Rate</p>
      </div>
    </div>
  );
};

export default StatsSection;
