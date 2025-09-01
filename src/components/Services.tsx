
import { Cloud, GraduationCap, Users, BookOpen, Star, Clock, Award, Target, CheckCircle, Calendar, Video, FileText, Download, Shield, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import CloudProviderLogos from './CloudProviderLogos';

const Services = () => {
  const awsCertifications = [
    {
      level: 'Beginner',
      title: 'AWS Certified Cloud Practitioner',
      code: 'CLF-C01',
      duration: '4 Weeks',
      price: '₹25,000',
      originalPrice: '₹35,000',
      description: 'Foundation-level certification for cloud understanding',
      highlights: ['AWS Core Services', 'Cloud Concepts', 'Billing & Pricing', 'Security Basics']
    },
    {
      level: 'Associate', 
      title: 'AWS Solutions Architect Associate',
      code: 'SAA-C03',
      duration: '8 Weeks',
      price: '₹45,000',
      originalPrice: '₹65,000',
      description: 'Design resilient and scalable AWS architectures',
      highlights: ['Architecture Design', 'High Availability', 'Cost Optimization', 'Security Implementation'],
      popular: true
    },
    {
      level: 'Associate',
      title: 'AWS Developer Associate', 
      code: 'DVA-C02',
      duration: '8 Weeks',
      price: '₹42,000',
      originalPrice: '₹60,000',
      description: 'Develop and maintain applications on AWS',
      highlights: ['API Gateway', 'Lambda Functions', 'DynamoDB', 'Code Deployment']
    },
    {
      level: 'Professional',
      title: 'AWS Solutions Architect Professional',
      code: 'SAP-C02', 
      duration: '12 Weeks',
      price: '₹65,000',
      originalPrice: '₹85,000',
      description: 'Advanced architectural solutions for complex requirements',
      highlights: ['Multi-Account Strategy', 'Hybrid Architectures', 'Cost Optimization', 'Migration Strategies']
    }
  ];

  const azureCertifications = [
    {
      level: 'Fundamentals',
      title: 'Azure Fundamentals',
      code: 'AZ-900',
      duration: '3 Weeks', 
      price: '₹20,000',
      originalPrice: '₹30,000',
      description: 'Foundation knowledge of Azure cloud services',
      highlights: ['Azure Core Services', 'Azure Pricing', 'Security & Compliance', 'Azure Management']
    },
    {
      level: 'Associate',
      title: 'Azure Administrator',
      code: 'AZ-104',
      duration: '8 Weeks',
      price: '₹40,000', 
      originalPrice: '₹55,000',
      description: 'Manage Azure subscriptions and resources',
      highlights: ['Virtual Networks', 'Storage Management', 'Identity Management', 'Monitoring'],
      popular: true
    },
    {
      level: 'Associate', 
      title: 'Azure Developer',
      code: 'AZ-204',
      duration: '8 Weeks',
      price: '₹42,000',
      originalPrice: '₹58,000', 
      description: 'Develop solutions for Microsoft Azure',
      highlights: ['Azure App Services', 'Functions & Logic Apps', 'Storage Solutions', 'Security Implementation']
    },
    {
      level: 'Expert',
      title: 'Azure Solutions Architect',
      code: 'AZ-305',
      duration: '12 Weeks',
      price: '₹60,000',
      originalPrice: '₹80,000',
      description: 'Design solutions that run on Microsoft Azure',
      highlights: ['Solution Design', 'Infrastructure Solutions', 'Business Continuity', 'Security Design']
    }
  ];

  const gcpCertifications = [
    {
      level: 'Foundational',
      title: 'Cloud Digital Leader',
      code: 'CDL',
      duration: '3 Weeks',
      price: '₹22,000',
      originalPrice: '₹32,000', 
      description: 'Digital transformation with Google Cloud',
      highlights: ['Cloud Concepts', 'Google Cloud Products', 'Digital Transformation', 'Data & AI']
    },
    {
      level: 'Associate',
      title: 'Associate Cloud Engineer', 
      code: 'ACE',
      duration: '6 Weeks',
      price: '₹38,000',
      originalPrice: '₹52,000',
      description: 'Deploy applications and monitor operations on Google Cloud',
      highlights: ['Compute Engine', 'Kubernetes Engine', 'Cloud Storage', 'Identity & Access'],
      popular: true
    },
    {
      level: 'Professional',
      title: 'Professional Cloud Architect',
      code: 'PCA',
      duration: '10 Weeks', 
      price: '₹55,000',
      originalPrice: '₹75,000',
      description: 'Design, develop, and manage dynamic solutions',
      highlights: ['Solution Design', 'Security Design', 'Compliance', 'Cost Optimization']
    },
    {
      level: 'Professional',
      title: 'Professional DevOps Engineer',
      code: 'PDE',
      duration: '10 Weeks',
      price: '₹58,000',
      originalPrice: '₹78,000',
      description: 'Build software delivery pipelines', 
      highlights: ['CI/CD Pipelines', 'Infrastructure as Code', 'Monitoring', 'Incident Response']
    }
  ];

  const features = [
    { icon: Video, title: 'Live Interactive Classes', desc: 'Real-time doubt clearing' },
    { icon: FileText, title: 'Study Materials', desc: 'Comprehensive guides' },
    { icon: Users, title: 'Expert Mentors', desc: 'Industry professionals' },
    { icon: Award, title: 'Certifications', desc: 'Industry recognized' },
    { icon: Download, title: 'Syllabus Access', desc: 'Login to download' },
    { icon: Briefcase, title: 'Placement Support', desc: '100% assistance' }
  ];

  const renderCertificationCards = (certifications) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {certifications.map((cert, index) => (
        <Card key={index} className={`relative bg-white hover:shadow-xl transition-all duration-300 border ${cert.popular ? 'border-orange-300 ring-2 ring-orange-100 scale-105' : 'border-gray-200'}`}>
          {cert.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              Most Popular
            </div>
          )}
          
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <Badge className={`${
                cert.level === 'Beginner' || cert.level === 'Fundamentals' || cert.level === 'Foundational' ? 'bg-green-100 text-green-800' :
                cert.level === 'Associate' ? 'bg-blue-100 text-blue-800' :
                cert.level === 'Professional' || cert.level === 'Expert' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {cert.level}
              </Badge>
              <span className="text-sm text-gray-500">{cert.code}</span>
            </div>
            
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              {cert.title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm leading-relaxed">
              {cert.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Highlights */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Key Topics:</h4>
              <div className="grid grid-cols-2 gap-2">
                {cert.highlights.map((highlight, idx) => (
                  <div key={idx} className="text-sm text-gray-600 flex items-start">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Course Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-sm mb-2">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Duration: {cert.duration}
                </div>
                <div className="flex items-center text-gray-600">
                  <Download className="h-4 w-4 mr-2" />
                  Syllabus Available
                </div>
              </div>
            </div>
            
            {/* Pricing */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">{cert.price}</span>
                <span className="text-lg text-gray-400 line-through">{cert.originalPrice}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                  Save {Math.round(((parseInt(cert.originalPrice.replace('₹', '').replace(',', '')) - parseInt(cert.price.replace('₹', '').replace(',', ''))) / parseInt(cert.originalPrice.replace('₹', '').replace(',', ''))) * 100)}%
                </span>
              </div>
              
              <div className="space-y-2">
                <Button className={`w-full ${cert.popular ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3`}>
                  Enroll in Certification
                </Button>
                <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                  <Download className="h-4 w-4 mr-2" />
                  Download Syllabus (Login Required)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              <GraduationCap className="mr-2 h-4 w-4" />
              Comprehensive Cloud Certification Bootcamps
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Multi-Cloud Certification Programs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Master AWS, Azure, and Google Cloud with our industry-designed certification bootcamps. Get hands-on training, downloadable syllabi, and guaranteed placement assistance.
            </p>
            
            {/* Features Strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 bg-white p-3 rounded-lg shadow-sm">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{feature.title}</div>
                    <div className="text-xs text-gray-500">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Provider Logos */}
          <CloudProviderLogos />

          {/* Certification Tracks */}
          <Tabs defaultValue="aws" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="aws" className="flex items-center space-x-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="w-6 h-6" />
                <span>AWS Certifications</span>
              </TabsTrigger>
              <TabsTrigger value="azure" className="flex items-center space-x-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" alt="Azure" className="w-6 h-6" />
                <span>Azure Certifications</span>
              </TabsTrigger>
              <TabsTrigger value="gcp" className="flex items-center space-x-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" alt="GCP" className="w-6 h-6" />
                <span>GCP Certifications</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="aws">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AWS Certification Track</h3>
                <p className="text-gray-600">From foundational to professional level AWS certifications</p>
              </div>
              {renderCertificationCards(awsCertifications)}
            </TabsContent>

            <TabsContent value="azure">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Microsoft Azure Certification Track</h3>
                <p className="text-gray-600">Comprehensive Azure certification pathway from fundamentals to expert</p>
              </div>
              {renderCertificationCards(azureCertifications)}
            </TabsContent>

            <TabsContent value="gcp">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Google Cloud Certification Track</h3>
                <p className="text-gray-600">Complete GCP certification journey from foundational to professional</p>
              </div>
              {renderCertificationCards(gcpCertifications)}
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Not Sure Which Certification to Choose?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get personalized certification recommendations based on your background and career goals. 
              Our experts will guide you to the right cloud certification path.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                📞 Call: +91 9876543210
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                💬 Free Career Counseling
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                📋 Download All Syllabi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
