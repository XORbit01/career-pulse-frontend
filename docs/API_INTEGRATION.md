# 🔌 API Integration Guide

> Complete guide for integrating with the Career Pulse Backend API

## 🌐 Backend Server

The Career Pulse Frontend communicates with the backend server hosted at:

🔗 **Backend Repository**: [https://github.com/XORbit01/career-pulse-backend](https://github.com/XORbit01/career-pulse-backend)

## 📡 API Endpoints

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/auth/login` | User login | `email`, `password` |
| `POST` | `/auth/register` | User registration | `email`, `password`, `role` |
| `GET` | `/users/me` | Get current user | Headers: `Authorization` |

### 👤 User Management

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/users/{id}` | Get user profile | `id` |
| `PUT` | `/users/{id}` | Update user profile | `id`, profile data |
| `DELETE` | `/users/{id}` | Delete user account | `id` |

### 💼 Job Management

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/jobs` | Get job listings | `page`, `limit`, `title`, `location`, `category` |
| `GET` | `/jobs/{id}` | Get job details | `id` |
| `POST` | `/jobs/` | Create job listing | Job data |
| `PUT` | `/jobs/{id}` | Update job listing | `id`, job data |
| `DELETE` | `/jobs/{id}` | Delete job listing | `id` |
| `GET` | `/jobs/employer/listings` | Get employer jobs | `page`, `limit` |

### 📝 Application Management

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/applications` | Apply for job | `job_id`, `cover_letter` |
| `GET` | `/applications/job-seeker` | Get job seeker applications | `page`, `limit` |
| `GET` | `/applications/job/{jobId}` | Get job applications | `jobId`, `page`, `limit` |
| `GET` | `/applications/{id}` | Get application details | `id` |
| `PUT` | `/applications/{id}/status` | Update application status | `id`, `status` |
| `DELETE` | `/applications/{id}` | Delete application | `id` |

### 💬 Chat & Messaging

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/chats/{userId}/messages` | Send message | `userId`, message data |
| `GET` | `/chats/{conversationId}/messages` | Get messages | `conversationId` |
| `PUT` | `/chats/{conversationId}/read` | Mark as read | `conversationId` |
| `GET` | `/chats/` | Get conversations | - |
| `GET` | `/chats/unread-count` | Get unread count | - |

## 🔧 Configuration

### Environment Variables

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WS_URL=ws://localhost:8000/ws

# Authentication
VITE_JWT_STORAGE_KEY=jobify_token
VITE_ROLE_STORAGE_KEY=jobify_role

# App Configuration
VITE_APP_NAME=Career Pulse
VITE_APP_VERSION=1.0.0
```

### API Client Setup

```typescript
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("jobify_token");
      localStorage.removeItem("jobify_role");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

## 📊 Data Models

### 👤 User Model

```typescript
interface User {
  id: number;
  email: string;
  role: 'job_seeker' | 'employer';
  created_at: string;
  updated_at: string;
}
```

### 💼 Job Model

```typescript
interface Job {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship';
  category: string;
  requirements: string[];
  benefits?: string;
  employer_user_id: number;
  created_at: string;
  updated_at: string;
}
```

### 📝 Application Model

```typescript
interface Application {
  id: number;
  job_id: number;
  job_seeker_user_id: number;
  cover_letter: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
  job?: Job;
  job_seeker?: User;
}
```

### 💬 Message Model

```typescript
interface ChatMessage {
  id: number;
  conversation_id: number;
  sender_id: number;
  message: string;
  created_at: string;
}

interface Conversation {
  id: number;
  participant_ids: number[];
  last_message?: ChatMessage;
  unread_count: number;
}
```

## 🔐 Authentication Flow

### 1. User Registration/Login

```typescript
// Login
const login = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.success) {
    localStorage.setItem("jobify_token", response.data.data.token);
    localStorage.setItem("jobify_role", response.data.data.role);
  }
  return response.data;
};

// Registration
const register = async (data: { email: string; password: string; role: string }) => {
  const response = await api.post('/auth/register', data);
  if (response.data.success) {
    localStorage.setItem("jobify_token", response.data.data.token);
    localStorage.setItem("jobify_role", response.data.data.role);
  }
  return response.data;
};
```

### 2. Protected Routes

```typescript
// Check authentication status
const isAuthenticated = () => {
  return !!localStorage.getItem("jobify_token");
};

// Get user role
const getUserRole = () => {
  return localStorage.getItem("jobify_role");
};

// Extract user ID from JWT token
const getUserId = (): number | null => {
  const token = localStorage.getItem("jobify_token");
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || payload.sub || null;
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};
```

## 🔄 Real-time Features

### WebSocket Connection

```typescript
// WebSocket setup for real-time chat
const wsUrl = import.meta.env.VITE_WS_URL;
const ws = new WebSocket(`${wsUrl}/chat/${userId}`);

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle incoming messages
  updateChatMessages(message);
};

ws.onclose = () => {
  // Handle connection close
  console.log('WebSocket connection closed');
};
```

## 🚨 Error Handling

### API Error Responses

```typescript
interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Error handling in components
try {
  const response = await api.post('/endpoint', data);
  // Handle success
} catch (error: any) {
  if (error.response?.data?.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}
```

## 🧪 Testing API Integration

### Mock Data for Development

```typescript
// src/mocks/api-responses.ts
export const mockJobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary_min: 120000,
    salary_max: 150000,
    employment_type: "full_time",
    category: "technology",
    description: "We're looking for an experienced React developer...",
    requirements: ["5+ years React experience", "TypeScript", "Node.js"],
    created_at: "2024-01-15T10:00:00Z"
  }
];
```

### API Testing with Jest

```typescript
// src/services/__tests__/job-service.test.ts
import { describe, it, expect, vi } from 'vitest';
import JobService from '../job-service';

describe('JobService', () => {
  it('should fetch jobs successfully', async () => {
    const mockJobs = [{ id: 1, title: 'Test Job' }];
    vi.mocked(api.get).mockResolvedValue({ data: { data: mockJobs } });
    
    const result = await JobService.getJobs({});
    expect(result.data).toEqual(mockJobs);
  });
});
```

## 📈 Performance Optimization

### Request Caching

```typescript
// Use React Query for caching
import { useQuery } from '@tanstack/react-query';

const useJobs = (filters: JobFilters) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => JobService.getJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### Pagination

```typescript
// Implement infinite scrolling for job listings
const useInfiniteJobs = (filters: JobFilters) => {
  return useInfiniteQuery({
    queryKey: ['jobs', filters],
    queryFn: ({ pageParam = 1 }) => JobService.getJobs({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.next_page,
  });
};
```

## 🔒 Security Best Practices

1. **Token Storage**: Store JWT tokens in localStorage (consider httpOnly cookies for production)
2. **Token Expiration**: Implement token refresh mechanism
3. **Input Validation**: Validate all user inputs on both client and server
4. **HTTPS Only**: Use HTTPS in production environments
5. **CORS Configuration**: Properly configure CORS on the backend
6. **Rate Limiting**: Implement rate limiting for API endpoints

## 📚 Additional Resources

- [Backend API Documentation](https://github.com/XORbit01/career-pulse-backend/blob/main/README.md)
- [JWT Authentication Guide](https://jwt.io/introduction/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Query Documentation](https://tanstack.com/query/latest)

---

<div align="center">
  <p>📝 For more detailed API documentation, visit the backend repository</p>
  <p>🔗 <a href="https://github.com/XORbit01/career-pulse-backend">career-pulse-backend</a></p>
</div>

