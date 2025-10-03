
import api from "./api";

export interface JobFilters {
  title?: string;
  location?: string;
  category?: string;
  min_salary?: number;
  skills?: string;
  experience_level?: string;
  page?: number;
  limit?: number;
}

export interface JobListResponse {
  success: boolean;
  data: Job[];
  total_items: number;
}

export interface Job {
  id: number;
  title: string;
  description?: string;
  category?: string;
  employer_id?: number;
  location: string;
  salary_min: number;
  salary_max?: number;
  salary_range?: string;
  required_skills?: string[];
  experience_level: string;
  status?: string;
  job_type: string;
  industry?: string;
  logo_url?: string;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
  deadline?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
}

const JobService = {
  getJobs: async (filters: JobFilters) => {
    const response = await api.get<JobListResponse>("/jobs", { params: filters });
    return response.data;
  },

  getJobById: async (id: number | string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data.data;
  },

  getEmployerJobs: async (page = 1, limit = 10) => {
    const response = await api.get("/jobs/employer/listings", {
      params: { page, limit },
    });
    return response.data;
  },

  createJob: async (jobData: Partial<Job>) => {
    const response = await api.post("/jobs/", jobData);
    return response.data;
  },

  deleteJob: async (id: number) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getJobsByEmployerId: async (employerId?: string) => {
    if (!employerId) {
      return { data: [] };
    }
    try {
      const response = await api.get(`/jobs?employer_user_id=${employerId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
      return { data: [] };
    }
  },
};

export default JobService;
