"use client";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cloud, Award, Users, Target, Eye, Heart, BookOpen, 
  GraduationCap, Zap, Shield, Globe, Star, CheckCircle,
  Lightbulb, TrendingUp, Database, Code, Brain, Settings,
  Rocket, Building, ArrowRight, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const AboutUs = () => {
  const specializations = [
    { icon: Cloud, title: "Cloud Platforms", description: "AWS, Microsoft Azure, Google Cloud" },
    { icon: Settings, title: "DevOps & DevSecOps", description: "Multi-Cloud DevOps solutions" },
    { icon: Database, title: "Kubernetes", description: "Container Orchestration" },
    { icon: Brain, title: "AI & Machine Learning", description: "Advanced artificial intelligence" },
    { icon: Code, title: "Python Programming", description: "Statistics, Data Visualization" },
    { icon: Sparkles, title: "Advanced AI", description: "GenAI, Agentic AI, MLOps" }
  ];

  const exposureAreas = [
    "Micro Data Centers",
    "Cloud Migration (P2C, C2C, V2C)",
    "Capstone Projects & Real-Time Scenarios"
  ];

  const whyChooseUs = [
    { icon: GraduationCap, title: "Flexible Learning Models", description: "Classroom, Online & Hybrid" },
    { icon: Award, title: "Global Certification", description: "Preparation for industry certifications" },
    { icon: Users, title: "Placement Assistance", description: "Career Mentoring & Job Support" },
    { icon: Lightbulb, title: "Scenario-Based Learning", description: "Workshops & Live Recordings" },
    { icon: Star, title: "25% OFF + Free Demo", description: "Special pricing on every course" },
    { icon: Cloud, title: "Hands-On Practice", description: "Free Cloud Accounts included" }
  ];

  return (
    <>
      <SEOHead 
        title="About SITCLOUD - Next-Generation Cloud & AI Training" 
        description="Learn about SITCLOUD's mission to bridge classroom learning with real-world IT needs through expert cloud, AI, and DevOps training programs."
      />
      <Header />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-green-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-sm font-semibold text-white mb-8 shadow-lg">
                <Building className="mr-2 h-4 w-4" />
                About SITCLOUD
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
                Empowering the 
                <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent block md:inline"> Future of Tech</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto">
                Next-generation training and consulting company preparing professionals to thrive in the evolving digital landscape
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold shadow-xl">
                    <Rocket className="mr-2 h-5 w-5" />
                    Start Your Journey
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold backdrop-blur-xl">
                    <Users className="mr-2 h-5 w-5" />
                    Talk to Expert
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="bg-blue-100 text-blue-600 mb-4">Who We Are</Badge>
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
                  Leading the Future of Learning
                </h2>
              </div>
              
              <Card className="border-0 bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mb-6">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Foundation</h3>
                      <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        At SITCLOUD, we believe that the future belongs to those who master Cloud, AI, and DevOps skills. 
                        As a next-generation training and consulting company, we prepare students, working professionals, 
                        and enterprises to thrive in the evolving digital landscape.
                      </p>
                      <p className="text-lg text-gray-700 leading-relaxed">
                        Founded with a vision to bridge the gap between classroom learning and real-world IT needs, 
                        we bring together expert trainers, global certifications, and hands-on labs to create a learning 
                        experience that is practical, career-focused, and industry-ready.
                      </p>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl blur opacity-20"></div>
                      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 border border-blue-200">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-black text-gray-900">500+</div>
                            <div className="text-sm text-gray-600">Students Trained</div>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <Award className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-black text-gray-900">95%</div>
                            <div className="text-sm text-gray-600">Placement Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <Globe className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-black text-gray-900">3+</div>
                            <div className="text-sm text-gray-600">Cloud Platforms</div>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                              <Star className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-black text-gray-900">4.9</div>
                            <div className="text-sm text-gray-600">Rating</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="bg-blue-100 text-blue-600 mb-4">What We Do</Badge>
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
                  Multi-Cloud & AI Training Excellence
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We specialize in training programs that combine theory, practice, and placement assistance, 
                  giving learners exposure to cutting-edge technologies
                </p>
              </div>

              {/* Specializations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {specializations.map((item, index) => (
                  <Card key={index} className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Exposure Areas */}
              <Card className="border-0 bg-gradient-to-r from-blue-600 to-green-600 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-12 text-center">
                  <h3 className="text-2xl font-bold text-white mb-8">Additional Exposure Areas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {exposureAreas.map((area, index) => (
                      <div key={index} className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
                        <CheckCircle className="h-8 w-8 text-green-300 mx-auto mb-4" />
                        <p className="text-white font-medium">{area}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose SITCLOUD Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="bg-blue-100 text-blue-600 mb-4">Why Choose Us</Badge>
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
                  Your Success is Our Priority
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {whyChooseUs.map((item, index) => (
                  <Card key={index} className="border-0 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="h-7 w-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Special Offer Highlight */}
              <Card className="mt-12 border-0 bg-gradient-to-r from-blue-600 to-green-600 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="p-12 text-center">
                  <div className="flex items-center justify-center mb-6">
                    <Star className="h-8 w-8 text-green-300 mr-2" />
                    <h3 className="text-3xl font-bold text-white">Special Offer</h3>
                    <Star className="h-8 w-8 text-green-300 ml-2" />
                  </div>
                  <p className="text-xl text-blue-100 mb-8">
                    Whether you are a student looking to launch a career or a professional aiming to upgrade your skills, 
                    SITCLOUD is your trusted partner in the journey to success.
                  </p>
                  <Link href="/courses">
                    <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold shadow-xl">
                      <Rocket className="mr-2 h-5 w-5" />
                      Get 25% OFF + Free Demo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Mission */}
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mb-8">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
                      Our Mission
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      To empower learners with cutting-edge skills in AI & Cloud, ensuring they are ready for the jobs 
                      of today and the innovations of tomorrow.
                    </p>
                    <div className="mt-8">
                      <div className="flex items-center text-blue-600 font-medium">
                        <ArrowRight className="h-5 w-5 mr-2" />
                        Future-Ready Skills
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Vision */}
                <Card className="border-0 bg-gradient-to-br from-green-50 to-blue-50 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-8">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
                      Our Vision
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      To be the go-to learning hub for Cloud & AI professionals in India and beyond, delivering training 
                      that combines knowledge, skills, and career outcomes.
                    </p>
                    <div className="mt-8">
                      <div className="flex items-center text-green-600 font-medium">
                        <ArrowRight className="h-5 w-5 mr-2" />
                        Excellence in Education
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-green-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Transform Your Career?
              </h2>
              <p className="text-xl text-blue-100 mb-12">
                Join thousands of professionals who have accelerated their careers with SITCLOUD
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/courses">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold shadow-xl">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore Courses
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold backdrop-blur-xl">
                    <Users className="mr-2 h-5 w-5" />
                    Schedule Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default AboutUs;
