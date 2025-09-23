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
              <div key={index} className="relative bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
                {/* Top Colored Header */}
                <div className={`h-3 w-full ${
                  index === 0 ? 'bg-blue-500' : 
                  index === 1 ? 'bg-green-500' : 
                  'bg-blue-600'
                }`}></div>
                
                {/* Header */}
                <div className="text-center py-8 px-8">
                  {/* Cloud Platform Icon */}
                  <div className="mb-6">
                    {index === 0 && (
                      <img src="/logos/aws.svg" alt="AWS" className="h-16 mx-auto" />
                    )}
                    {index === 1 && (
                      <img src="/logos/azure.svg" alt="Azure" className="h-16 mx-auto" />
                    )}
                    {index === 2 && (
                      <img src="/logos/google-cloud.svg" alt="Google Cloud" className="h-16 mx-auto" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {track.title}
                  </h3>
                  <p className="text-gray-600 font-medium">{track.subtitle}</p>
                </div>

                {/* Course Details */}
                <div className="space-y-6 mb-8 px-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <span className="font-medium text-gray-700">Duration</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{track.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
                      </div>
                      <span className="font-medium text-gray-700">Investment</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{track.priceRange}</span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center">
                        <Award className="h-5 w-5 text-amber-600" strokeWidth={1.5} />
                      </div>
                      <span className="font-semibold text-gray-700">Expected Outcome</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800 pl-12">
                      {track.outcome}
                    </p>
                  </div>
                </div>

                {/* Certifications */}
                <div className="mb-8 px-8">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <Award className="h-3 w-3 text-blue-600" strokeWidth={2} />
                    </div>
                    Certifications Covered
                  </h4>
                  <div className="space-y-3 pl-8">
                    {track.certifications.map((cert, certIndex) => (
                      <div key={certIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" strokeWidth={2} />
                        <span className="text-gray-600">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-8 px-8">
                  <h4 className="font-semibold text-gray-800 mb-4">Key Highlights</h4>
                  <div className="grid grid-cols-2 gap-3 pl-1">
                    {track.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 
                          'bg-blue-600'
                        } flex-shrink-0`}></div>
                        <span className="text-sm text-gray-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="px-8 pb-8 mb-2.5 mt-auto">
                  <Button className={`w-full shadow-lg hover:shadow-xl font-semibold py-5 rounded-xl transition-colors duration-300 ${
                    index === 0 ? 'bg-blue-500 hover:bg-blue-600' : 
                    index === 1 ? 'bg-green-500 hover:bg-green-600' : 
                    'bg-blue-600 hover:bg-blue-700'
                  } text-white`}>
                    View Curriculum
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-4 bg-white rounded-2xl p-6 shadow-lg border border-primary/10">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Not sure which track to choose?</p>
                <Button variant="outline" className="border-2 bg-green-500 border-primary text-white hover:bg-green-600 transition-colors duration-300 font-semibold">
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