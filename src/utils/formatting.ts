
// Centralized formatting utilities

// Format salary range for display
export const formatSalary = (salaryMin?: number, salaryMax?: number) => {
  if (salaryMin && salaryMax) {
    return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`;
  } else if (salaryMin) {
    return `$${salaryMin.toLocaleString()}+`;
  }
  return "Salary not specified";
};

// Format relative time (e.g., "2 days ago")
export const getRelativeTime = (dateString?: string) => {
  if (!dateString) return "Recently posted";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

// Format job type for display
export const formatJobType = (jobType: string) => {
  return jobType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};
