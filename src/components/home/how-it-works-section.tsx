
const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and build your professional profile highlighting your skills and experience.",
    icon: "👋",
  },
  {
    number: "02",
    title: "Explore Opportunities",
    description: "Browse thousands of job postings or receive AI-matched recommendations.",
    icon: "🔍",
  },
  {
    number: "03",
    title: "Apply with Ease",
    description: "Submit applications with just a click and track your progress in one place.",
    icon: "📝",
  },
  {
    number: "04",
    title: "Land Your Dream Job",
    description: "Interview, receive offers, and start your new professional journey.",
    icon: "🚀",
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold opacity-0 animate-fade-in text-foreground">
            How <span className="bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">Jobify</span> Works
          </h2>
          <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto opacity-0 animate-fade-in delay-100">
            Your journey to the perfect job is just a few simple steps away
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="relative opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[calc(100%-16px)] w-full h-0.5 bg-gradient-to-r from-jobify-blue to-jobify-teal"></div>
              )}
              
              <div className="bg-card rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-sm font-bold text-jobify-blue">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-foreground/60">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
