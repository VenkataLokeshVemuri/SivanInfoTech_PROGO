"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  BookOpen, Calendar, Clock, User, MapPin, ArrowLeft, 
  GraduationCap, Star, CheckCircle, PlayCircle, Award,
  Target, Users, Globe, Zap, Download, Share2, Video, Play
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { useToast } from '@/hooks/use-toast';
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface EnrolledCourse {
  enrollmentID: string;
  courseID: string;
  courseShortForm: string;
  courseTitle: string;
  enrolledDate: string;
  enrollmentStatus: string;
  certificationID?: string;
  certifiedOn?: string;
  batchDetails: {
    batchName: string;
    startDate: string;
    endDate: string;
    schedule: string;
    instructor: string;
    location: string;
    nextClass?: {
      date: string;
      time: string;
      topic: string;
      type: string;
    };
    progress: number;
    totalClasses: number;
    completedClasses: number;
  };
}

const ViewSchedulePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useBackendAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const data = await apiService.getEnrollments();
        // Add enhanced batch details with schedule information
        const coursesWithBatch = data?.map((course: any, index: number) => ({
          ...course,
          batchDetails: {
            batchName: `${course.courseShortForm} - Batch ${Math.floor(Math.random() * 5) + 1}`,
            startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            schedule: ['Mon-Fri 9:00 AM - 12:00 PM', 'Mon-Fri 6:00 PM - 9:00 PM', 'Sat-Sun 10:00 AM - 4:00 PM'][Math.floor(Math.random() * 3)],
            instructor: ['Dr. Sarah Johnson', 'Prof. Michael Chen', 'Ms. Emily Rodriguez', 'Mr. David Kumar'][Math.floor(Math.random() * 4)],
            location: ['Online', 'Bangalore Center', 'Chennai Center'][Math.floor(Math.random() * 3)],
            progress: Math.floor(Math.random() * 80) + 20, // 20-100%
            totalClasses: 20 + Math.floor(Math.random() * 15), // 20-35 classes
            completedClasses: Math.floor((Math.floor(Math.random() * 80) + 20) / 100 * (20 + Math.floor(Math.random() * 15))),
            nextClass: course.enrollmentStatus === 'Active' ? {
              date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
              time: ['9:00 AM', '2:00 PM', '6:00 PM'][Math.floor(Math.random() * 3)],
              topic: `${course.courseShortForm} Advanced Topics - Session ${Math.floor(Math.random() * 10) + 1}`,
              type: 'Live Class'
            } : undefined
          }
        })) || [];
        
        setEnrolledCourses(coursesWithBatch);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your schedule",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [toast]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { color: 'bg-green-100 text-green-800 border-green-200', icon: PlayCircle },
      'Completed': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
      'Certified': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Award },
      'Upcoming': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Clock },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Active'];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border font-medium flex items-center space-x-1`}>
        <IconComponent className="h-3 w-3" />
        <span>{status}</span>
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="View Schedule - Your Enrolled Courses | SitCloud"
        description="View your enrolled course schedules, upcoming live classes, and access recorded sessions for AWS, Azure, and GCP certifications."
        keywords="course schedule, live classes, aws training schedule, cloud certification classes"
      />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Your Learning
                <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent"> Schedule</span>
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
                Track your enrolled courses and upcoming sessions
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-blue-200">Welcome back,</div>
                  <div className="text-xl font-semibold">{user?.name || 'Student'}</div>
                </div>
                <Avatar className="h-16 w-16 border-4 border-white/30 shadow-xl">
                  <AvatarFallback className="text-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'ST'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {enrolledCourses.length > 0 ? (
                <>
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                            <p className="text-3xl font-bold text-gray-900">{enrolledCourses.length}</p>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                            <BookOpen className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Active Courses</p>
                            <p className="text-3xl font-bold text-green-600">
                              {enrolledCourses.filter(c => c.enrollmentStatus === 'Active').length}
                            </p>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                            <Target className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Completed</p>
                            <p className="text-3xl font-bold text-blue-600">
                              {enrolledCourses.filter(c => c.enrollmentStatus === 'Completed').length}
                            </p>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl">
                            <CheckCircle className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Certificates</p>
                            <p className="text-3xl font-bold text-yellow-600">
                              {enrolledCourses.filter(c => c.enrollmentStatus === 'Certified').length}
                            </p>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                            <Award className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Course Schedule Cards */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                      Course Schedule
                    </h2>
                    
                    <div className="space-y-6">
                      {enrolledCourses.map((course) => (
                        <Card key={course.enrollmentID} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-3">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                  <GraduationCap className="h-8 w-8" />
                                </div>
                                <div>
                                  <CardTitle className="text-2xl mb-2">{course.courseTitle}</CardTitle>
                                  <CardDescription className="text-green-100">
                                    {course.courseShortForm} • {course.batchDetails.batchName}
                                  </CardDescription>
                                </div>
                              </div>
                              {getStatusBadge(course.enrollmentStatus)}
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-4">
                              <div className="flex justify-between text-sm text-green-100 mb-2">
                                <span>Progress: {course.batchDetails.completedClasses}/{course.batchDetails.totalClasses} classes</span>
                                <span>{course.batchDetails.progress}%</span>
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-300 to-blue-300 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${course.batchDetails.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Schedule Information */}
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center">
                                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                                  Schedule Details
                                </h3>
                                
                                <div className="space-y-3">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                    <span className="font-medium">{course.batchDetails.schedule}</span>
                                  </div>
                                  
                                  <div className="flex items-center text-sm text-gray-600">
                                    <User className="h-4 w-4 mr-2 text-green-500" />
                                    <span>Instructor: {course.batchDetails.instructor}</span>
                                  </div>
                                  
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                                    <span>{course.batchDetails.location}</span>
                                  </div>

                                  <div className="text-sm">
                                    <span className="text-gray-500">Course Duration:</span>
                                    <span className="ml-2 font-medium text-gray-900">
                                      {formatDate(course.batchDetails.startDate)} - {formatDate(course.batchDetails.endDate)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Next Class or Course Info */}
                              <div className="space-y-4">
                                {course.batchDetails.nextClass ? (
                                  <>
                                    <h3 className="text-lg font-semibold flex items-center">
                                      <Calendar className="h-5 w-5 mr-2 text-green-600" />
                                      Next Live Class
                                    </h3>
                                    <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                                      <CardContent className="p-4">
                                        <div className="space-y-3">
                                          <div className="flex items-center text-sm">
                                            <Calendar className="h-4 w-4 mr-2 text-green-600" />
                                            <span>{formatDate(course.batchDetails.nextClass.date)}</span>
                                          </div>
                                          <div className="flex items-center text-sm">
                                            <Clock className="h-4 w-4 mr-2 text-green-600" />
                                            <span>{course.batchDetails.nextClass.time}</span>
                                          </div>
                                          <div className="flex items-center text-sm">
                                            <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                                            <span>{course.batchDetails.nextClass.topic}</span>
                                          </div>
                                          <Badge variant="outline" className="text-xs">
                                            {course.batchDetails.nextClass.type}
                                          </Badge>
                                        </div>
                                        <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                                          <Play className="h-4 w-4 mr-2" />
                                          Join Live Class
                                        </Button>
                                      </CardContent>
                                    </Card>
                                  </>
                                ) : (
                                  <>
                                    <h3 className="text-lg font-semibold flex items-center">
                                      <Award className="h-5 w-5 mr-2 text-yellow-600" />
                                      Course Completed
                                    </h3>
                                    <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                                      <CardContent className="p-4">
                                        <p className="text-sm text-gray-600 mb-4">
                                          Congratulations! You have completed this course.
                                        </p>
                                        {course.certificationID && (
                                          <Button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Certificate
                                          </Button>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                              <div className="flex space-x-3">
                                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  Course Details
                                </Button>
                                
                                <Button size="sm" variant="outline">
                                  <Video className="h-4 w-4 mr-1" />
                                  Recordings
                                </Button>
                              </div>
                              
                              <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Empty State
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="p-6 bg-gradient-to-r from-blue-100 to-green-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No Courses Enrolled</h3>
                    <p className="text-gray-600 mb-8">
                      You haven't enrolled in any courses yet. Browse our available courses and start your learning journey!
                    </p>
                    <Link href="/courses">
                      <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ViewSchedulePage;