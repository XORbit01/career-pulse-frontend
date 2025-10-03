
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanyInfoFormProps {
  companyName: string;
  website: string;
  location: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyInfoForm = ({ 
  companyName, 
  website, 
  location, 
  onInputChange 
}: CompanyInfoFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          name="company_name"
          value={companyName}
          onChange={onInputChange}
          placeholder="Your Company Name"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="website">Company Website</Label>
          <Input
            id="website"
            name="website"
            value={website || ""}
            onChange={onInputChange}
            placeholder="https://yourcompany.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={location || ""}
            onChange={onInputChange}
            placeholder="City, Country"
          />
        </div>
      </div>
    </>
  );
};

export default CompanyInfoForm;
