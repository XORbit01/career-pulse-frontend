import axios from "axios";

// API URLS
const API_BASE_URL = "http://localhost:8080/api";
const BASE_URL = "http://localhost:8080";

// Function to ensure URLs are properly formatted
export const formatImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  // If it's already an absolute URL, return it as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Convert HTTP to HTTPS to avoid mixed content issues
    return url.replace("http://", "https://");
  }
  
  // Handle static files by prepending BASE_URL, even for "/static/" URLs
  if (url.startsWith("/static/")) {
    return `${BASE_URL}${url}`;
  }
  
  // Otherwise, treat it as a relative URL and prepend API_BASE_URL
  if (url.startsWith("/")) {
    return `${API_BASE_URL}${url}`;
  } else {
    return `${API_BASE_URL}/${url}`;
  }
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jobify_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (e.g., redirect to login)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("jobify_token");
      localStorage.removeItem("jobify_role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
