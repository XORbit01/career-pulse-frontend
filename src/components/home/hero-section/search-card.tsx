
import { SearchJobsForm } from "../search-jobs-form";

const SearchCard = () => {
  return (
    <div className="relative opacity-0 animate-fade-in delay-300">
      <div className="relative z-10 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-6 text-foreground">Find Open Positions</h2>
        <SearchJobsForm />
        
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">Popular:</span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-jobify-blue/10 hover:text-jobify-blue cursor-pointer transition-colors">
            Remote
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-jobify-blue/10 hover:text-jobify-blue cursor-pointer transition-colors">
            Software Engineer
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-jobify-blue/10 hover:text-jobify-blue cursor-pointer transition-colors">
            Marketing
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-jobify-blue/10 hover:text-jobify-blue cursor-pointer transition-colors">
            Full-time
          </span>
        </div>
      </div>
      
      {/* Small decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-jobify-teal-light rounded-full blur-md opacity-20"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-jobify-blue-light rounded-full blur-md opacity-20"></div>
    </div>
  );
};

export default SearchCard;
