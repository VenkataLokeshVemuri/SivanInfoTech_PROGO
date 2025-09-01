
import { Users, CloudUpload, GraduationCap, Laptop, BookOpen, Building, Star, Target, Award, Zap, CheckCircle, Clock, Trophy, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Features = () => {
  const trainingFeatures = [
    {
      icon: Users,
      title: 'Expert Faculty',
      description: 'Learn from industry veterans with 10+ years of experience at top companies like Amazon, Microsoft, Google.',
      highlight: '50+ Expert Trainers'
    },
    {
      icon: Laptop,
      title: 'Hands-On Training',
      description: 'Real-world projects and live labs on actual cloud environments. Build your portfolio while learning.',
      highlight: '24/7 Lab Access'
    },
    {
      icon: Award,
      title: 'Industry Certifications',
      description: 'Get certified in AWS, Azure, GCP with our comprehensive exam preparation and guaranteed pass rates.',
      highlight: '95% Pass Rate'
    },
    {
      icon: Briefcase,
      title: '100% Placement Support',
      description: 'Dedicated placement team, interview preparation, and direct tie-ups with 500+ companies.',
      highlight: '98% Placement Success'
    },
    {
      icon: Clock,
      title: 'Flexible Batches',
      description: 'Weekday, weekend, and online batches available. Choose timings that fit your schedule.',
      highlight: 'Multiple Time Slots'
    },
    {
      icon: BookOpen,
      title: 'Updated Curriculum',
      description: 'Latest industry trends, AI/ML integration, and emerging cloud technologies included in training.',
      highlight: 'Industry Aligned'
    }
  ];

  const whyChooseUs = [
    { icon: Building, title: '15+ Years', desc: 'Training Experience' },
    { icon: Users, title: '2000+', desc: 'Students Placed' },
    { icon: Trophy, title: '#1 Rated', desc: 'Training Institute' },
    { icon: Star, title: '4.9/5', desc: 'Student Rating' }
  ];

  const placementPartners = [
    'TCS', 'Infosys', 'Wipro', 'Accenture', 'IBM', 'Amazon', 'Microsoft', 'Google', 'Cognizant', 'HCL', 'Capgemini', 'Deloitte'
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-6">
              <Star className="mr-2 h-4 w-4" />
              Why 2000+ Students Choose SitCloud
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Best-in-Class Cloud Training
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience world-class training methodology with industry experts, hands-on projects, and guaranteed career success.
            </p>
          </div>

          {/* Why Choose Us Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {whyChooseUs.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.title}</div>
                <div className="text-gray-600 text-sm">{stat.desc}</div>
              </div>
            ))}
          </div>

          {/* Training Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {trainingFeatures.map((feature, index) => (
              <Card key={index} className="bg-white hover:shadow-lg transition-all duration-300 border border-gray-200 group h-full">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-gray-600 text-base leading-relaxed mb-4 flex-1">
                    {feature.description}
                  </CardDescription>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">{feature.highlight}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Placement Partners */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Placement Partners
              </h3>
              <p className="text-gray-600 text-lg">
                Direct recruitment opportunities with top companies
              </p>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {placementPartners.map((company, index) => (
                <div key={index} className="bg-white p-4 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-gray-700 font-semibold text-sm">{company}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Success Metrics */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">
                Proven Track Record of Success
              </h3>
              <p className="text-green-100 text-lg">
                Real results that speak for our training quality
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Award className="h-12 w-12 text-yellow-300 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-green-200">Placement Success Rate</div>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-300 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2">2000+</div>
                <div className="text-green-200">Students Trained</div>
              </div>
              <div className="text-center">
                <Zap className="h-12 w-12 text-purple-300 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2">₹8.5L</div>
                <div className="text-green-200">Average Package</div>
              </div>
              <div className="text-center">
                <Star className="h-12 w-12 text-yellow-300 mx-auto mb-3 fill-current" />
                <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
                <div className="text-green-200">Student Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
