
import api from "./api";

export interface EmployerProfile {
  company_name: string;
  website?: string;
  industry?: string;
  company_size?: string;
  description?: string;
  logo_url?: string;
  location?: string;
  required_skills?: string[];
  id?: string;
  user_id?: string;
}

export interface JobSeekerProfile {
  first_name: string;
  last_name?: string;
  headline?: string;
  summary?: string; // Changed from bio to summary
  location?: string;
  phone?: string;
  website?: string;
  resume_url?: string;
  logo_url?: string;
  skills?: string[];
  experience_level?: string;
  id?: string;
  user_id?: string;
}

const ProfileService = {
  getEmployerProfile: async () => {
    try {
      const response = await api.get("/employers/profile");
      return response.data.data;
    } catch (error: any) {
      // If 404, profile doesn't exist yet
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  updateEmployerProfile: async (profileData: Partial<EmployerProfile>) => {
    try {
      console.log("ProfileService updateEmployerProfile - received data:", JSON.stringify(profileData));
      
      // Always include logo_url in the request if it exists in profileData
      // This ensures we don't lose the logo_url when updating other fields
      const dataToSend = { ...profileData };
      
      console.log("ProfileService updateEmployerProfile - sending data:", JSON.stringify(dataToSend));
      
      const response = await api.put("/employers/profile", dataToSend);
      return response.data.data;
    } catch (error: any) {
      // If 404, profile doesn't exist, create one instead
      if (error.response && error.response.status === 404) {
        // Use the same data for creating a profile
        const dataToSend = { ...profileData };
        
        console.log("ProfileService createEmployerProfile - sending data:", JSON.stringify(dataToSend));
        
        const createResponse = await api.post("/employers/profile", dataToSend);
        return createResponse.data.data;
      }
      throw error;
    }
  },

  getJobSeekerProfile: async () => {
    try {
      const response = await api.get("/job-seekers/profile");
      return response.data.data;
    } catch (error: any) {
      // If 404, profile doesn't exist yet
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  updateJobSeekerProfile: async (profileData: Partial<JobSeekerProfile>) => {
    try {
      // Create a copy of the data to send
      const dataToSend = { ...profileData };
      
      // Only remove logo_url if it's an empty string
      // This ensures null or undefined values are handled properly
      if (dataToSend.logo_url === "") {
        delete dataToSend.logo_url;
      }
      
      // Do the same for resume_url
      if (dataToSend.resume_url === "") {
        delete dataToSend.resume_url;
      }
      
      const response = await api.put("/job-seekers/profile", dataToSend);
      return response.data.data;
    } catch (error: any) {
      // If 404, profile doesn't exist, create one instead
      if (error.response && error.response.status === 404) {
        // Use the same data handling for creating a profile
        const dataToSend = { ...profileData };
        if (dataToSend.logo_url === "") {
          delete dataToSend.logo_url;
        }
        if (dataToSend.resume_url === "") {
          delete dataToSend.resume_url;
        }
        const createResponse = await api.post("/job-seekers/profile", dataToSend);
        return createResponse.data.data;
      }
      throw error;
    }
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("File upload response:", response.data);
    // Update to use the new response structure
    return {
      url: response.data.data.url
    };
  },

  // New method to get profile by ID
  getProfileById: async (id: string) => {
    try {
      // Try to fetch as job seeker first
      const response = await api.get(`/profile/${id}`);
      return {
        ...response.data.data,
        profileType: response.data.data.first_name ? 'job_seeker' : 'employer'
      };
    } catch (error: any) {
      console.error("Error fetching profile by ID:", error);
      throw error;
    }
  },
};

export default ProfileService;
