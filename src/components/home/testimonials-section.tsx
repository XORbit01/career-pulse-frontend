
const testimonials = [
  {
    quote: "Career Pulse helped me find my dream role in just two weeks! The platform is so intuitive and the job matching is spot on.",
    author: "Sarah Johnson",
    role: "UX Designer at Adobe",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "As a hiring manager, I've found exceptional talent through Career Pulse. The quality of candidates and the filtering tools are excellent.",
    author: "Michael Chen",
    role: "Tech Lead at Spotify",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "After struggling with other job platforms, Career Pulse was a breath of fresh air. I found a remote position that perfectly matched my skills.",
    author: "Priya Patel",
    role: "Full Stack Developer",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-jobify-blue/5 to-jobify-teal/5 dark:from-jobify-blue/10 dark:to-jobify-teal/10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-60 h-60 bg-jobify-blue/10 dark:bg-jobify-blue/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-jobify-teal/10 dark:bg-jobify-teal/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold opacity-0 animate-fade-in">
            Success <span className="bg-gradient-to-r from-jobify-blue to-jobify-teal bg-clip-text text-transparent">Stories</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto opacity-0 animate-fade-in delay-100">
            Hear what our users have to say about their experience with Career Pulse
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.author}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="italic text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
              <div className="mt-6 flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm opacity-0 animate-fade-in delay-600">
            <span className="font-medium dark:text-white">Trusted by</span>
            <div className="flex items-center space-x-4">
              <span className="font-bold text-jobify-blue dark:text-jobify-blue-light">Microsoft</span>
              <span className="font-bold text-jobify-teal dark:text-jobify-teal-light">Google</span>
              <span className="font-bold text-jobify-blue dark:text-jobify-blue-light">Amazon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
