
import { CheckCircle } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "For Job Seekers",
      description: "Find the perfect role to match your skills and aspirations",
      icon: "👤",
      benefits: [
        "Access to thousands of job listings",
        "Create and share your professional profile",
        "Get matched with relevant opportunities",
        "Track applications in one place",
        "Career resources and guidance"
      ]
    },
    {
      title: "For Employers",
      description: "Connect with top talent to grow your team",
      icon: "🏢",
      benefits: [
        "Post unlimited job listings",
        "Advanced candidate filtering",
        "AI-powered candidate matching",
        "Employer branding tools",
        "Recruitment analytics"
      ]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold opacity-0 animate-fade-in text-foreground">
            Designed for <span className="bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">Everyone</span>
          </h2>
          <p className="mt-4 text-lg text-foreground/60 max-w-2xl mx-auto opacity-0 animate-fade-in delay-100">
            Whether you're looking for your next career move or hiring talent for your team, 
            Jobify provides tools to make the process smooth and effective.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.2 + 0.2}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-foreground/60 mb-6">{feature.description}</p>
              
              <ul className="space-y-3">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-jobify-teal mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
