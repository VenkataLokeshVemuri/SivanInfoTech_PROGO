'use client'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseEnrollment from '@/components/CourseEnrollment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Award, Users, Clock } from 'lucide-react';

const Courses = () => {
  const coursesOverview = [
    {
      icon: Cloud,
      title: 'AWS Fundamentals',
      description: 'Master Amazon Web Services basics and core concepts',
      duration: '6 weeks',
      students: '500+',
      level: 'Beginner'
    },
    {
      icon: Cloud,
      title: 'Azure Cloud Computing',
      description: 'Comprehensive Microsoft Azure training program',
      duration: '8 weeks',
      students: '400+',
      level: 'Intermediate'
    },
    {
      icon: Cloud,
      title: 'Google Cloud Platform',
      description: 'Complete GCP certification preparation course',
      duration: '6 weeks',
      students: '300+',
      level: 'Beginner'
    },
    {
      icon: Award,
      title: 'DevOps & Cloud Security',
      description: 'Advanced cloud security and DevOps practices',
      duration: '10 weeks',
      students: '200+',
      level: 'Advanced'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Cloud Computing Courses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry-leading cloud training programs designed to accelerate your career in cloud computing
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Course Overview</TabsTrigger>
              <TabsTrigger value="enroll">Enroll Now</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursesOverview.map((course, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <course.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{course.title}</CardTitle>
                          <CardDescription>{course.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <Clock className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                          <p className="text-sm font-medium">{course.duration}</p>
                          <p className="text-xs text-gray-500">Duration</p>
                        </div>
                        <div>
                          <Users className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                          <p className="text-sm font-medium">{course.students}</p>
                          <p className="text-xs text-gray-500">Students</p>
                        </div>
                        <div>
                          <Award className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                          <p className="text-sm font-medium">{course.level}</p>
                          <p className="text-xs text-gray-500">Level</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enroll">
              <CourseEnrollment />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Courses;
