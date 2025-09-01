import { CloudIcon, Award, Clock, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CourseTracksNew = () => {
  const tracks = [
    {
      title: "AWS Track",
      subtitle: "Amazon Web Services",
      duration: "3-4 Months",
      priceRange: "₹25,000 - ₹35,000",
      outcome: "Cloud Engineer @ ₹8.5 LPA",
      gradient: "from-aws-orange to-gcp-red",
      bgGradient: "from-aws-orange/5 to-gcp-red/5",
      borderColor: "border-aws-orange/20",
      certifications: ["AWS Solutions Architect", "AWS SysOps Administrator", "AWS Developer Associate"],
      highlights: ["72 Hours Live Training", "Real AWS Projects", "Industry Mentorship", "Placement Support"],
      icon: "☁️"
    },
    {
      title: "Azure Track", 
      subtitle: "Microsoft Azure",
      duration: "3-4 Months",
      priceRange: "₹25,000 - ₹35,000", 
      outcome: "Cloud Architect @ ₹9.2 LPA",
      gradient: "from-azure-blue to-primary",
      bgGradient: "from-azure-blue/5 to-primary/5",
      borderColor: "border-azure-blue/20",
      certifications: ["Azure Fundamentals", "Azure Administrator", "Azure Solutions Architect"],
      highlights: ["Live Migration Training", "DevOps Integration", "Security Best Practices", "Career Guidance"],
      icon: "🔷"
    },
    {
      title: "GCP Track",
      subtitle: "Google Cloud Platform", 
      duration: "3-4 Months",
      priceRange: "₹25,000 - ₹35,000",
      outcome: "DevOps Engineer @ ₹8.8 LPA",
      gradient: "from-gcp-yellow to-secondary",
      bgGradient: "from-gcp-yellow/5 to-secondary/5", 
      borderColor: "border-gcp-yellow/20",
      certifications: ["GCP Associate Engineer", "GCP Professional Architect", "GCP DevOps Engineer"],
      highlights: ["Cloud Migration Mastery", "Kubernetes Training", "Multi-Cloud Skills", "Resume Building"],
      icon: "🌈"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white to-accent/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
              Choose Your Cloud Career Path
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive certification programs designed to transform you into a cloud professional
            </p>
          </div>

          {/* Course Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {tracks.map((track, index) => (
              <div key={index} className={`relative bg-gradient-to-br ${track.bgGradient} rounded-3xl border ${track.borderColor} p-8 card-hover group`}>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">{track.icon}</div>
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${track.gradient} bg-clip-text text-transparent mb-2`}>
                    {track.title}
                  </h3>
                  <p className="text-muted-foreground font-medium">{track.subtitle}</p>
                </div>

                {/* Course Details */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="font-medium text-foreground">Duration</span>
                    </div>
                    <span className="text-muted-foreground font-semibold">{track.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-secondary" />
                      <span className="font-medium text-foreground">Investment</span>
                    </div>
                    <span className="text-muted-foreground font-semibold">{track.priceRange}</span>
                  </div>

                  <div className="bg-white/50 rounded-xl p-4 border border-white/20">
                    <div className="flex items-center space-x-3 mb-2">
                      <Award className="h-5 w-5 text-gcp-yellow" />
                      <span className="font-semibold text-foreground">Expected Outcome</span>
                    </div>
                    <p className={`text-lg font-bold bg-gradient-to-r ${track.gradient} bg-clip-text text-transparent`}>
                      {track.outcome}
                    </p>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-8">
                  <h4 className="font-semibold text-foreground mb-4 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-primary" />
                    Certifications Covered
                  </h4>
                  <div className="space-y-2">
                    {track.certifications.map((cert, certIndex) => (
                      <div key={certIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-8">
                  <h4 className="font-semibold text-foreground mb-4">Key Highlights</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {track.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-azure-blue rounded-full flex-shrink-0"></div>
                        <span className="text-xs text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button className={`w-full bg-gradient-to-r ${track.gradient} hover:opacity-90 text-white font-semibold py-4 rounded-xl transition-all duration-300 group-hover:scale-105`}>
                  View Curriculum
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-white rounded-2xl p-6 shadow-lg border border-primary/10">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Not sure which track to choose?</p>
                <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold">
                  Get Free Career Counseling
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseTracksNew;