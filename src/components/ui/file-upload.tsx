
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProfileService from "@/services/profile-service";
import { formatImageUrl } from "@/services/api";
import { Image, FileText, Upload, Camera, Edit } from "lucide-react";

interface FileUploadProps {
  onUploadComplete: (fileUrl: string) => void;
  label: string;
  accept?: string;
  buttonText?: string;
  className?: string;
  currentFileUrl?: string;
  showPreview?: boolean;
  type?: "image" | "document";
  useHoverEffect?: boolean;
}

const FileUpload = ({ 
  onUploadComplete, 
  label, 
  accept = "image/*",
  buttonText = "Upload File",
  className,
  currentFileUrl,
  showPreview = false,
  type = "image",
  useHoverEffect = false
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentFileUrl ? formatImageUrl(currentFileUrl) : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update preview when currentFileUrl changes
  useEffect(() => {
    if (currentFileUrl) {
      setPreviewUrl(formatImageUrl(currentFileUrl));
    } else {
      setPreviewUrl(null);
    }
  }, [currentFileUrl]);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create local preview for image files
    if (file.type.startsWith('image/') && showPreview) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
    
    try {
      setIsUploading(true);
      // Use the ProfileService to upload the file
      const response = await ProfileService.uploadFile(file);
      
      // If upload was successful, call the callback with the URL
      if (response && response.url) {
        console.log(`File upload successful, URL: ${response.url}`);
        onUploadComplete(response.url);
        toast.success("File uploaded successfully");
      } else {
        console.error("File upload response missing URL:", response);
        toast.error("Error getting file URL");
      }
    } catch (error: any) {
      console.error("File upload error:", error);
      toast.error(error.response?.data?.message || "Error uploading file");
      // Revert to old preview if upload failed
      if (currentFileUrl && showPreview) {
        setPreviewUrl(formatImageUrl(currentFileUrl));
      } else if (showPreview) {
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const isImage = type === "image" || accept.includes('image');
  const isDocument = type === "document" || accept.includes('.pdf') || accept.includes('.doc');
  
  return (
    <div className={className}>
      {label && <Label htmlFor="file-upload">{label}</Label>}
      <div className="mt-1">
        <input
          type="file"
          id="file-upload"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          className="sr-only"
        />
        
        {showPreview && isImage && useHoverEffect ? (
          <div 
            className="mb-3 relative cursor-pointer group"
            onClick={triggerFileInput}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {previewUrl ? (
              <div className="flex justify-center">
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="File Preview"
                    className="max-w-full h-32 object-contain rounded border border-border transition-all duration-200 group-hover:opacity-70"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center bg-black/30 rounded transition-opacity duration-200 ${isHovering || isUploading ? 'opacity-100' : 'opacity-0'}`}>
                    {isUploading ? (
                      <span className="text-white text-sm font-medium">Uploading...</span>
                    ) : (
                      <div className="flex flex-col items-center text-white">
                        <Edit className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">Edit</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-32 h-32 mx-auto border border-dashed border-border rounded-full flex items-center justify-center bg-muted/10 hover:bg-muted/20 transition-colors">
                <div className="flex flex-col items-center text-muted-foreground">
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-xs font-medium">Add Photo</span>
                </div>
              </div>
            )}
          </div>
        ) : showPreview && isImage ? (
          <div className="mb-3 flex justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="File Preview"
                className="max-w-full h-32 object-contain rounded border border-border"
              />
            ) : (
              <div className="w-32 h-32 border border-dashed border-border rounded-full flex items-center justify-center bg-muted/10">
                <Image className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
        ) : null}
        
        {!useHoverEffect && (
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            disabled={isUploading}
            className="w-full text-foreground bg-background hover:bg-muted/20 border-border"
          >
            {isUploading ? "Uploading..." : buttonText}
          </Button>
        )}
        
        {!showPreview && currentFileUrl && (
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            {isDocument && <FileText className="w-4 h-4 mr-1" />}
            {isImage && <Image className="w-4 h-4 mr-1" />}
            <p className="truncate">
              Current file: {currentFileUrl.split('/').pop()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
