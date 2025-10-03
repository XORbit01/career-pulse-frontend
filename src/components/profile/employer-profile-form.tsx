
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProfileService, { EmployerProfile } from "@/services/profile-service";
import CompanyInfoForm from "./CompanyInfoForm";
import CompanySizeIndustryForm from "./CompanySizeIndustryForm";
import CompanyDescriptionForm from "./CompanyDescriptionForm";
import LogoUploadForm from "./LogoUploadForm";

interface EmployerProfileFormProps {
  initialData?: EmployerProfile;
}

const EmployerProfileForm = ({ initialData }: EmployerProfileFormProps) => {
  const [formData, setFormData] = useState<EmployerProfile>({
    company_name: initialData?.company_name || "",
    website: initialData?.website || "",
    industry: initialData?.industry || "",
    company_size: initialData?.company_size || "",
    description: initialData?.description || "",
    logo_url: initialData?.logo_url || "",
    location: initialData?.location || "",
    required_skills: initialData?.required_skills || [],
  });
  
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (profile: Partial<EmployerProfile>) => 
      ProfileService.updateEmployerProfile(profile),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      toast.success("Company profile updated successfully");
      console.log("Profile update success, response data:", data);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (fileUrl: string) => {
    console.log("Logo URL received from upload:", fileUrl);
    setFormData(prev => {
      const updated = { ...prev, logo_url: fileUrl };
      console.log("Updated form data after logo upload:", updated);
      return updated;
    });
  };
  
  const handleSkillsChange = (skills: string[]) => {
    setFormData(prev => ({ ...prev, required_skills: skills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting profile data:", formData);
    updateProfile.mutate(formData);
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 md:p-8 border border-border text-foreground">
      <h2 className="text-2xl font-semibold mb-6">Company Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload Form - Moved to the top */}
        <div className="space-y-4">
          <LogoUploadForm
            logoUrl={formData.logo_url || ""}
            onLogoUpload={handleLogoUpload}
          />
        </div>
        
        <CompanyInfoForm
          companyName={formData.company_name}
          website={formData.website || ""}
          location={formData.location || ""}
          onInputChange={handleInputChange}
        />
        
        <CompanySizeIndustryForm
          industry={formData.industry || ""}
          companySize={formData.company_size || ""}
          onSelectChange={handleSelectChange}
        />
        
        <CompanyDescriptionForm
          description={formData.description || ""}
          requiredSkills={formData.required_skills || []}
          onInputChange={handleInputChange}
          onSkillsChange={handleSkillsChange}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90"
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending 
              ? "Saving..." 
              : initialData?.company_name 
                ? "Update Profile" 
                : "Create Profile"
            }
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployerProfileForm;
