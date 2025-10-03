
import HeroTitle from "./hero-section/hero-title";
import SearchCard from "./hero-section/search-card";
import StatsSection from "./hero-section/stats-section";
import RecentJobsSection from "./hero-section/recent-jobs-section";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden pt-20 pb-16 md:pb-20 lg:pb-24 bg-background dark:bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-transparent to-teal-50/70 opacity-70 dark:from-blue-950/30 dark:via-transparent dark:to-teal-950/30 dark:opacity-20"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-gradient-to-br from-jobify-blue-light to-jobify-teal-light rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-gradient-to-tr from-jobify-blue-light to-jobify-teal-light rounded-full blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <HeroTitle />
          <SearchCard />
        </div>

        <RecentJobsSection />
        <StatsSection />
      </div>
    </div>
  );
};

export default HeroSection;
