
import { Button } from "@/components/ui/button";
import { BadgeSubscription } from "@/components/ui/badge-subscription";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "Technology",
    icon: "💻",
    jobCount: "4,658",
    trending: true,
  },
  {
    title: "Marketing",
    icon: "📈",
    jobCount: "2,142",
    trending: true,
  },
  {
    title: "Design",
    icon: "🎨",
    jobCount: "1,875",
    trending: false,
  },
  {
    title: "Finance",
    icon: "💰",
    jobCount: "3,294",
    trending: true,
  },
  {
    title: "Healthcare",
    icon: "🏥",
    jobCount: "5,129",
    trending: false,
  },
  {
    title: "Education",
    icon: "🎓",
    jobCount: "1,543",
    trending: false,
  },
  {
    title: "Customer Service",
    icon: "🎯",
    jobCount: "2,781",
    trending: false,
  },
  {
    title: "Sales",
    icon: "🤝",
    jobCount: "3,126",
    trending: true,
  }
];

const JobCategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryTitle: string) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <section className="py-20 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold opacity-0 animate-fade-in text-foreground">
            Browse by <span className="bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in delay-100">
            Explore opportunities across industries and find the perfect role that matches your expertise
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.title}
              className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCategoryClick(category.title)}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">{category.icon}</span>
                {category.trending && (
                  <BadgeSubscription variant="premium" size="sm">TRENDING</BadgeSubscription>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{category.jobCount} open positions</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            variant="outline"
            className="border-jobify-blue text-jobify-blue hover:bg-jobify-blue/5"
            onClick={() => navigate('/jobs')}
          >
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobCategoriesSection;
