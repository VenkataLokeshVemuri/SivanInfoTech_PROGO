'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BatchSchedule from '@/components/BatchSchedule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Users, Clock } from 'lucide-react';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  
  const handleEnrollClick = (courseId: string) => {
    router.push(`/courses/${courseId}`);
  };
  const coursesOverview = [
    {
      id: "aws-fundamentals",
      logo: "/logos/aws.svg",
      title: "AWS Fundamentals",
      description: "Master Amazon Web Services basics and core concepts",
      duration: "6 weeks",
      students: "500+",
      level: "Beginner",
      price: 15000,
      originalPrice: 20000,
    },
    {
      id: "azure-cloud-computing",
      logo: "/logos/azure-2.png",
      title: "Azure Cloud Computing",
      description: "Comprehensive Microsoft Azure training program",
      duration: "8 weeks",
      students: "400+",
      level: "Intermediate",
      price: 18000,
      originalPrice: 25000,
    },
    {
      id: "google-cloud-platform",
      logo: "/logos/google.png",
      title: "Google Cloud Platform",
      description: "Complete GCP certification preparation course",
      duration: "6 weeks",
      students: "300+",
      level: "Beginner",
      price: 16000,
      originalPrice: 22000,
    },
    {
      id: "aws-solution-architect",
      logo: "/logos/aws.svg",
      title: "AWS Solution Architect Associate",
      description: "Advanced AWS architecture design and implementation",
      duration: "40 Days",
      students: "200+",
      level: "Professional",
      price: 25000,
      originalPrice: 35000,
    },
    {
      id: "azure-administrator",
      logo: "/logos/azure-2.png",
      title: "Azure Administrator Associate",
      description: "Comprehensive Azure administration and management",
      duration: "40 Days",
      students: "180+",
      level: "Professional",
      price: 24000,
      originalPrice: 32000,
    },
    {
      id: "google-cloud-associate",
      logo: "/logos/google.png",
      title: "Google Cloud Associate",
      description: "Professional Google Cloud Platform certification track",
      duration: "40 Days",
      students: "150+",
      level: "Professional",
      price: 23000,
      originalPrice: 30000,
    },
    {
      id: "devops-multi-cloud",
      logo: "/logos/aws.svg",
      title: "DevOps with Multi-Cloud",
      description: "Master DevOps practices across AWS, Azure, and GCP platforms",
      duration: "90 Days",
      students: "120+",
      level: "Expert",
      price: 45000,
      originalPrice: 60000,
    },
    {
      id: "devsecops-multi-cloud",
      logo: "/logos/azure-2.png",
      title: "DevSecOps with Multi-Cloud",
      description: "Security-focused DevOps implementation across cloud platforms",
      duration: "90 Days",
      students: "100+",
      level: "Expert",
      price: 48000,
      originalPrice: 65000,
    },
    {
      id: "kubernetes-multi-cloud",
      logo: "/logos/google.png",
      title: "Kubernetes with Multi-Cloud",
      description: "Container orchestration and management across cloud providers",
      duration: "90 Days",
      students: "110+",
      level: "Expert",
      price: 46000,
      originalPrice: 62000,
    },
    {
      id: "ai-professional-program",
      logo: "/public/placeholder.svg",
      title: "AI Professional Program",
      description: "Comprehensive AI/ML, GenAI, and Agentic AI training program",
      duration: "120-180 Days",
      students: "80+",
      level: "Advanced",
      price: 75000,
      originalPrice: 100000,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="py-20 text-center bg-gradient-to-br from-white via-blue-50/30 to-green-50/30">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 inline-block">
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Cloud Computing Courses
            </span>
          </h1>
          <div className="mx-auto mt-3 mb-6 w-28 h-1 rounded-full bg-gradient-to-r from-blue-500 to-green-600" />
          <p className="text-lg md:text-xl max-w-4xl mx-auto text-gray-600 mb-8">
            Comprehensive cloud training programs from fundamentals to expert-level specializations. 
            Master AWS, Azure, GCP, DevOps, AI/ML, and cutting-edge technologies with industry-certified professionals.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 text-blue-700 font-medium">
              ✨ 10+ Course Tracks
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 text-green-700 font-medium">
              🏆 Industry Certified
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 text-purple-700 font-medium">
              🚀 Career Focused
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Tabs */}
            <TabsList className="flex justify-center space-x-6">
              <TabsTrigger
                value="overview"
                className="px-10 py-3 rounded-lg text-base font-medium border border-gray-300 bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
              >
                Course Overview
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="px-10 py-3 rounded-lg text-base font-medium border border-gray-300 bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
              >
                Batch Schedule
              </TabsTrigger>
              <TabsTrigger
                value="enroll"
                className="px-10 py-3 rounded-lg text-base font-medium border border-gray-300 bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
              >
                Enroll Now
              </TabsTrigger>
            </TabsList>

            {/* Responsive Centered Strips with Gradient Highlight */}
            <TabsContent value="overview">
              <div className="space-y-12">
                {/* Course Categories */}
                <div className="space-y-8">
                  {/* Professional Courses */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                        Professional Certification Tracks
                      </h2>
                      <p className="text-gray-600">Industry-recognized certifications for career advancement</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {coursesOverview.slice(3, 6).map((course, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                                     border border-orange-200 hover:border-transparent hover:bg-gradient-to-br 
                                     hover:from-orange-50 hover:to-red-50 transform hover:scale-105"
                        >
                          <div className="p-6">
                            {/* Logo */}
                            <div className="flex justify-center mb-4">
                              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                                <img
                                  src={course.logo}
                                  alt={`${course.title} logo`}
                                  className="h-12 object-contain"
                                />
                              </div>
                            </div>

                            {/* Course Info */}
                            <div className="text-center">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {course.title}
                              </h3>
                              <p className="text-gray-600 mb-4 text-sm">{course.description}</p>
                              
                              <div className="flex justify-center space-x-4 text-xs text-gray-700 mb-4">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3 text-orange-500" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3 text-green-500" />
                                  <span>{course.students}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Award className="h-3 w-3 text-purple-500" />
                                  <span>{course.level}</span>
                                </div>
                              </div>

                              {/* Enroll Button */}
                              <button
                                onClick={() => setActiveTab('enroll')}
                                className="w-full px-4 py-2 rounded-xl text-white font-medium 
                                           bg-gradient-to-r from-orange-500 to-red-600 
                                           hover:from-orange-600 hover:to-red-700 
                                           transition transform hover:scale-105 text-sm"
                              >
                                Enroll Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expert Level Courses */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Expert Specialization Programs
                      </h2>
                      <p className="text-gray-600">Advanced multi-cloud specializations for experienced professionals</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                      {coursesOverview.slice(6).map((course, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 
                                     border border-purple-200 hover:border-transparent hover:bg-gradient-to-br 
                                     hover:from-purple-50 hover:to-pink-50 transform hover:scale-105"
                        >
                          <div className="p-6">
                            {/* Logo */}
                            <div className="flex justify-center mb-4">
                              <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                                <img
                                  src={course.logo}
                                  alt={`${course.title} logo`}
                                  className="h-12 object-contain"
                                />
                              </div>
                            </div>

                            {/* Course Info */}
                            <div className="text-center">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {course.title}
                              </h3>
                              <p className="text-gray-600 mb-4 text-sm">{course.description}</p>
                              
                              <div className="flex justify-center space-x-2 text-xs text-gray-700 mb-4">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3 text-purple-500" />
                                  <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3 text-green-500" />
                                  <span>{course.students}</span>
                                </div>
                              </div>
                              
                              <div className="flex justify-center mb-4">
                                <div className="flex items-center space-x-1">
                                  <Award className="h-3 w-3 text-purple-500" />
                                  <span className="text-xs text-purple-600 font-medium">{course.level}</span>
                                </div>
                              </div>

                              {/* Enroll Button */}
                              <button
                                onClick={() => setActiveTab('enroll')}
                                className="w-full px-4 py-2 rounded-xl text-white font-medium 
                                           bg-gradient-to-r from-purple-500 to-pink-600 
                                           hover:from-purple-600 hover:to-pink-700 
                                           transition transform hover:scale-105 text-sm"
                              >
                                Enroll Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Call to Action for Batch Schedule */}
                <div className="mt-16 text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
                    <h3 className="text-2xl font-bold mb-4">Ready to Start Your Cloud Journey?</h3>
                    <p className="text-lg mb-6">Check our flexible batch schedules and learning modes</p>
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      View Batch Schedule
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Batch Schedule Tab */}
            <TabsContent value="schedule">
              <BatchSchedule />
            </TabsContent>

            {/* Enrollment Form */}
            <TabsContent value="enroll">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Course</h2>
                  <p className="text-gray-600">Select a course below to view detailed information and enroll</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesOverview.map((course, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center mb-4">
                        <img
                          src={course.logo}
                          alt={`${course.title} logo`}
                          className="h-8 w-8 mr-3"
                        />
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{course.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Level:</span>
                          <span className="font-medium">{course.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Students:</span>
                          <span className="font-medium">{course.students}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-medium text-green-600">₹{course.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleEnrollClick(course.id)}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details & Enroll
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Why Choose Our Courses?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Industry-recognized certifications</li>
                    <li>• Hands-on practical labs</li>
                    <li>• Expert instructor guidance</li>
                    <li>• Job placement assistance</li>
                    <li>• Flexible payment options</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
