
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Company size options
const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1001+ employees"
];

// Industry options
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Entertainment",
  "Transportation",
  "Food & Beverage",
  "Construction",
  "Other"
];

interface CompanySizeIndustryFormProps {
  industry: string;
  companySize: string;
  onSelectChange: (name: string, value: string) => void;
}

const CompanySizeIndustryForm = ({
  industry,
  companySize,
  onSelectChange
}: CompanySizeIndustryFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select 
          value={industry || ""} 
          onValueChange={(value) => onSelectChange("industry", value)}
        >
          <SelectTrigger id="industry">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industryOption) => (
              <SelectItem key={industryOption} value={industryOption}>
                {industryOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company_size">Company Size</Label>
        <Select 
          value={companySize || ""} 
          onValueChange={(value) => onSelectChange("company_size", value)}
        >
          <SelectTrigger id="company_size">
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            {companySizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CompanySizeIndustryForm;
