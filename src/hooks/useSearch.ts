
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { JobFilters } from "@/services/job-service";

export const useSearch = () => {
  const location = useLocation();
  const [filters, setFilters] = useState<JobFilters>({
    page: 1,
    limit: 10,
  });
  const [skillTags, setSkillTags] = useState<string[]>([]);

  // Parse URL query parameters on page load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    const newFilters: JobFilters = {
      ...filters,
      title: params.get('title') || undefined,
      location: params.get('location') || undefined,
      category: params.get('category') || undefined,
    };
    
    // Handle experience level parameter
    const experienceLevel = params.get('experience_level');
    if (experienceLevel) {
      newFilters.experience_level = experienceLevel;
    }
    
    setFilters(newFilters);
    
    // If there are skills in the URL, parse them
    const urlSkills = params.get('skills');
    if (urlSkills) {
      setSkillTags(urlSkills.split(','));
    }
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Join skill tags with commas for the API
    const skillsString = skillTags.length > 0 ? skillTags.join(',') : undefined;
    setFilters({ ...filters, skills: skillsString, page: 1 }); // Reset page when applying new search
  };

  const updateFilters = (newFilters: Partial<JobFilters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const addRecommendedSkill = (skill: string) => {
    if (!skillTags.includes(skill)) {
      setSkillTags([...skillTags, skill]);
    }
  };

  return {
    filters,
    skillTags,
    setSkillTags,
    handleSearch,
    updateFilters,
    addRecommendedSkill,
  };
};
