
import { Cloud, Download, Clock, Award, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import EnrollModal from './EnrollModal';

// Custom Cloud Platform Icons
const AwsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.33 12.33C7.33 13.43 7.44 14.34 7.64 14.92C7.86 15.5 8.16 15.93 8.54 16.22C8.61 16.29 8.63 16.36 8.63 16.44C8.63 16.55 8.56 16.66 8.42 16.77L7.72 17.24C7.63 17.31 7.53 17.35 7.44 17.35C7.33 17.35 7.23 17.3 7.13 17.21C6.63 16.73 6.24 16.11 5.95 15.34C5.67 14.58 5.53 13.67 5.53 12.62C5.53 10.57 6.3 9.06 7.86 8.09C7.97 8.02 8.08 7.98 8.17 7.98C8.29 7.98 8.4 8.03 8.49 8.13L9.21 8.76C9.34 8.88 9.4 8.99 9.4 9.09C9.4 9.18 9.35 9.27 9.26 9.34C8.94 9.57 8.68 9.89 8.49 10.29C8.3 10.7 8.16 11.18 8.08 11.73C7.92 11.93 7.33 12.05 7.33 12.33Z" fill="#FF9900"/>
    <path d="M11.37 15.33C11.37 15.44 11.32 15.5 11.24 15.5C11.18 15.5 11.1 15.5 11 15.48C10.53 15.37 10.12 15.2 9.77 14.96C9.41 14.73 9.24 14.46 9.24 14.15C9.24 14 9.3 13.85 9.43 13.73L9.73 13.45C9.82 13.36 9.92 13.31 10.02 13.31C10.13 13.31 10.22 13.35 10.3 13.44C10.44 13.59 10.6 13.73 10.79 13.85C10.97 13.98 11.18 14.09 11.41 14.18C11.45 14.19 11.49 14.22 11.52 14.25C11.55 14.29 11.57 14.34 11.57 14.4C11.57 14.51 11.5 14.69 11.37 14.93V15.33H11.37Z" fill="#FF9900"/>
    <path d="M13.98 15.51C13.9 15.51 13.82 15.48 13.75 15.44C13.68 15.39 13.6 15.31 13.52 15.19L11.63 12.55C11.61 12.51 11.6 12.48 11.6 12.44C11.6 12.36 11.67 12.3 11.79 12.25L12.58 11.96C12.67 11.93 12.75 11.91 12.82 11.91C12.93 11.91 13.01 11.96 13.07 12.05L14.5 14.07C14.54 14.12 14.58 14.16 14.61 14.16C14.64 14.16 14.67 14.14 14.69 14.09L16.09 11.97C16.15 11.86 16.25 11.81 16.38 11.81C16.44 11.81 16.52 11.82 16.63 11.85L17.35 12.04C17.48 12.08 17.54 12.14 17.54 12.23C17.54 12.27 17.52 12.32 17.49 12.36L15.19 15.29C15.12 15.38 15.04 15.44 14.96 15.49C14.88 15.53 14.8 15.55 14.72 15.55C14.58 15.55 14.47 15.5 14.38 15.41L14 14.91C13.96 14.86 13.91 14.83 13.87 14.83C13.83 14.83 13.79 14.85 13.75 14.89L13.41 15.35C13.33 15.46 13.17 15.51 12.98 15.51H13.98Z" fill="#FF9900"/>
    <path d="M18.02 15.48C17.88 15.5 17.76 15.51 17.65 15.51H17.45C17.33 15.51 17.22 15.45 17.14 15.32C17.06 15.19 17.02 15.04 17.02 14.85V11.27C17.02 11.08 17.07 10.93 17.18 10.81C17.29 10.69 17.43 10.63 17.61 10.63H18.05C18.17 10.63 18.28 10.64 18.37 10.67C18.46 10.7 18.54 10.77 18.62 10.88L19.08 11.55C19.12 11.6 19.16 11.62 19.19 11.62C19.22 11.62 19.26 11.59 19.3 11.54L19.72 10.92C19.79 10.82 19.86 10.75 19.94 10.71C20.02 10.67 20.14 10.64 20.28 10.64H20.75C20.94 10.64 21.09 10.7 21.2 10.82C21.31 10.94 21.36 11.09 21.36 11.28V14.86C21.36 15.05 21.32 15.2 21.23 15.32C21.14 15.44 21.02 15.5 20.86 15.5H20.36C20.21 15.5 20.09 15.45 20 15.34C19.9 15.23 19.86 15.09 19.86 14.92V12.41C19.86 12.37 19.85 12.33 19.82 12.3C19.79 12.27 19.76 12.26 19.72 12.26C19.67 12.26 19.63 12.28 19.58 12.32L18.84 13.02V14.87C18.84 15.06 18.8 15.21 18.71 15.33C18.62 15.45 18.49 15.5 18.33 15.5H18.22C18.18 15.5 18.1 15.49 18.02 15.48Z" fill="#FF9900"/>
    <path d="M13.72 18.53C11.88 19.89 9.25 20.57 6.96 20.57C3.77 20.57 0.9 19.39 -1.33 17.36C-1.52 17.2 -1.33 16.97 -1.11 17.09C1.38 18.53 4.44 19.41 7.63 19.41C9.8 19.41 12.17 18.96 14.35 18.03C14.71 17.88 15.01 18.29 14.72 18.53H13.72Z" fill="#FF9900"/>
    <path d="M14.49 17.64C14.23 17.32 13.11 17.46 12.62 17.53C12.43 17.56 12.4 17.39 12.57 17.27C13.46 16.66 14.91 16.84 15.13 17.09C15.35 17.35 15.08 18.97 14.25 19.66C14.1 19.79 13.94 19.72 14.01 19.55C14.23 19.06 14.75 17.95 14.49 17.64Z" fill="#FF9900"/>
  </svg>
);

const AzureIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5068 5.66211L8.20433 11.1114L4.79199 16.8792H12.2232L12.5068 5.66211Z" fill="#0072C6"/>
    <path d="M12.5068 5.66211L12.2232 16.8792H19.208L12.5068 5.66211Z" fill="#0072C6"/>
    <path d="M16.6205 8.10742L8.30591 9.07367L4.79199 16.8791L16.6205 8.10742Z" fill="#0072C6"/>
  </svg>
);

const GCPIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.36014 13.7696L4.27014 10.6796L4.25014 10.6896H4.24014L7.36014 7.56957V7.55957L10.4601 10.6596L7.36014 13.7696Z" fill="#EA4335"/>
    <path d="M16.4699 13.7696L13.3799 10.6796L13.3699 10.6896H13.3599L16.4799 7.56957V7.55957L19.5799 10.6596L16.4699 13.7696Z" fill="#FBBC05"/>
    <path d="M11.9199 18.3095L8.82991 15.2195L8.81991 15.2295H8.80991L11.9299 12.1095V12.0995L15.0299 15.2095L11.9199 18.3095Z" fill="#4285F4"/>
    <path d="M11.9199 9.22957L8.82991 6.13957L8.81991 6.14957H8.80991L11.9299 3.02957V3.01957L15.0299 6.12957L11.9199 9.22957Z" fill="#34A853"/>
  </svg>
);

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
        <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 overflow-hidden ${course.popular ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
          {/* Top colored bar for popular courses */}
          {course.popular && (
            <>
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                Most Popular
              </div>
            </>
          )}
          
          <CardHeader className="pb-4 pt-7">
            <div className="flex items-center justify-between mb-4">
              <Badge className={`px-3 py-1 font-medium ${
                course.level === 'Foundational' || course.level === 'Fundamentals' ? 'bg-green-100 text-green-700 border border-green-200' :
                course.level === 'Associate' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                'bg-purple-100 text-purple-700 border border-purple-200'
              }`}>
                {course.level}
              </Badge>
              <div className="flex items-center text-gray-600 text-sm bg-gray-50 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 mr-2 text-gray-500" strokeWidth={2} />
                {course.duration}
              </div>
            </div>
            
            <CardTitle className="text-xl font-bold text-gray-900 mb-3">
              {course.title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              {course.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Pricing */}
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
              <span className="text-2xl font-bold text-gray-900">{course.price}</span>
              <span className="text-lg text-gray-400 line-through">{course.originalPrice}</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                Save {Math.round(((parseInt(course.originalPrice.replace('₹', '').replace(',', '')) - parseInt(course.price.replace('₹', '').replace(',', ''))) / parseInt(course.originalPrice.replace('₹', '').replace(',', ''))) * 100)}%
              </span>
            </div>
            
            <div className="space-y-3 pt-2">
              <EnrollModal 
                courseId={course.id} 
                courseName={course.title} 
                coursePrice={parseInt(course.price.replace('₹', '').replace(',', ''))}
              >
                <Button className={`w-full ${course.popular ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-colors duration-300`}>
                  Enroll Now
                </Button>
              </EnrollModal>
              <Button 
                variant="outline" 
                className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 py-5 rounded-xl transition-colors duration-300"
                disabled={!isLoggedIn}
              >
                <Download className="h-4 w-4 mr-2" strokeWidth={2} />
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
          <div className="flex justify-center items-center space-x-12 mb-12">
            <img src="/logos/aws.svg" alt="AWS" className="h-10" />
            <img src="/logos/azure.svg" alt="Azure" className="h-10" />
            <img src="/logos/google-cloud.svg" alt="GCP" className="h-10" />
          </div>

          {/* Certification Tracks */}
          <Tabs defaultValue="aws" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto p-1">
              <TabsTrigger value="aws" className="flex items-center gap-2 py-3">
                <AwsIcon />
                <span>AWS Track</span>
              </TabsTrigger>
              <TabsTrigger value="azure" className="flex items-center gap-2 py-3">
                <AzureIcon />
                <span>Azure Track</span>
              </TabsTrigger>
              <TabsTrigger value="gcp" className="flex items-center gap-2 py-3">
                <GCPIcon />
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
