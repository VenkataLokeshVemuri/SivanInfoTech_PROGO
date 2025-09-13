import Image from "next/image";
import { ArrowRight, Play, Star, Users, Award, CheckCircle, Clock, MapPin, Phone, MessageCircle, CloudIcon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnrollModal from './EnrollModal';
import CounselorModal from './CounselorModal';

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
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/10 to-azure-blue/10 border border-primary/20 rounded-full text-sm font-semibold text-primary animate-fade-in">
                <Star className="mr-2 h-4 w-4 fill-current text-gcp-yellow" />
                Trusted by 200+ Companies • 4.9/5 Alumni Rating
              </div>

              {/* Main Headline with Motion Reveal */}
              <div
  className="space-y-6 text-center animate-fade-in"
  style={{ animationDelay: "0.2s", animationFillMode: "both" }}
>
  <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
    <span className="block bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
      Launch Your
    </span>
    <span className="block bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
      Cloud Career
    </span>
    <span className="block text-2xl md:text-3xl lg:text-4xl  font-medium mt-4">
      Get Trained by Industry Experts via
    </span>
  </h1>

  <p className="text-xl leading-relaxed font-medium">
    Instructor-led classes
  </p>
  <p className="text-xl leading-relaxed font-medium">
    Live Online & Classroom Training
  </p>
  <p className="text-xl leading-relaxed font-medium">
    With 100% Placement Support
  </p>
</div>


              {/* Key Points */}
             {/* Feature Buttons */}
{/* CTA Section */}
<div className="w-full flex flex-col items-center gap-6 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "both" }}>
  
  {/* Row 1: Enquire Now */}
  <div className="flex items-center space-x-3">
    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
      <CheckCircle className="h-4 w-4 text-white" />
    </div>
    <Button
      size="lg"
      variant="outline"
      className="px-8 py-4 text-lg rounded-xl border-2 border-green-600 text-green-700 font-semibold
                 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-md"
    >
      Enquire Now
    </Button>
  </div>

  {/* Row 2: Demo Class + Explore Career Tracks */}
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
    
    {/* Demo Class */}
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
        <CheckCircle className="h-4 w-4 text-white" />
      </div>
      <Button
        size="lg"
        variant="outline"
        className="px-8 py-4 text-lg rounded-xl border-2 border-green-600 text-green-700 font-semibold
                   hover:bg-green-600 hover:text-white transition-all duration-300 shadow-md"
      >
        📞 Make a Demo Class Now
      </Button>
    </div>

    {/* Explore Career Tracks */}
    <EnrollModal courseName="Cloud Computing Career Track">
      <Button
        size="lg"
        variant="outline"
        className="px-8 py-4 text-lg rounded-xl font-semibold shadow-md
                   bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0
                   hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
      >
        <Zap className="mr-2 h-5 w-5" />
        Explore Career Tracks
      </Button>
    </EnrollModal>
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
                <div className="aspect-square bg-gradient-to-br from-primary/5 via-azure-blue/5 to-aws-orange/5 rounded-3xl border border-primary/10 flex items-center justify-center relative overflow-hidden">
                  {/* Cloud Animation */}
                  <div className="relative">
                    <CloudIcon className="h-32 w-32 text-primary/30 animate-float" />
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-aws-orange to-gcp-red rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-r from-azure-blue to-gcp-yellow rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-8 left-8 flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-foreground">Live: 8 Students in Class</span>
                  </div>
                </div>
              </div>

              
              

              
            </div>
            
          </div>
          <div className="flex flex-wrap gap-6 mt-12 sm:flex-row justify-between">
  {/* Card 1 - Orange */}
  <div className="flex-1 min-w-[250px] text-center p-8 
                  bg-gradient-to-br from-orange-100 to-orange-200 
                  rounded-2xl animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
    <div className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 mb-3">
      200+
    </div>
    <div className="text-lg md:text-xl text-orange-700 font-semibold">
      Success Stories
    </div>
    <div className="text-sm md:text-base text-orange-600 mt-2">
      Across Top Tech Companies
    </div>
  </div>

  {/* Card 2 - Yellow */}
  <div className="flex-1 min-w-[250px] text-center p-8 
                  bg-gradient-to-br from-yellow-100 to-yellow-200 
                  rounded-2xl animate-fade-in" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
    <div className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600 mb-3">
      ₹8.5L
    </div>
    <div className="text-lg md:text-xl text-yellow-700 font-semibold">
      Avg. Package
    </div>
    <div className="text-sm md:text-base text-yellow-600 mt-2">
      For Our Alumni
    </div>
  </div>

  {/* Card 3 - Light Blue */}
  <div className="flex-1 min-w-[250px] text-center p-8 
                  bg-gradient-to-br from-sky-100 to-sky-200 
                  rounded-2xl animate-fade-in" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
    <div className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-sky-600 mb-3">
      98%
    </div>
    <div className="text-lg md:text-xl text-sky-700 font-semibold">
      Pass Rate
    </div>
    <div className="text-sm md:text-base text-sky-600 mt-2">
      Certification Success
    </div>
  </div>

  {/* Card 4 - Pink */}
  <div className="flex-1 min-w-[250px] text-center p-8 
                  bg-gradient-to-br from-pink-100 to-pink-200 
                  rounded-2xl animate-fade-in" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>
    <div className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-pink-600 mb-3">
      3
    </div>
    <div className="text-lg md:text-xl text-pink-700 font-semibold">
      Cloud Platforms
    </div>
    <div className="text-sm md:text-base text-pink-600 mt-2">
      AWS, Azure, GCP
    </div>
  </div>
</div>


              {/* Company Logos Preview */}
              <div className="text-center mt-0 space-y-4">
                <p className="text-sm font-medium text-muted-foreground">Our Alumni Work At</p>
                <div className="flex justify-center items-center space-x-6 opacity-60">
                  <div><Image src="/lovable-uploads/tcs-logo.png" alt="TCS logo" width={80} height={40} /></div>
                  <div ><Image src="/lovable-uploads/infosys-logo.png" alt="Infosys logo" width={80} height={40} /></div>
<div><Image src="/lovable-uploads/accenture-logo.png" alt="Accenture logo" width={80} height={40} /></div>
                  <div ><Image src="/lovable-uploads/zoho-logo.png" alt="Zoho logo" width={80} height={40} /></div>
                </div>
              </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
