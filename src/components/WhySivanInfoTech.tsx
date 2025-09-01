import { Users, TrendingUp, Award, Target, CheckCircle, Star, Shield, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useEffect } from 'react';

const WhySivanInfoTech = () => {
  const [counters, setCounters] = useState({
    interns: 0,
    courses: 0,
    successStories: 0,
    placements: 0
  });

  const finalValues = {
    interns: 500,
    courses: 12,
    successStories: 200,
    placements: 98
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;

    const timer = setInterval(() => {
      setCounters(prev => ({
        interns: Math.min(prev.interns + finalValues.interns / steps, finalValues.interns),
        courses: Math.min(prev.courses + finalValues.courses / steps, finalValues.courses),
        successStories: Math.min(prev.successStories + finalValues.successStories / steps, finalValues.successStories),
        placements: Math.min(prev.placements + finalValues.placements / steps, finalValues.placements)
      }));
    }, stepDuration);

    setTimeout(() => clearInterval(timer), duration);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: Users,
      number: Math.floor(counters.interns),
      suffix: "+",
      title: "Interns Trained",
      description: "Successfully trained and placed",
      color: "text-primary"
    },
    {
      icon: Award,
      number: Math.floor(counters.courses),
      suffix: "",
      title: "Courses Offered",
      description: "Comprehensive certification tracks",
      color: "text-secondary"
    },
    {
      icon: TrendingUp,
      number: Math.floor(counters.successStories),
      suffix: "+",
      title: "Success Stories",
      description: "Career transformations achieved",
      color: "text-orange-600"
    },
    {
      icon: Target,
      number: Math.floor(counters.placements),
      suffix: "%",
      title: "Placement Rate",
      description: "Students successfully placed",
      color: "text-purple-600"
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "Industry Expert Trainers",
      description: "Learn from certified professionals with 10+ years experience",
      color: "bg-primary"
    },
    {
      icon: Star,
      title: "Hands-on Project Training",
      description: "Real-world projects to build your portfolio",
      color: "bg-secondary"
    },
    {
      icon: Shield,
      title: "100% Placement Guarantee",
      description: "We ensure you get placed or provide continuous support",
      color: "bg-orange-600"
    },
    {
      icon: Briefcase,
      title: "Career Transformation",
      description: "From zero to cloud professional in 90 days",
      color: "bg-purple-600"
    }
  ];

  return (
    <section id="why-sivan" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 animate-fade-in">
              <Star className="mr-2 h-4 w-4 fill-current" />
              Why Choose Sivan InfoTech
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              India's <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">#1 Cloud Training</span> Institute
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in">
              Join thousands of successful cloud professionals who transformed their careers with our comprehensive training programs and real-world projects
            </p>
          </div>

          {/* Stats Grid with Animated Counters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-105 animate-counter-up">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${stat.color === 'text-primary' ? 'bg-primary/10' : stat.color === 'text-secondary' ? 'bg-secondary/10' : stat.color === 'text-orange-600' ? 'bg-orange-100' : 'bg-purple-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.number}{stat.suffix}
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.title}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
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
          <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl p-8 text-white text-center mt-16 animate-fade-in">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join our next batch and become a certified cloud professional with guaranteed placement support and real-world project experience
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 animate-pulse-glow">
                📞 Talk to Counselor
              </button>
              <button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                📅 View Batch Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySivanInfoTech;