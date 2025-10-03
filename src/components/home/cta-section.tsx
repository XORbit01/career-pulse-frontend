
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RegisterDialog } from "@/components/auth/register-dialog";

const CtaSection = () => {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-jobify-blue to-jobify-teal opacity-90"></div>
          
          <div className="relative py-12 md:py-20 px-8 md:px-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-3xl mx-auto opacity-0 animate-fade-in">
              Ready to Take the Next Step in Your Career Journey?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-0 animate-fade-in delay-100">
              Join thousands of professionals who have already found their perfect job match with Career Pulse.
            </p>
            <Button 
              onClick={() => setRegisterOpen(true)}
              size="lg" 
              className="bg-white text-jobify-blue hover:bg-white/90 transition-colors opacity-0 animate-fade-in delay-200"
            >
              Create Your Free Account
            </Button>
            <p className="mt-4 text-sm text-white/80 opacity-0 animate-fade-in delay-300">
              No credit card required. Get started in less than 2 minutes.
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full opacity-10"></div>
        </div>
      </div>
      
      <RegisterDialog open={registerOpen} setOpen={setRegisterOpen} />
    </section>
  );
};

export default CtaSection;
