
import { Users, TrendingUp, Award, Target, CheckCircle, Star, Shield, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const WhySitCloud = () => {
  const stats = [
    {
      icon: Users,
      number: "2000+",
      title: "Students Placed",
      description: "Successfully placed in top companies"
    },
    {
      icon: TrendingUp,
      number: "₹8.5L",
      title: "Avg Package",
      description: "Average salary package achieved"
    },
    {
      icon: Award,
      number: "98%",
      title: "Pass Rate",
      description: "Certification success rate"
    },
    {
      icon: Target,
      number: "3",
      title: "Multi-Cloud Experts",
      description: "AWS, Azure, GCP specialization"
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "Industry Expert Trainers",
      description: "Learn from certified professionals with 10+ years experience"
    },
    {
      icon: Star,
      title: "Hands-on Project Training",
      description: "Real-world projects to build your portfolio"
    },
    {
      icon: Shield,
      title: "100% Placement Guarantee",
      description: "We ensure you get placed or money back"
    },
    {
      icon: Briefcase,
      title: "Career Transformation",
      description: "From zero to cloud professional in 90 days"
    }
  ];

  return (
    <section id="why-sitcloud" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              <Star className="mr-2 h-4 w-4 fill-current" />
              Why Choose SitCloud
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              India's <span className="text-blue-600">#1 Cloud Training</span> Institute
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful cloud professionals who transformed their careers with our comprehensive training programs
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.title}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center mt-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join our next batch and become a certified cloud professional with guaranteed placement support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                📞 Talk to Counselor
              </button>
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                📅 View Batch Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySitCloud;
