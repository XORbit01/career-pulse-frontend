
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RegisterDialog } from "@/components/auth/register-dialog";

const HeroTitle = () => {
  const [registerOpen, setRegisterOpen] = useState(false);
  
  return (
    <div className="space-y-8 opacity-0 animate-fade-in">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
        Find Your
        <span className="bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent"> Dream Job</span> Today
      </h1>
      
      <p className="text-lg md:text-xl text-foreground/60 dark:text-foreground/70 max-w-lg">
        Connect with top employers and discover opportunities that match your skills and aspirations.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => setRegisterOpen(true)}
          size="lg" 
          className="bg-gradient-to-r from-jobify-blue to-jobify-teal hover:opacity-90 transition-opacity text-md"
        >
          Get Started - It's Free
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="border-jobify-blue text-jobify-blue hover:bg-jobify-blue/5 dark:hover:bg-jobify-blue/10 text-md"
        >
          How It Works
        </Button>
      </div>
      
      <div className="flex items-center gap-4 pt-4">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-jobify-teal-light flex items-center justify-center text-xs text-white font-medium">JD</div>
          <div className="w-8 h-8 rounded-full bg-jobify-blue-light flex items-center justify-center text-xs text-white font-medium">SB</div>
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-medium">KL</div>
        </div>
        <span className="text-sm text-foreground/60 dark:text-foreground/70">
          Join <span className="font-medium">10,000+</span> professionals already finding jobs
        </span>
      </div>

      <RegisterDialog open={registerOpen} setOpen={setRegisterOpen} />
    </div>
  );
};

export default HeroTitle;
