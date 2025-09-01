import { Star, Quote, ArrowLeft, ArrowRight, TrendingUp, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const SuccessStoriesNew = () => {
  const [currentStory, setCurrentStory] = useState(0);

  const stories = [
    {
      name: "Priya Sharma",
      role: "Cloud Solutions Architect",
      company: "TCS",
      location: "Chennai",
      salary: "₹12.5 LPA",
      growth: "+150%",
      image: "/lovable-uploads/0a7abc76-98be-4539-afe0-af53f9ef9f9d.png",
      testimonial: "SitCloud's hands-on approach transformed my career completely. From a fresher to a Cloud Architect in just 6 months!",
      track: "AWS",
      rating: 5,
      previousRole: "Recent Graduate"
    },
    {
      name: "Rajesh Kumar",
      role: "DevOps Engineer", 
      company: "Infosys",
      location: "Bengaluru",
      salary: "₹9.8 LPA",
      growth: "+180%",
      image: "/lovable-uploads/5aeb5c53-aa36-4228-8fe5-e1f8f39e617d.png",
      testimonial: "The real-world projects and mentorship helped me land my dream job. The placement support was exceptional!",
      track: "Azure",
      rating: 5,
      previousRole: "Support Engineer"
    },
    {
      name: "Sneha Reddy",
      role: "Cloud Platform Engineer",
      company: "Accenture", 
      location: "Hyderabad",
      salary: "₹11.2 LPA",
      growth: "+200%",
      image: "/lovable-uploads/8c10229f-df92-4663-affd-fb5ac9fc2261.png",
      testimonial: "Multi-cloud training gave me an edge in interviews. Now I work with all three major cloud platforms!",
      track: "Multi-Cloud",
      rating: 5,
      previousRole: "Junior Developer"
    },
    {
      name: "Arjun Patel",
      role: "Senior Cloud Engineer",
      company: "Zoho",
      location: "Chennai",
      salary: "₹13.5 LPA", 
      growth: "+220%",
      image: "/lovable-uploads/d8a0ba94-804b-43b9-8d41-1962ad27ecba.png",
      testimonial: "From zero cloud knowledge to leading cloud migrations. SitCloud's training is unmatched in the industry!",
      track: "GCP",
      rating: 5,
      previousRole: "Manual Tester"
    }
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-muted/20 to-accent/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
              From Interns to Cloud Engineers
            </h2>
            <p className="text-xl text-muted-foreground mb-4">Our Alumni Speak</p>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-gcp-yellow fill-current" />
              ))}
              <span className="ml-3 text-lg font-semibold text-foreground">4.9/5 from 200+ Reviews</span>
            </div>
          </div>

          {/* Main Carousel */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-primary/10 overflow-hidden">
              <div className="grid lg:grid-cols-2">
                {/* Left - Image & Stats */}
                <div className="relative bg-gradient-to-br from-primary/5 to-azure-blue/5 p-8 flex flex-col justify-center items-center">
                  <div className="relative mb-6">
                    <img 
                      src={stories[currentStory].image} 
                      alt={stories[currentStory].name}
                      className="w-32 h-32 rounded-full object-cover shadow-xl border-4 border-white"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-secondary to-secondary/80 rounded-full p-2">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{stories[currentStory].name}</h3>
                      <p className="text-muted-foreground">{stories[currentStory].role}</p>
                      <p className="text-primary font-semibold">{stories[currentStory].company}</p>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{stories[currentStory].location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-4 bg-white/50 rounded-xl">
                        <div className="text-2xl font-bold text-gradient-aws">{stories[currentStory].salary}</div>
                        <div className="text-xs text-muted-foreground">Current Package</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-xl">
                        <div className="text-2xl font-bold text-gradient-primary">{stories[currentStory].growth}</div>
                        <div className="text-xs text-muted-foreground">Salary Growth</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Testimonial */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-6">
                    <Quote className="h-12 w-12 text-primary/20 mb-4" />
                    <p className="text-lg text-foreground leading-relaxed mb-6">
                      "{stories[currentStory].testimonial}"
                    </p>
                    
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(stories[currentStory].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gcp-yellow fill-current" />
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Track Completed:</span>
                        <span className="font-semibold text-primary">{stories[currentStory].track}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Previous Role:</span>
                        <span className="font-semibold text-foreground">{stories[currentStory].previousRole}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button 
              onClick={prevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-primary/10 p-0"
              variant="outline"
            >
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
            
            <Button 
              onClick={nextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl border border-primary/10 p-0"
              variant="outline"
            >
              <ArrowRight className="h-5 w-5 text-primary" />
            </Button>
          </div>

          {/* Story Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStory(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStory 
                    ? 'bg-gradient-to-r from-primary to-azure-blue scale-125' 
                    : 'bg-primary/20 hover:bg-primary/40'
                }`}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-primary/10 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Join Our Success Stories?</h3>
              <p className="text-muted-foreground mb-6">Start your cloud career transformation today with our proven training methodology</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-gradient-primary px-8 py-3 rounded-xl font-semibold">
                  Start Your Journey
                </Button>
                <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-semibold">
                  View All Success Stories
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesNew;