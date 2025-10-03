
import api from "./api";

export interface ApplicationResponse {
  success: boolean;
  data: Application | Application[];
  page?: number;
  limit?: number;
  total_pages?: number;
}

export interface Application {
  id: number;
  job_id: number;
  job_seeker_id?: number; // This is now the user_id
  user_id?: number;
  cover_letter?: string;
  status: "pending" | "reviewed" | "interview" | "rejected" | "accepted";
  company_name?: string;
  job_title?: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
  updated_at?: string;
  resume_url?: string;
  logo_url?: string;
  headline?: string;
  experience_level?: string;
  skills?: string[];
  bio?: string;
  location?: string;
}

const ApplicationService = {
  applyForJob: async (jobId: number, coverLetter: string) => {
    const response = await api.post<ApplicationResponse>("/applications", {
      job_id: jobId,
      cover_letter: coverLetter,
    });
    return response.data;
  },

  getJobSeekerApplications: async (page = 1, limit = 10) => {
    const response = await api.get<ApplicationResponse>("/applications/job-seeker", {
      params: { page, limit },
    });
    return response.data;
  },

  getJobApplications: async (jobId: number, page = 1, limit = 10) => {
    const response = await api.get<ApplicationResponse>(`/applications/job/${jobId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  getApplicationById: async (id: number) => {
    const response = await api.get<ApplicationResponse>(`/applications/${id}`);
    return response.data;
  },

  deleteApplication: async (id: number) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  updateApplicationStatus: async (id: number, status: Application["status"]) => {
    const response = await api.put(`/applications/${id}/status`, { status });
    return response.data;
  }
};

export default ApplicationService;
