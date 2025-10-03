
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchJobsForm() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Build query parameters
    const params = new URLSearchParams();
    if (keyword) params.append('title', keyword);
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    
    // Navigate to jobs page with search parameters
    setTimeout(() => {
      setIsSearching(false);
      navigate(`/jobs?${params.toString()}`);
    }, 300); // Short timeout for better UX
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Job title, keywords, or company"
            className="pl-10"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="Location or Remote"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90 transition-opacity"
        disabled={isSearching}
      >
        {isSearching ? "Searching..." : "Search Jobs"}
      </Button>
    </form>
  );
}
