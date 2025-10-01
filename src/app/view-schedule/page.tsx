"use client";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, Users, Play, Download, CheckCircle, BookOpen, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ViewSchedule = () => {
  const enrolledCourses = [
    {
      id: "aws-solutions-architect",
      title: "AWS Solutions Architect Associate",
      instructor: "Rajesh Kumar",
      status: "Active",
      progress: 65,
      totalClasses: 24,
      completedClasses: 15,
      nextClass: {
        date: "October 2, 2025",
        time: "2:00 PM",
        topic: "EC2 Advanced Configuration",
        type: "Live Class"
      },
      schedule: {
        liveClasses: "Daily at 2:00 PM IST",
        duration: "90 minutes",
        timezone: "Asia/Kolkata"
      },
      recordings: [
        {
          title: "Introduction to AWS Cloud",
          date: "Sep 15, 2025",
          duration: "85 min",
          watched: true
        },
        {
          title: "IAM & Security Fundamentals",
          date: "Sep 16, 2025", 
          duration: "92 min",
          watched: true
        },
        {
          title: "EC2 Instance Types & Pricing",
          date: "Sep 17, 2025",
          duration: "88 min",
          watched: false
        },
        {
          title: "VPC & Networking Basics",
          date: "Sep 18, 2025",
          duration: "95 min",
          watched: false
        }
      ],
      resources: [
        { name: "AWS CLI Cheat Sheet", type: "PDF", size: "2.5 MB" },
        { name: "Lab Exercise Files", type: "ZIP", size: "15.8 MB" },
        { name: "Practice Test Questions", type: "PDF", size: "1.2 MB" }
      ]
    }
  ];

  const upcomingClasses = [
    {
      date: "Oct 2, 2025",
      time: "2:00 PM",
      topic: "EC2 Advanced Configuration",
      type: "Live Class",
      duration: "90 min"
    },
    {
      date: "Oct 3, 2025", 
      time: "2:00 PM",
      topic: "Load Balancers & Auto Scaling",
      type: "Live Class",
      duration: "90 min"
    },
    {
      date: "Oct 4, 2025",
      time: "2:00 PM", 
      topic: "RDS & Database Services",
      type: "Live Class",
      duration: "90 min"
    }
  ];

  return (
    <>
      <SEOHead 
        title="View Schedule - Your Enrolled Courses | SitCloud"
        description="View your enrolled course schedules, upcoming live classes, and access recorded sessions for AWS, Azure, and GCP certifications."
        keywords="course schedule, live classes, aws training schedule, cloud certification classes"
      />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-r from-green-600 via-blue-600 to-green-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Your Learning
                <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent"> Schedule</span>
              </h1>
              <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
                Track your progress, join live classes, and access recorded sessions
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              
              {/* Enrolled Courses */}
              <div className="space-y-8">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden shadow-lg border-0">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                          <p className="text-green-100">Instructor: {course.instructor}</p>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {course.status}
                        </Badge>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-green-100 mb-2">
                          <span>Progress: {course.completedClasses}/{course.totalClasses} classes</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-300 to-blue-300 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* Next Class Info */}
                        <div className="lg:col-span-1">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-green-600" />
                            Next Live Class
                          </h3>
                          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-2 text-green-600" />
                                  <span>{course.nextClass.date}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-2 text-green-600" />
                                  <span>{course.nextClass.time}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                                  <span>{course.nextClass.topic}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {course.nextClass.type}
                                </Badge>
                              </div>
                              <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                                <Play className="h-4 w-4 mr-2" />
                                Join Live Class
                              </Button>
                            </CardContent>
                          </Card>

                          {/* Schedule Info */}
                          <div className="mt-6">
                            <h4 className="font-semibold mb-3">Regular Schedule</h4>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{course.schedule.liveClasses}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                <span>{course.schedule.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recordings */}
                        <div className="lg:col-span-1">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Video className="h-5 w-5 mr-2 text-blue-600" />
                            Recorded Classes
                          </h3>
                          <div className="space-y-3 max-h-80 overflow-y-auto">
                            {course.recordings.map((recording, index) => (
                              <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-sm mb-1">{recording.title}</h4>
                                      <div className="flex items-center text-xs text-gray-500 space-x-3">
                                        <span>{recording.date}</span>
                                        <span>{recording.duration}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {recording.watched && (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      )}
                                      <Button size="sm" variant="outline">
                                        <Play className="h-3 w-3 mr-1" />
                                        Watch
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div className="lg:col-span-1">
                          <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <Download className="h-5 w-5 mr-2 text-green-600" />
                            Course Resources
                          </h3>
                          <div className="space-y-3">
                            {course.resources.map((resource, index) => (
                              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium text-sm">{resource.name}</h4>
                                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                                        <span>{resource.type}</span>
                                        <span>•</span>
                                        <span>{resource.size}</span>
                                      </div>
                                    </div>
                                    <Button size="sm" variant="outline">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Upcoming Classes Calendar */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Upcoming Classes This Week</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {upcomingClasses.map((classItem, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center text-green-600">
                            <Calendar className="h-5 w-5 mr-2" />
                            <span className="font-semibold">{classItem.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{classItem.time} ({classItem.duration})</span>
                          </div>
                          <h3 className="font-semibold text-gray-900">{classItem.topic}</h3>
                          <Badge variant="outline" className="w-fit">
                            {classItem.type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ViewSchedule;