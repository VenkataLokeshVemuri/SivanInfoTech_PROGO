"use client";
// Migrated from src/pages/WhyUs.tsx
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Users, Award, TrendingUp, Monitor, MessageSquare, FileCheck, UserCheck, Briefcase } from "lucide-react";
import Link from 'next/link';

const WhyUs = () => {
  const features = [
    {
      icon: Users,
      title: "Experienced IT Professional Trainers",
      description: "Learn from seasoned industry experts with real-world experience who bring practical insights to every session.",
      highlight: "Industry Veterans"
    },
    {
      icon: Users,
      title: "Customized Batches",
      description: "Enjoy personalized attention with tailored batch sizes designed to meet individual learning needs and schedules.",
      highlight: "Flexible Learning"
    },
    {
      icon: Monitor,
      title: "Real-Time Working Experience",
      description: "Gain hands-on experience through live projects and real-world scenarios that prepare you for industry challenges.",
      highlight: "Practical Training"
    },
    {
      icon: Award,
      title: "18 Years Experienced Leader",
      description: "Benefit from the expertise of our institution's leadership with nearly two decades of industry experience.",
      highlight: "Proven Leadership"
    },
    {
      icon: TrendingUp,
      title: "High Placement Ratio",
      description: "Join our successful alumni network with an outstanding track record of student placements in top companies.",
      highlight: "95% Success Rate"
    },
    {
      icon: Monitor,
      title: "Own In-House Products",
      description: "Access our proprietary learning platforms for both online and offline education, designed specifically for our curriculum.",
      highlight: "Exclusive Resources"
    },
    {
      icon: MessageSquare,
      title: "Weekly Discussions",
      description: "Participate in interactive learning sessions with regular group discussions that enhance understanding and networking.",
      highlight: "Interactive Learning"
    },
    {
      icon: FileCheck,
      title: "Web-Based Quizzes",
      description: "Validate your understanding through comprehensive online assessments and get instant feedback on your progress.",
      highlight: "Continuous Assessment"
    },
    {
      icon: UserCheck,
      title: "Internship Certification",
      description: "Receive official certification for your internship experience, adding valuable credentials to your professional profile.",
      highlight: "Certified Experience"
    },
    {
      icon: Briefcase,
      title: "Placement Assistance",
      description: "Get comprehensive support in securing employment post-completion with our dedicated placement cell and industry connections.",
      highlight: "Career Support"
    }
  ];

  const stats = [
    { number: "1000+", label: "Students Trained" },
    { number: "95%", label: "Placement Rate" },
    { number: "18+", label: "Years Experience" },
    { number: "50+", label: "Industry Partners" }
  ];

  return (
    <>
      <SEOHead 
        title="Why Choose Sivan InfoTech - Leading IT Training Institute"
        description="Discover why Sivan InfoTech is the preferred choice for IT training. Experienced trainers, customized batches, real-time experience, and 95% placement rate."
        keywords="IT training institute, placement assistance, experienced trainers, customized batches, Chennai training"
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary via-primary/90 to-primary/80">
          <div className="container mx-auto px-4">
            <div className="text-center text-white max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4 text-primary bg-white">
                Why Choose Us
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Your Success is Our
                <span className="text-secondary"> Priority</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Discover what makes Sivan InfoTech the leading choice for IT education and career transformation
              </p>
              <div className="flex flex-wrap justify-center gap-6 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-secondary">{stat.number}</div>
                    <div className="text-white/90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Features Grid */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Unique <span className="text-primary">Value Proposition</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Experience the difference with our comprehensive approach to IT education
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {feature.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* Quick Links Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Explore More</h2>
              <p className="text-xl text-muted-foreground">
                Learn more about our offerings and facilities
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Experienced Faculty</h3>
                  <p className="text-muted-foreground mb-4">
                    Meet our expert trainers with years of industry experience
                  </p>
                  <Button variant="outline" size="sm">
                    View Faculty Profiles
                  </Button>
                </div>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <Monitor className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Modern Facilities</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore our state-of-the-art training centers and labs
                  </p>
                  <Button variant="outline" size="sm">
                    Campus Tour
                  </Button>
                </div>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-all duration-300">
                <div className="mb-4">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Diverse Courses</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse our comprehensive range of IT training programs
                  </p>
                  <Link href="/courses">
                    <Button variant="outline" size="sm">
                      View All Courses
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of successful professionals who chose Sivan InfoTech for their IT education journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="text-primary">
                  Enroll Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WhyUs;
