
import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role: "job_seeker" | "employer";
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    role: string;
  };
}

class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    if (response.data.success) {
      localStorage.setItem("jobify_token", response.data.data.token);
      localStorage.setItem("jobify_role", response.data.data.role);
    }
    return response.data;
  }

  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", credentials);
    if (response.data.success) {
      localStorage.setItem("jobify_token", response.data.data.token);
      localStorage.setItem("jobify_role", response.data.data.role);
    }
    return response.data;
  }

  static logout() {
    localStorage.removeItem("jobify_token");
    localStorage.removeItem("jobify_role");
  }

  static async getCurrentUser() {
    try {
      const response = await api.get("/users/me");
      return response.data.data;
    } catch (error) {
      return null;
    }
  }

  static isAuthenticated() {
    return !!localStorage.getItem("jobify_token");
  }

  static getRole() {
    return localStorage.getItem("jobify_role");
  }

  static getUserId(): number | null {
    const token = localStorage.getItem("jobify_token");
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id || payload.sub || null;
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  }
}

export default AuthService;
