
import React from "react";
import FileUpload from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";

interface LogoUploadFormProps {
  logoUrl: string;
  onLogoUpload: (fileUrl: string) => void;
}

const LogoUploadForm = ({ logoUrl, onLogoUpload }: LogoUploadFormProps) => {
  return (
    <div className="space-y-2">
      <Label>Company Logo</Label>
      <FileUpload
        label=""
        accept="image/*"
        buttonText="Upload Company Logo"
        onUploadComplete={onLogoUpload}
        currentFileUrl={logoUrl}
        showPreview={true}
        useHoverEffect={true}
      />
    </div>
  );
};

export default LogoUploadForm;
