
import { cn } from "@/lib/utils";
import { useState } from "react";
import { formatImageUrl } from "@/services/api";

interface ProfileImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg";
}

const ProfileImage = ({ 
  src, 
  alt, 
  className,
  fallbackClassName,
  size = "md" 
}: ProfileImageProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Define size classes
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };
  
  // Format image URL properly - only if src is not undefined/null/empty
  const formattedSrc = src && src.trim() !== "" ? formatImageUrl(src) : undefined;
  
  // Debug the image source
  console.log("ProfileImage: original src:", src);
  console.log("ProfileImage: formatted src:", formattedSrc);
  
  // Handle image load error
  const handleError = () => {
    console.log("Image failed to load:", formattedSrc);
    setImageError(true);
  };
  
  // Create initials from alt text
  const getInitials = () => {
    if (!alt) return "?";
    
    const words = alt.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    } else if (words.length === 1 && words[0].length > 0) {
      return words[0][0].toUpperCase();
    }
    
    return "?";
  };
  
  // If we have a valid image URL and no error loading it
  if (formattedSrc && !imageError) {
    return (
      <img
        src={formattedSrc}
        alt={alt}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className
        )}
        onError={handleError}
      />
    );
  }
  
  // Fallback to initials avatar
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium",
        sizeClasses[size],
        fallbackClassName || className
      )}
      title={alt}
    >
      {getInitials()}
    </div>
  );
};

export default ProfileImage;
