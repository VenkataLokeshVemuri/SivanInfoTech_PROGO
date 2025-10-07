'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentModal from '@/components/PaymentModal';
import { backendAPI } from '@/lib/backend-api';
import { 
  Clock, 
  Users, 
  Award, 
  CheckCircle, 
  PlayCircle, 
  Calendar, 
  MapPin, 
  Star,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  students: string;
  level: string;
  price: number;
  originalPrice: number;
  instructor: {
    name: string;
    experience: string;
    rating: number;
    bio: string;
    image: string;
  };
  curriculum: {
    module: string;
    topics: string[];
    duration: string;
  }[];
  features: string[];
  prerequisites: string[];
  certification: string;
  nextBatch: {
    startDate: string;
    schedule: string;
    mode: string;
    seats: number;
  };
  highlights: string[];
  image: string;
}

const CourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const courseId = params.courseId as string;
      
      try {
        // Try to fetch from API first
        const response = await backendAPI.getCourseDetails(courseId);
        
        if (response.success && response.data) {
          setCourseDetails(response.data);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log('API fetch failed, using mock data:', error);
      }
      
      // Fallback to mock data
      const mockCourseDetails: Record<string, CourseDetails> = {
      'aws-fundamentals': {
        id: 'aws-fundamentals',
        title: 'AWS Cloud Computing Fundamentals',
        description: 'Master the fundamentals of Amazon Web Services (AWS) cloud computing platform',
        longDescription: 'This comprehensive AWS course covers all essential services and concepts needed to start your cloud journey. You\'ll learn about EC2, S3, RDS, Lambda, and more while gaining hands-on experience through practical labs and real-world projects.',
        duration: '6 weeks',
        students: '500+',
        level: 'Beginner',
        price: 15000,
        originalPrice: 20000,
        instructor: {
          name: 'Rajesh Kumar',
          experience: '8+ years in AWS',
          rating: 4.8,
          bio: 'AWS Certified Solutions Architect with extensive experience in cloud migrations and architecture design.',
          image: '/placeholder.svg'
        },
        curriculum: [
          {
            module: 'Introduction to AWS',
            topics: ['Cloud Computing Basics', 'AWS Global Infrastructure', 'IAM & Security', 'AWS Management Console'],
            duration: '1 week'
          },
          {
            module: 'Core Services',
            topics: ['EC2 Instances', 'S3 Storage', 'VPC Networking', 'RDS Databases'],
            duration: '2 weeks'
          },
          {
            module: 'Advanced Services',
            topics: ['Lambda Functions', 'CloudFormation', 'Auto Scaling', 'Load Balancers'],
            duration: '2 weeks'
          },
          {
            module: 'Project Work',
            topics: ['Deploy Web Application', 'Set up CI/CD Pipeline', 'Monitoring Setup', 'Cost Analysis'],
            duration: '1 week'
          }
        ],
        features: [
          'Hands-on Labs',
          'Real-world Projects',
          'AWS Free Tier Access',
          'Industry Mentorship',
          'Job Placement Support',
          '24/7 Support'
        ],
        prerequisites: [
          'Basic Computer Knowledge',
          'Understanding of Internet Concepts',
          'No prior cloud experience required'
        ],
        certification: 'AWS Certified Cloud Practitioner Preparation',
        nextBatch: {
          startDate: '2024-02-15',
          schedule: 'Mon, Wed, Fri - 7:00 PM to 9:00 PM',
          mode: 'Hybrid (Online + Lab Sessions)',
          seats: 25
        },
        highlights: [
          'Industry-recognized certification preparation',
          'Real AWS environment practice',
          'Job placement assistance',
          'Lifetime course access'
        ],
        image: '/placeholder.svg'
      },
      'azure-cloud-computing': {
        id: 'azure-cloud-computing',
        title: 'Microsoft Azure Cloud Computing',
        description: 'Complete Azure cloud platform training with hands-on labs and certification preparation',
        longDescription: 'Dive deep into Microsoft Azure cloud platform with comprehensive training covering all major services. This course prepares you for Azure certifications while providing practical experience through hands-on labs and real-world scenarios.',
        duration: '8 weeks',
        students: '400+',
        level: 'Intermediate',
        price: 18000,
        originalPrice: 25000,
        instructor: {
          name: 'Priya Sharma',
          experience: '10+ years in Microsoft Technologies',
          rating: 4.9,
          bio: 'Microsoft Certified Azure Solutions Architect Expert with deep expertise in enterprise cloud solutions.',
          image: '/placeholder.svg'
        },
        curriculum: [
          {
            module: 'Azure Fundamentals',
            topics: ['Azure Portal', 'Resource Groups', 'Subscriptions', 'Azure Active Directory'],
            duration: '2 weeks'
          },
          {
            module: 'Compute Services',
            topics: ['Virtual Machines', 'App Services', 'Container Instances', 'Azure Functions'],
            duration: '2 weeks'
          },
          {
            module: 'Storage & Databases',
            topics: ['Blob Storage', 'SQL Database', 'Cosmos DB', 'Data Factory'],
            duration: '2 weeks'
          },
          {
            module: 'Capstone Project',
            topics: ['End-to-end Solution', 'Architecture Design', 'Implementation', 'Presentation'],
            duration: '2 weeks'
          }
        ],
        features: [
          'Azure Free Credits',
          'Live Lab Environment',
          'Industry Projects',
          'Microsoft Certification Voucher',
          'Career Guidance',
          'Alumni Network'
        ],
        prerequisites: [
          'Basic Programming Knowledge',
          'Understanding of Networking Concepts',
          'Familiarity with Windows/Linux'
        ],
        certification: 'Azure Fundamentals (AZ-900) Preparation',
        nextBatch: {
          startDate: '2024-02-20',
          schedule: 'Tue, Thu, Sat - 6:30 PM to 8:30 PM',
          mode: 'Online with Lab Access',
          seats: 20
        },
        highlights: [
          'Microsoft certification preparation',
          'Enterprise-grade lab environment',
          'Direct industry connections',
          'Post-course mentorship'
        ],
        image: '/placeholder.svg'
      },
      'google-cloud-platform': {
        id: 'google-cloud-platform',
        title: 'Google Cloud Platform (GCP) Essentials',
        description: 'Comprehensive GCP training covering all major services and best practices',
        longDescription: 'Master Google Cloud Platform with our comprehensive training program. Learn about Compute Engine, Cloud Storage, BigQuery, Kubernetes Engine, and more. This course is designed for both beginners and professionals looking to advance their GCP skills.',
        duration: '6 weeks',
        students: '300+',
        level: 'Beginner',
        price: 16000,
        originalPrice: 22000,
        instructor: {
          name: 'Arjun Patel',
          experience: '12+ years in Cloud Architecture',
          rating: 4.7,
          bio: 'Google Cloud Certified Professional Cloud Architect with extensive experience in large-scale implementations.',
          image: '/placeholder.svg'
        },
        curriculum: [
          {
            module: 'GCP Foundations',
            topics: ['GCP Console', 'Projects & Billing', 'IAM & Security', 'Cloud Shell'],
            duration: '2 weeks'
          },
          {
            module: 'Compute & Storage',
            topics: ['Compute Engine', 'Cloud Storage', 'Cloud SQL', 'Bigtable'],
            duration: '2 weeks'
          },
          {
            module: 'Container & Kubernetes',
            topics: ['Container Registry', 'Kubernetes Engine', 'Cloud Run', 'Anthos'],
            duration: '1 week'
          },
          {
            module: 'Final Project',
            topics: ['Full-stack Application', 'CI/CD Pipeline', 'Monitoring', 'Optimization'],
            duration: '1 week'
          }
        ],
        features: [
          'GCP Credits Included',
          'Kubernetes Certification Prep',
          'Industry Case Studies',
          'Google Cloud Certification Support',
          'Community Access',
          'Project Portfolio'
        ],
        prerequisites: [
          'Basic Computer Knowledge',
          'Understanding of Internet Concepts',
          'No prior cloud experience required'
        ],
        certification: 'Google Cloud Associate Cloud Engineer Preparation',
        nextBatch: {
          startDate: '2024-03-01',
          schedule: 'Mon, Wed, Fri - 8:00 PM to 10:00 PM',
          mode: 'Online with Weekend Lab Sessions',
          seats: 15
        },
        highlights: [
          'Google Cloud certification preparation',
          'Hands-on Kubernetes training',
          'Real-world project experience',
          'Industry networking events'
        ],
        image: '/placeholder.svg'
      },
      'aws-solution-architect': {
        id: 'aws-solution-architect',
        title: 'AWS Solution Architect Associate',
        description: 'Advanced AWS architecture design and implementation',
        longDescription: 'Advance your AWS expertise with our comprehensive Solution Architect Associate course. Master complex architectural patterns, design resilient systems, and prepare for the industry-recognized AWS certification.',
        duration: '40 Days',
        students: '200+',
        level: 'Professional',
        price: 25000,
        originalPrice: 35000,
        instructor: {
          name: 'Vikram Singh',
          experience: '15+ years in Cloud Architecture',
          rating: 4.9,
          bio: 'AWS Certified Solutions Architect Professional with expertise in enterprise cloud transformations.',
          image: '/placeholder.svg'
        },
        curriculum: [
          {
            module: 'Advanced AWS Architecture',
            topics: ['Multi-tier Applications', 'Microservices', 'Event-driven Architecture', 'Serverless Patterns'],
            duration: '10 days'
          },
          {
            module: 'Security & Compliance',
            topics: ['Advanced IAM', 'Data Encryption', 'Network Security', 'Compliance Frameworks'],
            duration: '10 days'
          },
          {
            module: 'Performance & Cost Optimization',
            topics: ['Performance Tuning', 'Cost Management', 'Resource Optimization', 'Monitoring'],
            duration: '10 days'
          },
          {
            module: 'Exam Preparation',
            topics: ['Mock Exams', 'Case Studies', 'Best Practices', 'Certification Guidance'],
            duration: '10 days'
          }
        ],
        features: [
          'AWS Practice Exams',
          'Real Architecture Projects',
          'Industry Case Studies',
          'Certification Voucher',
          'Job Placement Support',
          'Professional Mentorship'
        ],
        prerequisites: [
          'AWS Fundamentals Knowledge',
          '1+ years AWS experience',
          'Understanding of Cloud Architecture'
        ],
        certification: 'AWS Certified Solutions Architect Associate',
        nextBatch: {
          startDate: '2024-02-25',
          schedule: 'Mon-Fri - 7:00 PM to 9:00 PM',
          mode: 'Instructor-led Online',
          seats: 18
        },
        highlights: [
          'Industry-leading certification',
          'Hands-on architecture projects',
          'Career advancement opportunities',
          'Expert instructor guidance'
        ],
        image: '/placeholder.svg'
      },
      'azure-administrator': {
        id: 'azure-administrator',
        title: 'Azure Administrator Associate',
        description: 'Comprehensive Azure administration and management',
        longDescription: 'Become an Azure Administrator with our intensive training program. Learn to manage Azure subscriptions, implement storage solutions, configure virtual networking, and manage identities.',
        duration: '40 Days',
        students: '180+',
        level: 'Professional',
        price: 24000,
        originalPrice: 32000,
        instructor: {
          name: 'Sneha Reddy',
          experience: '12+ years in Microsoft Technologies',
          rating: 4.8,
          bio: 'Microsoft Certified Azure Solutions Architect Expert specializing in enterprise Azure implementations.',
          image: '/placeholder.svg'
        },
        curriculum: [
          {
            module: 'Azure Administration Fundamentals',
            topics: ['Azure Portal Management', 'Resource Management', 'Azure CLI/PowerShell', 'Subscriptions'],
            duration: '10 days'
          },
          {
            module: 'Virtual Machines & Storage',
            topics: ['VM Management', 'Storage Accounts', 'Disk Management', 'Backup Solutions'],
            duration: '10 days'
          },
          {
            module: 'Networking & Security',
            topics: ['Virtual Networks', 'Load Balancers', 'Azure Firewall', 'Identity Management'],
            duration: '10 days'
          },
          {
            module: 'Monitoring & Certification Prep',
            topics: ['Azure Monitor', 'Log Analytics', 'Practice Exams', 'Exam Strategies'],
            duration: '10 days'
          }
        ],
        features: [
          'Microsoft Learning Paths',
          'Hands-on Lab Environment',
          'Real Azure Subscriptions',
          'Certification Exam Voucher',
          'Career Guidance',
          'Technical Support'
        ],
        prerequisites: [
          'Basic Azure Knowledge',
          'Windows/Linux Administration',
          'Networking Fundamentals'
        ],
        certification: 'Microsoft Certified: Azure Administrator Associate',
        nextBatch: {
          startDate: '2024-03-05',
          schedule: 'Mon-Fri - 6:00 PM to 8:00 PM',
          mode: 'Hybrid Learning',
          seats: 16
        },
        highlights: [
          'Microsoft official certification',
          'Enterprise lab environment',
          'Job placement assistance',
          'Industry connections'
        ],
        image: '/placeholder.svg'
      },
      'google-cloud-associate': {
        id: 'google-cloud-associate',
        title: 'Google Cloud Associate Cloud Engineer',
        description: 'Professional Google Cloud Platform certification track',
        longDescription: 'Prepare for the Google Cloud Associate Cloud Engineer certification with our comprehensive training program. Master GCP services, deployment patterns, and operational best practices.',
        duration: '40 Days',
        students: '150+',
        level: 'Professional',
        price: 23000,
        originalPrice: 30000,
        instructor: {
          name: 'Ravi Kumar',
          experience: '14+ years in Cloud Technologies',
          rating: 4.7,
          bio: 'Google Cloud Professional Cloud Architect with extensive experience in enterprise cloud migrations.',
          image: '/placeholder.svg'
        },
        curriculum: [
          {
            module: 'GCP Core Services',
            topics: ['Compute Engine', 'Cloud Storage', 'Cloud SQL', 'Networking'],
            duration: '10 days'
          },
          {
            module: 'Kubernetes & Containers',
            topics: ['GKE Management', 'Container Registry', 'Cloud Run', 'Service Mesh'],
            duration: '10 days'
          },
          {
            module: 'Operations & Security',
            topics: ['Monitoring', 'Logging', 'IAM', 'Security Best Practices'],
            duration: '10 days'
          },
          {
            module: 'Certification Preparation',
            topics: ['Practice Exams', 'Case Studies', 'Exam Strategies', 'Final Assessment'],
            duration: '10 days'
          }
        ],
        features: [
          'GCP Credits Included',
          'Kubernetes Hands-on',
          'Industry Projects',
          'Certification Voucher',
          'Career Support',
          'Alumni Network'
        ],
        prerequisites: [
          'Basic GCP Knowledge',
          'Linux/Unix Experience',
          'Container Concepts'
        ],
        certification: 'Google Cloud Associate Cloud Engineer',
        nextBatch: {
          startDate: '2024-03-10',
          schedule: 'Mon-Fri - 7:30 PM to 9:30 PM',
          mode: 'Online with Lab Sessions',
          seats: 14
        },
        highlights: [
          'Google Cloud certification',
          'Kubernetes specialization',
          'Real-world projects',
          'Industry recognition'
        ],
        image: '/placeholder.svg'
      }
    };

    // Get course details based on courseId
    const details = mockCourseDetails[courseId];
    
    if (details) {
      setCourseDetails(details);
    }
    setLoading(false);
  };

  fetchCourseDetails();
}, [params.courseId]);

  const handleEnrollment = () => {
    setShowPaymentModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <Button onClick={() => router.push('/courses')}>
              Back to Courses
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <Button 
            onClick={() => router.push('/courses')}
            variant="ghost" 
            className="mb-6 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{courseDetails.level}</Badge>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm">{courseDetails.instructor.rating}</span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {courseDetails.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                {courseDetails.longDescription}
              </p>
              
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {courseDetails.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  {courseDetails.students} enrolled
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  {courseDetails.certification}
                </div>
              </div>
            </div>
            
            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">
                        ₹{courseDetails.price.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        ₹{courseDetails.originalPrice.toLocaleString()}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Save ₹{(courseDetails.originalPrice - courseDetails.price).toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Next Batch:</span>
                      <span className="font-medium">{courseDetails.nextBatch.startDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="font-medium text-right">{courseDetails.nextBatch.schedule}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Mode:</span>
                      <span className="font-medium">{courseDetails.nextBatch.mode}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Seats Left:</span>
                      <span className="font-medium text-orange-600">{courseDetails.nextBatch.seats}</span>
                    </div>
                  </div>
                  
                  <Button onClick={handleEnrollment} className="w-full bg-blue-600 hover:bg-blue-700">
                    Enroll Now - ₹{courseDetails.price.toLocaleString()}
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    30-day money-back guarantee
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Details Tabs */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="curriculum" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
          </TabsList>
          
          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-6">
            <h2 className="text-2xl font-bold">Course Curriculum</h2>
            <div className="space-y-4">
              {courseDetails.curriculum.map((module, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Module {index + 1}: {module.module}</span>
                      <Badge variant="outline">{module.duration}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Instructor Tab */}
          <TabsContent value="instructor" className="space-y-6">
            <h2 className="text-2xl font-bold">Meet Your Instructor</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{courseDetails.instructor.name}</h3>
                    <p className="text-gray-600 mb-2">{courseDetails.instructor.experience}</p>
                    <div className="flex items-center mb-4">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="ml-1">{courseDetails.instructor.rating} rating</span>
                    </div>
                    <p className="text-gray-700">{courseDetails.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <h2 className="text-2xl font-bold">What You'll Get</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {courseDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Course Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {courseDetails.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center">
                        <Award className="h-5 w-5 text-blue-500 mr-3" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-6">
            <h2 className="text-2xl font-bold">Prerequisites</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {courseDetails.prerequisites.map((req, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
      
      {/* Payment Modal */}
      {courseDetails && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          courseDetails={{
            id: courseDetails.id,
            title: courseDetails.title,
            price: courseDetails.price,
            originalPrice: courseDetails.originalPrice,
            nextBatch: courseDetails.nextBatch
          }}
        />
      )}
    </div>
  );
};

export default CourseDetailPage;