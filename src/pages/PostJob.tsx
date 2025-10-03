
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import JobService, { Job } from "@/services/job-service";
import TagsInput from "@/components/ui/tags-input";

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Job>>({
    title: "",
    description: "",
    category: "",
    location: "",
    job_type: "full_time",
    salary_min: undefined,
    salary_max: undefined,
    experience_level: "",
    required_skills: [],
    status: "active",
  });
  
  const createJob = useMutation({
    mutationFn: (jobData: Partial<Job>) => JobService.createJob(jobData),
    onSuccess: (data) => {
      toast.success("Job posted successfully!");
      navigate(`/jobs/${data.data.id}`);
    },
    onError: () => {
      toast.error("Failed to post job. Please try again.");
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "salary_min" || name === "salary_max") {
      setFormData({ ...formData, [name]: value ? Number(value) : undefined });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData({ ...formData, required_skills: skills });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title?.trim()) {
      toast.error("Job title is required");
      return;
    }
    
    if (!formData.description?.trim()) {
      toast.error("Job description is required");
      return;
    }
    
    if (!formData.category?.trim()) {
      toast.error("Job category is required");
      return;
    }
    
    if (!formData.location?.trim()) {
      toast.error("Job location is required");
      return;
    }
    
    if (!formData.experience_level?.trim()) {
      toast.error("Experience level is required");
      return;
    }
    
    if (formData.salary_min && formData.salary_max && formData.salary_min > formData.salary_max) {
      toast.error("Minimum salary cannot be greater than maximum salary");
      return;
    }
    
    createJob.mutate(formData);
  };

  // Job type options
  const jobTypes = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
  ];

  // Category options
  const categories = [
    "Engineering",
    "Design",
    "Product",
    "Marketing",
    "Sales",
    "Operations",
    "Finance",
    "HR",
    "Legal",
    "Other"
  ];

  // Experience level options (matching your API)
  const experienceLevels = [
    "Entry-level",
    "Mid-level", 
    "Senior",
    "Lead"
  ];

  // Location options
  const locations = [
    "Remote",
    "Onsite",
    "Hybrid"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-20 px-6 md:px-12 py-8 bg-background">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Post a New Job</h1>
            <p className="text-foreground/60">Attract top talent by creating a detailed job listing</p>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm p-6 md:p-8 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title*</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description*</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the responsibilities, requirements, benefits..."
                  className="h-40"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="job_type">Job Type*</Label>
                  <Select 
                    value={formData.job_type || "full_time"} 
                    onValueChange={(value) => handleSelectChange("job_type", value)}
                  >
                    <SelectTrigger id="job_type">
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location*</Label>
                  <Select 
                    value={formData.location} 
                    onValueChange={(value) => handleSelectChange("location", value)}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience_level">Experience Level*</Label>
                  <Select 
                    value={formData.experience_level} 
                    onValueChange={(value) => handleSelectChange("experience_level", value)}
                  >
                    <SelectTrigger id="experience_level">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salary_min">Minimum Salary</Label>
                  <Input
                    id="salary_min"
                    name="salary_min"
                    type="number"
                    value={formData.salary_min || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. 50000"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary_max">Maximum Salary</Label>
                  <Input
                    id="salary_max"
                    name="salary_max"
                    type="number"
                    value={formData.salary_max || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. 70000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="required_skills">Required Skills</Label>
                <TagsInput
                  id="required_skills"
                  value={formData.required_skills || []}
                  onChange={handleSkillsChange}
                  placeholder="Type skill and press Tab to add..."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Press Tab or Enter after typing to add a skill
                </p>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mr-3"
                  onClick={() => navigate("/dashboard/employer")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90"
                  disabled={createJob.isPending}
                >
                  {createJob.isPending ? "Posting..." : "Post Job"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;
