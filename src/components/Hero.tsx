
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
              <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="block text-gradient-primary">
                    Launch Your
                  </span>
                  <span className="block text-gradient-aws">
                    Cloud Career
                  </span>
                  <span className="block text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium">
                    with Hands-on Real-World Projects
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  Master <span className="text-gradient-aws font-bold">AWS, Azure & GCP</span> with industry-certified mentorship. 
                  Join our alumni working at top tech companies.
                </p>
              </div>

              {/* Key Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium">Multi-Cloud Certifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium">100% Placement Assistance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium">Industry Expert Trainers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-secondary to-secondary/80 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-foreground font-medium">Live Project Training</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
                <EnrollModal courseName="Cloud Computing Career Track">
                  <Button size="lg" className="btn-gradient-primary px-8 py-4 text-lg rounded-xl">
                    <Zap className="mr-2 h-5 w-5" />
                    Explore Career Tracks
                  </Button>
                </EnrollModal>
                <CounselorModal>
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-all duration-300">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Get Free Career Guidance
                  </Button>
                </CounselorModal>
              </div>

              {/* Contact Info */}
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
              </div>
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

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-azure-blue/5 rounded-2xl border border-primary/10 card-hover">
                  <div className="text-4xl font-bold text-gradient-primary mb-2">200+</div>
                  <div className="text-muted-foreground font-medium">Success Stories</div>
                  <div className="text-xs text-muted-foreground/80 mt-1">Across Top Tech Companies</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-2xl border border-secondary/10 card-hover">
                  <div className="text-4xl font-bold text-gradient-aws mb-2">₹8.5L</div>
                  <div className="text-muted-foreground font-medium">Avg. Package</div>
                  <div className="text-xs text-muted-foreground/80 mt-1">For Our Alumni</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-aws-orange/5 to-gcp-red/5 rounded-2xl border border-aws-orange/10 card-hover">
                  <div className="text-4xl font-bold text-gradient-aws mb-2">98%</div>
                  <div className="text-muted-foreground font-medium">Pass Rate</div>
                  <div className="text-xs text-muted-foreground/80 mt-1">Certification Success</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-gcp-yellow/5 to-gcp-red/5 rounded-2xl border border-gcp-yellow/10 card-hover">
                  <div className="text-4xl font-bold text-gradient-primary mb-2">3</div>
                  <div className="text-muted-foreground font-medium">Cloud Platforms</div>
                  <div className="text-xs text-muted-foreground/80 mt-1">AWS, Azure, GCP</div>
                </div>
              </div>

              {/* Company Logos Preview */}
              <div className="text-center space-y-4">
                <p className="text-sm font-medium text-muted-foreground">Our Alumni Work At</p>
                <div className="flex justify-center items-center space-x-6 opacity-60">
                  <div className="text-lg font-bold text-primary">TCS</div>
                  <div className="text-lg font-bold text-azure-blue">Infosys</div>
                  <div className="text-lg font-bold text-aws-orange">Accenture</div>
                  <div className="text-lg font-bold text-secondary">Zoho</div>
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
