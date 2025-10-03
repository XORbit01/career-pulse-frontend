import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">
                Career Pulse
              </span>
            </Link>
            <p className="mt-4 text-foreground/70 text-sm">
              Connecting talent with opportunity. Find your dream job or the perfect candidate.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-foreground/50 hover:text-jobify-blue transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-foreground/50 hover:text-jobify-blue transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
              For Job Seekers
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Salary Tool
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Company Reviews
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
              For Employers
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Recruitment Solutions
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Employer Resources
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
              About
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-jobify-blue transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8">
          <p className="text-sm text-foreground/50 text-center">
            &copy; {new Date().getFullYear()} Career Pulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
