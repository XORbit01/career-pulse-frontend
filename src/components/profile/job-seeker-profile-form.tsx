import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProfileService, { JobSeekerProfile } from "@/services/profile-service";
import FileUpload from "@/components/ui/file-upload";
import TagsInput from "@/components/ui/tags-input";
import { formatImageUrl } from "@/services/api";
import { FileText } from "lucide-react";

interface JobSeekerProfileFormProps {
  initialData?: JobSeekerProfile;
}

const JobSeekerProfileForm = ({ initialData }: JobSeekerProfileFormProps) => {
  const [formData, setFormData] = useState<JobSeekerProfile>({
    first_name: initialData?.first_name || "",
    last_name: initialData?.last_name || "",
    headline: initialData?.headline || "",
    summary: initialData?.summary || "", // Changed from bio to summary
    location: initialData?.location || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    resume_url: initialData?.resume_url || "",
    logo_url: initialData?.logo_url || "",
    skills: initialData?.skills || [],
    experience_level: initialData?.experience_level || "",
  });
  
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (profile: Partial<JobSeekerProfile>) => 
      ProfileService.updateJobSeekerProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobSeekerProfile'] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData({ ...formData, skills });
  };

  const handleResumeUpload = (fileUrl: string) => {
    console.log("Resume URL updated:", fileUrl);
    setFormData({ ...formData, resume_url: fileUrl });
  };
  
  const handleProfileImageUpload = (fileUrl: string) => {
    console.log("Profile image URL updated:", fileUrl);
    setFormData({ ...formData, logo_url: fileUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting profile data:", formData);
    updateProfile.mutate(formData);
  };

  const handleViewResume = () => {
    if (formData.resume_url) {
      const formattedUrl = formatImageUrl(formData.resume_url);
      window.open(formattedUrl, '_blank');
    }
  };

  // Experience level options (matching the API)
  const experienceLevels = [
    "Entry-level",
    "Mid-level", 
    "Senior",
    "Lead"
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 md:p-8 border border-border">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Profile Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label>Profile Picture</Label>
          <FileUpload
            label=""
            accept="image/*"
            buttonText="Upload Profile Picture"
            onUploadComplete={handleProfileImageUpload}
            currentFileUrl={formData.logo_url}
            showPreview={true}
            useHoverEffect={true}
            type="image"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name" className="text-foreground">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="John"
              required
              className="bg-card border-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name" className="text-foreground">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleInputChange}
              placeholder="Doe"
              className="bg-card border-input"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="headline" className="text-foreground">Professional Headline</Label>
          <Input
            id="headline"
            name="headline"
            value={formData.headline || ""}
            onChange={handleInputChange}
            placeholder="Senior Software Engineer with 5+ years of experience"
            className="bg-card border-input"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-foreground">Summary</Label>
          <Textarea
            id="summary"
            name="summary"
            value={formData.summary || ""}
            onChange={handleInputChange}
            placeholder="Tell employers about yourself..."
            className="h-32 bg-card border-input"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location || ""}
              onChange={handleInputChange}
              placeholder="City, Country"
              className="bg-card border-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience_level" className="text-foreground">Experience Level</Label>
            <Select 
              value={formData.experience_level || ""} 
              onValueChange={(value) => handleSelectChange("experience_level", value)}
            >
              <SelectTrigger id="experience_level" className="bg-card border-input">
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
            <Label htmlFor="phone" className="text-foreground">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              placeholder="+1 123 456 7890"
              className="bg-card border-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website" className="text-foreground">Website/Portfolio</Label>
            <Input
              id="website"
              name="website"
              value={formData.website || ""}
              onChange={handleInputChange}
              placeholder="https://yourportfolio.com"
              className="bg-card border-input"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skills" className="text-foreground">Skills</Label>
          <TagsInput 
            id="skills"
            value={formData.skills || []} 
            onChange={handleSkillsChange}
            placeholder="Type skill and press Tab to add..."
          />
          <p className="text-sm text-muted-foreground mt-1">
            Press Tab or Enter after typing to add a skill
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FileUpload
              label="Resume"
              accept=".pdf,.doc,.docx"
              buttonText="Upload Resume"
              onUploadComplete={handleResumeUpload}
              currentFileUrl={formData.resume_url}
              type="document"
            />
            {formData.resume_url && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewResume}
                className="ml-3 flex items-center gap-2"
              >
                <FileText size={16} />
                View Resume
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {formData.resume_url ? `Current resume: ${formData.resume_url.split('/').pop()}` : "No resume uploaded yet"}
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending 
              ? "Saving..." 
              : initialData?.first_name 
                ? "Update Profile" 
                : "Create Profile"
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobSeekerProfileForm;
