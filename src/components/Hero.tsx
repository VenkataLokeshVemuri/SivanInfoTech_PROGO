import Image from "next/image";
import { ArrowRight, Play, Star, Users, Award, CheckCircle, Clock, MapPin, Phone, MessageCircle, CloudIcon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnrollModal from './EnrollModal';
import CounselorModal from './CounselorModal';

// Higher quality SVG icons for improved visual quality
const RocketIcon = () => (
  <svg width="46" height="46" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
    <path d="M12.9989 3.38055L15.3771 5.75868C17.8026 8.18423 19.2295 9.89782 19.3616 11.9361C19.3857 12.3246 19.3857 12.7148 19.3616 13.1033C19.2295 15.1416 17.8026 16.8552 15.3771 19.2807L12.9989 21.6589" 
          stroke="#FF5733" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11.0011 21.6589L8.62301 19.2807C6.19745 16.8552 4.77051 15.1416 4.63843 13.1033C4.61423 12.7148 4.61423 12.3246 4.63843 11.9361C4.77051 9.89782 6.19745 8.18423 8.62301 5.75868L11.0011 3.38055" 
          stroke="#FF5733" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 3.38055V7.07404" stroke="#FF5733" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 17.8892V21.5827" stroke="#FF5733" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="12.4919" r="3" stroke="#FF5733" strokeWidth="1.5" />
    <path d="M15 9.49194L17.5 6.99194" stroke="#FF5733" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 9.49194L6.5 6.99194" stroke="#FF5733" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 15.4919L17.5 17.9919" stroke="#FF5733" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 15.4919L6.5 17.9919" stroke="#FF5733" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-white via-accent/20 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-azure-blue/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-aws-orange/20 to-gcp-red/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-gcp-yellow/20 to-secondary/20 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-azure-blue/10 border border-primary/20 rounded-full text-sm font-semibold text-primary animate-fade-in shadow-sm">
                <Star className="mr-2 h-4 w-4 fill-current text-amber-500" strokeWidth={1.5} />
                Trusted by 200+ Companies • 4.9/5 Alumni Rating
              </div>

              {/* Main Headline with Motion Reveal */}
              <div
  className="space-y-6 animate-fade-in"
  style={{ animationDelay: "0.2s", animationFillMode: "both" }}
>
  <div className="flex items-center gap-4 mb-2">
    <RocketIcon />
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold">
      <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent animate-typewriter">
        Transform Your
      </span>
      <span className="block bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent animate-typewriter-delay-1">
        Career Today!
      </span>
    </h1>
  </div>
  
  <p className="text-xl text-gray-600 leading-relaxed mt-6 max-w-2xl">
    Experience the most comprehensive cloud training program with hands-on projects,
    expert mentorship, and guaranteed placement support.
  </p>

  <div className="space-y-3 mt-6">
    <p className="text-lg leading-relaxed font-medium flex items-center text-gray-700">
      <CheckCircle className="mr-2 h-5 w-5 text-green-500" strokeWidth={2} />
      Instructor-led classes
    </p>
    <p className="text-lg leading-relaxed font-medium flex items-center text-gray-700">
      <CheckCircle className="mr-2 h-5 w-5 text-green-500" strokeWidth={2} />
      Live Online & Classroom Training
    </p>
    <p className="text-lg leading-relaxed font-medium flex items-center text-gray-700">
      <CheckCircle className="mr-2 h-5 w-5 text-green-500" strokeWidth={2} />
      With 100% Placement Support
    </p>
  </div>
</div>


              {/* Key Points */}
             {/* Feature Buttons */}
{/* CTA Section */}
<div className="w-full flex flex-col gap-6 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
  
  {/* Row 1: Main CTA - Explore Career Tracks */}
  <div className="flex justify-start">
    <EnrollModal courseName="Cloud Computing Career Track">
      <Button
        size="lg"
        className="px-8 py-6 text-lg rounded-xl font-semibold shadow-lg
                  bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0
                  hover:from-emerald-600 hover:to-green-700 transition-all duration-300
                  transform hover:scale-105 hover:shadow-xl"
      >
        <Zap className="mr-3 h-5 w-5" strokeWidth={2.5} />
        Start Your Journey Now
      </Button>
    </EnrollModal>
  </div>

  {/* Row 2: Secondary Actions */}
  <div className="flex flex-col sm:flex-row gap-5">
    {/* Enquire Now */}
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
        <CheckCircle className="h-4 w-4 text-white" strokeWidth={2.5} />
      </div>
      <Button
        size="lg"
        variant="outline"
        className="px-6 py-5 text-base rounded-xl border-2 border-green-600 text-green-700 font-semibold
                 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-md"
      >
        Enquire Now
      </Button>
    </div>
    
    {/* Demo Class */}
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
        <Phone className="h-4 w-4 text-white" strokeWidth={2.5} />
      </div>
      <Button
        size="lg"
        variant="outline"
        className="px-6 py-5 text-base rounded-xl border-2 border-green-600 text-green-700 font-semibold
                 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-md"
      >
        Schedule Demo Class
      </Button>
    </div>
  </div>



                {/* <CounselorModal>
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-xl border-2 border-primary text-primary hover:bg-primary  font-semibold transition-all duration-300">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Get Free Career Guidance
                  </Button>
                </CounselorModal> */}
              </div>

              {/* Contact Info
              <div className="space-y-3 text-muted-foreground animate-fade-in" style={{animationDelay: '0.8s'}}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-aws-orange/10 to-aws-orange/5 rounded-lg">
                    <Phone className="h-5 w-5 text-aws-orange" />
                  </div>
                  <span className="font-medium">Call: +91 89255 30011</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Chennai: Guduvancheri | Bengaluru: BTM Layout</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="font-medium">Online & Offline Classes Available</span>
                </div>
              </div> */}
            </div>

            {/* Right Content - 3D Animation Placeholder & Stats */}
            <div className="space-y-8 animate-fade-in" style={{animationDelay: '1s'}}>
              {/* 3D Animation Placeholder */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/5 via-azure-blue/5 to-aws-orange/5 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  {/* Cloud Animation */}
                  <div className="relative">
                    <div className="animate-float">
                      <Image 
                        src="/lovable-uploads/homepage-logo.jpg" 
                        alt="Homepage Logo"
                        width={613}
                        height={600}
                        className="rounded-2xl shadow-lg object-contain"
                        priority
                      />
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-aws-orange to-gcp-red rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-azure-blue to-gcp-yellow rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-8 left-8 flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                   
                  </div>
                </div>
              </div>

              
              

              
            </div>
            
          </div>
          <div className="flex flex-wrap gap-6 mt-16 sm:flex-row justify-between">
  {/* Card 1 - 500+ Students Placed */}
  <div className="flex-1 min-w-[250px] text-center p-8 
                  bg-white shadow-lg border border-gray-100
                  rounded-2xl animate-fade-in hover:shadow-xl transition-all duration-300" 
                  style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
    <div className="flex justify-center mb-4">
      <div className="w-14 h-14 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full flex items-center justify-center">
        <Users className="h-7 w-7 text-blue-500" strokeWidth={1.5} />
      </div>
    </div>
    <div className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
      500+
    </div>
    <div className="text-lg md:text-xl text-gray-700 font-semibold">
      Students Placed
    </div>
  </div>

  {/* Card 2 - 98% Success Rate */}
  <div className="flex-1 min-w-[250px] text-center p-8 
                  bg-white shadow-lg border border-gray-100
                  rounded-2xl animate-fade-in hover:shadow-xl transition-all duration-300" 
                  style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
    <div className="flex justify-center mb-4">
      <div className="w-14 h-14 bg-gradient-to-r from-green-50 to-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-7 w-7 text-green-500" strokeWidth={1.5} />
      </div>
    </div>
    <div className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
      98%
    </div>
    <div className="text-lg md:text-xl text-gray-700 font-semibold">
      Success Rate
    </div>
  </div>

  {/* Card 3 - Industry Certified */}
  <div className="flex-1 min-w-[250px] text-center p-8 
                  bg-white shadow-lg border border-gray-100
                  rounded-2xl animate-fade-in hover:shadow-xl transition-all duration-300" 
                  style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
    <div className="flex justify-center mb-4">
      <div className="w-14 h-14 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full flex items-center justify-center">
        <Award className="h-7 w-7 text-amber-500" strokeWidth={1.5} />
      </div>
    </div>
    <div className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
      100%
    </div>
    <div className="text-lg md:text-xl text-gray-700 font-semibold">
      Industry Certified
    </div>
  </div>
</div>


              {/* Company Logos Preview */}
              <div className="text-center mt-16 space-y-8">
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-gray-800">Our Alumni Work At</p>
                  <p className="text-sm text-gray-600">Trusted by professionals at leading technology companies</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex justify-center items-center flex-wrap gap-8 md:gap-12">
                    <div className="group transition-all duration-300 hover:scale-110 hover:shadow-md rounded-lg p-3">
                      <Image 
                        src="/lovable-uploads/tcs-logo.png" 
                        alt="TCS logo" 
                        width={100} 
                        height={50} 
                        className="grayscale hover:grayscale-0 transition-all duration-300 object-contain"
                      />
                    </div>
                    <div className="group transition-all duration-300 hover:scale-110 hover:shadow-md rounded-lg p-3">
                      <Image 
                        src="/lovable-uploads/infosys-logo.png" 
                        alt="Infosys logo" 
                        width={100} 
                        height={50} 
                        className="grayscale hover:grayscale-0 transition-all duration-300 object-contain"
                      />
                    </div>
                    <div className="group transition-all duration-300 hover:scale-110 hover:shadow-md rounded-lg p-3">
                      <Image 
                        src="/lovable-uploads/accenture-logo.png" 
                        alt="Accenture logo" 
                        width={100} 
                        height={50} 
                        className="grayscale hover:grayscale-0 transition-all duration-300 object-contain"
                      />
                    </div>
                    <div className="group transition-all duration-300 hover:scale-110 hover:shadow-md rounded-lg p-3">
                      <Image 
                        src="/lovable-uploads/zoho-logo.png" 
                        alt="Zoho logo" 
                        width={100} 
                        height={50} 
                        className="grayscale hover:grayscale-0 transition-all duration-300 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
