// Function to ensure URLs are properly formatted
export const formatImageUrl = (url: string | undefined | null): string | undefined => {
  if (!url) return undefined;
  
  // If it's already an absolute URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative URL, make it absolute
  if (url.startsWith('/')) {
    // Get the base URL from the API
    const apiBaseUrl = "https://api.example.com";
    return `${apiBaseUrl}${url}`;
  }
  
  // Otherwise, assume it's a path that needs to be prefixed
  return `https://api.example.com/${url}`;
};
