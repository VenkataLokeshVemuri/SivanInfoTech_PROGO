import { CheckCircle, Code, Shield, Users, Briefcase, Settings, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CoreFeatures = () => {
  const featureCategories = [
    {
      icon: Code,
      title: "Hands-on Training & Projects",
      color: "from-blue-600 to-purple-600",
      bgColor: "bg-blue-50",
      features: [
        "Complete Practical Session",
        "Live Migration",
        "P2C, V2C, and C2C Migrations",
        "Real-Time AWS Project",
        "72 Hours of Live Training",
        "Live Interactive Sessions",
        "Infrastructure Components Overview"
      ]
    },
    {
      icon: Settings,
      title: "Architecture & Design Excellence",
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-50",
      features: [
        "AWS Architecture & Design",
        "Architecture Best Practices",
        "Design for Failure Strategies",
        "Designing for Durability, Elasticity, Scalability, HA, Resiliency",
        "AWS Five-Pillar Best Practice Recommendations",
        "Solution Designing",
        "Technical & Security Architecture Preparation"
      ]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      color: "from-green-600 to-teal-600",
      bgColor: "bg-green-50",
      features: [
        "AWS Security Incident Handling",
        "NIST-aligned Security Policy Implementation",
        "Cloud Security Topics",
        "DevSecOps Integration"
      ]
    },
    {
      icon: Briefcase,
      title: "Business & Pre-Sales Skills",
      color: "from-orange-600 to-red-600",
      bgColor: "bg-orange-50",
      features: [
        "Guidelines to Understand Business Requirements",
        "Guidelines for RFP / Pre-Sales Work",
        "Standards for Preparing AWS Quotes",
        "Advocacy & Evangelism Skills",
        "Case Studies",
        "BCP & DR Planning"
      ]
    },
    {
      icon: Users,
      title: "Career Development & Placement",
      color: "from-indigo-600 to-blue-600",
      bgColor: "bg-indigo-50",
      features: [
        "Resume Preparation with AWS Skill Set",
        "Profile Building Guidance",
        "Review Sessions & Feedback",
        "Mock Interview + Interview Preparation",
        "Placement Assistance",
        "Certificate of Completion"
      ]
    },
    {
      icon: Award,
      title: "Advanced Operations & DevOps",
      color: "from-cyan-600 to-blue-600",
      bgColor: "bg-cyan-50",
      features: [
        "DevOps Module",
        "Automation Use Cases",
        "Data Migration Techniques",
        "Daily Cloud Operations Activities",
        "Cloud Migration End-to-End (P2C, C2C, V2C)",
        "Drafting Migration Plans",
        "Lifetime Access to Recordings"
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-bold mb-6 shadow-lg">
              <Award className="mr-2 h-5 w-5" />
              Our Premium Training Features
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              What Makes Our Training 
              <span className="block bg-gradient-to-r from-primary via-secondary to-orange-500 bg-clip-text text-transparent">
                Absolutely Unique
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Industry's most comprehensive hands-on cloud training with real-world projects, expert mentorship, and guaranteed career transformation
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featureCategories.map((category, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-[1.02] bg-white/80 backdrop-blur-sm">
                <CardHeader className={`${category.bgColor} rounded-t-lg pb-6`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8">
                  <div className="space-y-4">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group-hover:hover:bg-primary/5">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 font-medium leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Premium CTA Section */}
          <div className="relative">
            <div className="bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-white/5 rounded-3xl"></div>
              
              <div className="relative z-10 text-center">
                <h3 className="text-4xl md:text-5xl font-bold mb-6">
                  🚀 Transform Your Career Today!
                </h3>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Experience the most comprehensive cloud training program with hands-on projects, expert mentorship, and guaranteed placement support
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                    🎯 Start Your Journey Now
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/50 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105">
                    📋 Download Full Curriculum
                  </button>
                </div>
                
                {/* Trust indicators */}
                <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <Award className="h-6 w-6" />
                    <span className="font-semibold">500+ Students Placed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-6 w-6" />
                    <span className="font-semibold">98% Success Rate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold">Industry Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreFeatures;