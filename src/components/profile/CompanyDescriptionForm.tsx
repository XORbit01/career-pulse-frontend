
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanyDescriptionFormProps {
  description: string;
  requiredSkills: string[];
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSkillsChange: (skills: string[]) => void;
}

const CompanyDescriptionForm = ({
  description,
  onInputChange,
}: CompanyDescriptionFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          name="description"
          value={description || ""}
          onChange={onInputChange}
          placeholder="Tell job seekers about your company..."
          className="h-32"
        />
      </div>
    </>
  );
};

export default CompanyDescriptionForm;
