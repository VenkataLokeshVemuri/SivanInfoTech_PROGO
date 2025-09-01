
import { Star, ChevronLeft, ChevronRight, Briefcase, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const SuccessStories = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Cloud Engineer",
      company: "TCS",
      package: "₹12 LPA",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: "SitCloud transformed my career completely! From a non-IT background to landing a ₹12 LPA job at TCS in just 90 days. The hands-on AWS training was incredible!",
      rating: 5,
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
      background: "Non-IT",
      duration: "90 Days"
    },
    {
      name: "Rahul Kumar",
      role: "DevOps Engineer", 
      company: "Infosys",
      package: "₹9.5 LPA",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "The Azure and GCP training at SitCloud gave me the edge I needed. The mentors are industry experts who genuinely care about your growth.",
      rating: 5,
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
      background: "IT Support",
      duration: "120 Days"
    },
    {
      name: "Sneha Patel",
      role: "Cloud Architect",
      company: "Wipro", 
      package: "₹15 LPA",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "The comprehensive multi-cloud training program was a game-changer! Now I'm working on cutting-edge projects at Wipro. Best investment I ever made!",
      rating: 5,
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
      background: "Manual Tester",
      duration: "150 Days"
    },
    {
      name: "Amit Singh",
      role: "Junior Cloud Engineer",
      company: "Accenture",
      package: "₹8 LPA", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "From fresher to cloud engineer in 90 days! The placement support was amazing - they prepared me for every interview round.",
      rating: 5,
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
      background: "Fresh Graduate",
      duration: "90 Days"
    },
    {
      name: "Kavya Reddy",
      role: "Azure Specialist",
      company: "Microsoft",
      package: "₹18 LPA",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      quote: "SitCloud's Azure track helped me land my dream job at Microsoft! The practical projects and interview preparation were outstanding.",
      rating: 5,
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      background: "Software Developer",
      duration: "180 Days"
    },
    {
      name: "Arjun Nair",
      role: "GCP Consultant", 
      company: "Google",
      package: "₹22 LPA",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      quote: "The GCP specialization track at SitCloud is world-class. Got placed at Google with their excellent training and mentorship!",
      rating: 5,
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      background: "System Admin",
      duration: "200 Days"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2));
  };

  const visibleTestimonials = testimonials.slice(currentSlide * 2, currentSlide * 2 + 2);

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              <Star className="mr-2 h-4 w-4 fill-current" />
              Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Career <span className="text-blue-600">Transformations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From zero to cloud hero - see how our students transformed their careers and landed dream jobs at top companies
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {visibleTestimonials.map((testimonial, index) => (
                <Card key={index} className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-white">
                  <CardContent className="p-8">
                    {/* Quote */}
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed italic">
                        "{testimonial.quote}"
                      </p>
                    </div>

                    {/* Profile */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-blue-100"
                        />
                        <div>
                          <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                          <div className="text-blue-600 font-medium">{testimonial.role}</div>
                          <div className="text-sm text-gray-500">{testimonial.company}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                          {testimonial.package}
                        </div>
                        <img src={testimonial.companyLogo} alt={testimonial.company} className="h-8 w-auto" />
                      </div>
                    </div>

                    {/* Background Info */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span><strong>Background:</strong> {testimonial.background}</span>
                        <span><strong>Journey:</strong> {testimonial.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="rounded-full w-10 h-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="rounded-full w-10 h-10 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mt-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Join the Success Revolution! 🎉
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="flex flex-col items-center">
                <Briefcase className="h-8 w-8 mb-2" />
                <div className="text-2xl font-bold">2000+</div>
                <div className="text-blue-100">Students Placed</div>
              </div>
              <div className="flex flex-col items-center">
                <TrendingUp className="h-8 w-8 mb-2" />
                <div className="text-2xl font-bold">₹8.5L</div>
                <div className="text-blue-100">Average Package</div>
              </div>
              <div className="flex flex-col items-center">
                <Star className="h-8 w-8 mb-2 fill-current" />
                <div className="text-2xl font-bold">₹22L</div>
                <div className="text-blue-100">Highest Package</div>
              </div>
              <div className="flex flex-col items-center">
                <Star className="h-8 w-8 mb-2 fill-current" />
                <div className="text-2xl font-bold">98%</div>
                <div className="text-blue-100">Placement Rate</div>
              </div>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold">
              Start Your Transformation Today!
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
