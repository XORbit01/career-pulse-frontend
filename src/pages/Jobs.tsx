
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import JobCard from "@/components/jobs/job-card";
import { Search, Tag } from "lucide-react";
import JobService from "@/services/job-service";
import { toast } from "sonner";
import TagsInput from "@/components/ui/tags-input";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/loading-spinner";
import EmptyState from "@/components/ui/empty-state";
import { useSearch } from "@/hooks/useSearch";
import { usePagination } from "@/hooks/usePagination";

// Recommended skills for quick selection
const RECOMMENDED_SKILLS = [
  "JavaScript", "React", "Node.js", "TypeScript", 
  "Python", "Java", "SQL", "AWS", 
  "Docker", "Git", "UI/UX", "CSS"
];

// Job categories for the dropdown
const JOB_CATEGORIES = [
  "Technology",
  "Marketing", 
  "Design",
  "Finance",
  "Healthcare",
  "Education",
  "Customer Service",
  "Sales"
];

const Jobs = () => {
  const { filters, skillTags, setSkillTags, handleSearch, updateFilters, addRecommendedSkill } = useSearch();

  const { data, isLoading, error } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => JobService.getJobs(filters),
  });

  const { totalPages, handlePageChange, getVisiblePages, canGoPrevious, canGoNext } = usePagination({
    totalItems: data?.total_items || 0,
    itemsPerPage: filters.limit || 10,
    currentPage: filters.page || 1,
    onPageChange: (page) => updateFilters({ page }),
  });

  if (error) {
    toast.error("Failed to load jobs. Please try again later.");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow mt-20 px-6 md:px-12 py-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Find Your Dream Job</h1>
            <p className="text-foreground/70">Browse through thousands of job opportunities</p>
          </div>

          {/* Search and Filter Form */}
          <form onSubmit={handleSearch} className="bg-card p-6 rounded-lg shadow-sm mb-8 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium text-foreground/80 mb-1 block">Job Title</label>
                <Input
                  id="title"
                  placeholder="e.g. Software Engineer"
                  value={filters.title || ''}
                  onChange={(e) => updateFilters({ title: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="text-sm font-medium text-foreground/80 mb-1 block">Location</label>
                <Select 
                  value={filters.location || ""} 
                  onValueChange={(value) => updateFilters({ location: value })}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="Onsite">Onsite</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="category" className="text-sm font-medium text-foreground/80 mb-1 block">Category</label>
                <Select 
                  value={filters.category || ""} 
                  onValueChange={(value) => updateFilters({ category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="experience" className="text-sm font-medium text-foreground/80 mb-1 block">Experience</label>
                <Select 
                  value={filters.experience_level || ""} 
                  onValueChange={(value) => updateFilters({ experience_level: value })}
                >
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry Level</SelectItem>
                    <SelectItem value="Mid-level">Mid Level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button type="submit" className="w-full bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90">
                  <Search className="mr-2 h-4 w-4" />
                  Search Jobs
                </Button>
              </div>
            </div>
            
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <label htmlFor="salary" className="text-sm font-medium text-foreground/80 mr-3">Min Salary:</label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="e.g. 50000"
                  className="w-40"
                  value={filters.min_salary || ''}
                  onChange={(e) => updateFilters({ min_salary: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
              
              <div>
                <label htmlFor="skills" className="text-sm font-medium text-foreground/80 mb-1 block flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Skills
                </label>
                <TagsInput
                  id="skills"
                  value={skillTags}
                  onChange={setSkillTags}
                  placeholder="Type skill and press Tab to add"
                  className="focus-within:ring-offset-0"
                />

                {/* Recommended skills section */}
                <div className="mt-2">
                  <p className="text-sm text-foreground/60 mb-1">Recommended skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {RECOMMENDED_SKILLS.map((skill) => (
                      <Badge 
                        key={skill}
                        variant="outline" 
                        className={`cursor-pointer hover:bg-jobify-blue/10 hover:text-jobify-blue transition-colors ${
                          skillTags.includes(skill) ? 'bg-jobify-blue/10 text-jobify-blue' : ''
                        }`}
                        onClick={() => addRecommendedSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Job Listings */}
          <div className="space-y-6">
            {isLoading ? (
              <LoadingSpinner />
            ) : data?.data && data.data.length > 0 ? (
              data.data.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <EmptyState 
                title="No jobs match your search criteria"
                description="Try adjusting your filters or search terms"
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => canGoPrevious && handlePageChange((filters.page || 1) - 1)}
                    className={!canGoPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {getVisiblePages().map((pageNum) => (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      isActive={pageNum === filters.page}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => canGoNext && handlePageChange((filters.page || 1) + 1)}
                    className={!canGoNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
