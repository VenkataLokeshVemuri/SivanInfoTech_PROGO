
import { Cloud, Download, Clock, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import EnrollModal from './EnrollModal';

const CertificationTracks = () => {
  const isLoggedIn = localStorage.getItem('authToken');

  const awsTrack = [
    {
      id: "aws-cloud-practitioner",
      title: "AWS Cloud Practitioner",
      level: "Foundational",
      duration: "4 Weeks",
      originalPrice: "₹35,000",
      price: "₹25,000",
      description: "Perfect entry point to AWS cloud computing"
    },
    {
      id: "aws-solutions-architect",
      title: "Solutions Architect Associate",
      level: "Associate", 
      duration: "8 Weeks",
      originalPrice: "₹65,000",
      price: "₹45,000",
      description: "Design resilient AWS architectures",
      popular: true
    },
    {
      title: "Developer Associate",
      level: "Associate",
      duration: "8 Weeks", 
      originalPrice: "₹60,000",
      price: "₹42,000",
      description: "Build and deploy AWS applications"
    },
    {
      title: "Solutions Architect Professional",
      level: "Professional",
      duration: "12 Weeks",
      originalPrice: "₹85,000", 
      price: "₹65,000",
      description: "Advanced AWS architecture solutions"
    }
  ];

  const azureTrack = [
    {
      title: "Azure Fundamentals (AZ-900)",
      level: "Fundamentals",
      duration: "3 Weeks",
      originalPrice: "₹30,000",
      price: "₹20,000", 
      description: "Foundation of Microsoft Azure"
    },
    {
      title: "Azure Administrator (AZ-104)",
      level: "Associate",
      duration: "8 Weeks",
      originalPrice: "₹55,000",
      price: "₹40,000",
      description: "Manage Azure resources and services",
      popular: true
    },
    {
      title: "Azure Developer (AZ-204)",
      level: "Associate", 
      duration: "8 Weeks",
      originalPrice: "₹58,000",
      price: "₹42,000",
      description: "Develop Azure cloud solutions"
    },
    {
      title: "Azure Solutions Architect (AZ-305)",
      level: "Expert",
      duration: "12 Weeks",
      originalPrice: "₹80,000",
      price: "₹60,000",
      description: "Design Microsoft Azure solutions"
    }
  ];

  const gcpTrack = [
    {
      title: "Cloud Digital Leader",
      level: "Foundational", 
      duration: "3 Weeks",
      originalPrice: "₹32,000",
      price: "₹22,000",
      description: "Digital transformation with Google Cloud"
    },
    {
      title: "Associate Cloud Engineer",
      level: "Associate",
      duration: "6 Weeks",
      originalPrice: "₹52,000", 
      price: "₹38,000",
      description: "Deploy and manage GCP solutions",
      popular: true
    },
    {
      title: "Professional Cloud Architect",
      level: "Professional",
      duration: "10 Weeks",
      originalPrice: "₹75,000",
      price: "₹55,000",
      description: "Design Google Cloud architectures"
    },
    {
      title: "Professional DevOps Engineer", 
      level: "Professional",
      duration: "10 Weeks",
      originalPrice: "₹78,000",
      price: "₹58,000",
      description: "Build GCP delivery pipelines"
    }
  ];

  const renderTrackCards = (track: any[], provider: string) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {track.map((course, index) => (
        <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${course.popular ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-200'}`}>
          {course.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              Most Popular
            </div>
          )}
          
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-4">
              <Badge className={`${
                course.level === 'Foundational' || course.level === 'Fundamentals' ? 'bg-green-100 text-green-800' :
                course.level === 'Associate' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {course.level}
              </Badge>
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration}
              </div>
            </div>
            
            <CardTitle className="text-xl font-bold text-gray-900 mb-2">
              {course.title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {course.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Pricing */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-gray-900">{course.price}</span>
              <span className="text-lg text-gray-400 line-through">{course.originalPrice}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                Save {Math.round(((parseInt(course.originalPrice.replace('₹', '').replace(',', '')) - parseInt(course.price.replace('₹', '').replace(',', ''))) / parseInt(course.originalPrice.replace('₹', '').replace(',', ''))) * 100)}%
              </span>
            </div>
            
            <div className="space-y-2">
              <EnrollModal 
                courseId={course.id} 
                courseName={course.title} 
                coursePrice={parseInt(course.price.replace('₹', '').replace(',', ''))}
              >
                <Button className={`w-full ${course.popular ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold py-3`}>
                  Enroll Now
                </Button>
              </EnrollModal>
              <Button 
                variant="outline" 
                className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                disabled={!isLoggedIn}
              >
                <Download className="h-4 w-4 mr-2" />
                {isLoggedIn ? 'Download Syllabus' : 'Login Required for Syllabus'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section id="certification-tracks" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              <Cloud className="mr-2 h-4 w-4" />
              Cloud Certification Tracks
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Master All Three Cloud Platforms
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your certification path from AWS, Azure, or Google Cloud. All tracks include hands-on labs, projects, and placement support.
            </p>
          </div>

          {/* Cloud Provider Logos */}
          <div className="flex justify-center items-center space-x-8 mb-12">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" alt="AWS" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" alt="Azure" className="h-8" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" alt="GCP" className="h-8" />
          </div>

          {/* Certification Tracks */}
          <Tabs defaultValue="aws" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="aws" className="flex items-center space-x-2">
                <span>AWS Track</span>
              </TabsTrigger>
              <TabsTrigger value="azure" className="flex items-center space-x-2">
                <span>Azure Track</span>
              </TabsTrigger>
              <TabsTrigger value="gcp" className="flex items-center space-x-2">
                <span>GCP Track</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="aws">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AWS Certification Track</h3>
                <p className="text-gray-600">From foundational to professional AWS certifications</p>
              </div>
              {renderTrackCards(awsTrack, 'AWS')}
            </TabsContent>

            <TabsContent value="azure">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Microsoft Azure Certification Track</h3>
                <p className="text-gray-600">Complete Azure certification pathway</p>
              </div>
              {renderTrackCards(azureTrack, 'Azure')}
            </TabsContent>

            <TabsContent value="gcp">
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Google Cloud Certification Track</h3>
                <p className="text-gray-600">Professional GCP certification journey</p>
              </div>
              {renderTrackCards(gcpTrack, 'GCP')}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default CertificationTracks;
