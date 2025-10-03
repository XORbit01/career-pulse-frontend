
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-context";
import { ChatProvider } from "@/context/chat-context";
import MainLayout from "@/components/layout/main-layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobApplications from "./pages/JobApplications";
import PostJob from "./pages/PostJob";
import AuthService from "./services/auth-service";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileRedirect from "./components/auth/ProfileRedirect";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ 
  element, 
  requiredRole = null
}: { 
  element: React.ReactNode; 
  requiredRole?: "job_seeker" | "employer" | null;
}) => {
  const isAuthenticated = AuthService.isAuthenticated();
  const userRole = AuthService.getRole();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <ProfileRedirect>{element}</ProfileRedirect>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ChatProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard/jobseeker" 
                  element={<ProtectedRoute element={<JobSeekerDashboard />} requiredRole="job_seeker" />} 
                />
                <Route 
                  path="/dashboard/employer" 
                  element={<ProtectedRoute element={<EmployerDashboard />} requiredRole="employer" />} 
                />
                <Route 
                  path="/jobs/post" 
                  element={<ProtectedRoute element={<PostJob />} requiredRole="employer" />} 
                />
                <Route 
                  path="/applications/job/:jobId" 
                  element={<ProtectedRoute element={<JobApplications />} requiredRole="employer" />} 
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </TooltipProvider>
      </ChatProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
