
import { useState, useEffect } from "react";
import { RecentJobsList } from "../recent-jobs-list";
import JobService from "@/services/job-service";

const RecentJobsSection = () => {
  const [recentJobs, setRecentJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  
  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await JobService.getJobs({ limit: 10, page: 1 });
        setRecentJobs(response.data);
      } catch (error) {
        console.error("Error fetching recent jobs:", error);
      } finally {
        setLoadingJobs(false);
      }
    };
    
    fetchRecentJobs();
  }, []);

  return (
    <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Recent Job Opportunities</h2>
      <RecentJobsList jobs={recentJobs} loading={loadingJobs} />
    </div>
  );
};

export default RecentJobsSection;
