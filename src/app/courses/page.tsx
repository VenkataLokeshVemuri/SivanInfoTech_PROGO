'use client'

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseEnrollment from '@/components/CourseEnrollment';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Users, Clock } from 'lucide-react';

const Courses = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const coursesOverview = [
    {
      logo: "/logos/aws.svg",
      title: "AWS Fundamentals",
      description: "Master Amazon Web Services basics and core concepts",
      duration: "6 weeks",
      students: "500+",
      level: "Beginner",
    },
    {
      logo: "/logos/azure-2.png",
      title: "Azure Cloud Computing",
      description: "Comprehensive Microsoft Azure training program",
      duration: "8 weeks",
      students: "400+",
      level: "Intermediate",
    },
    {
      logo: "/logos/google.png",
      title: "Google Cloud Platform",
      description: "Complete GCP certification preparation course",
      duration: "6 weeks",
      students: "300+",
      level: "Beginner",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="py-20 text-center bg-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 inline-block text-gray-900">
          Cloud Computing Courses
        </h1>
        <div className="mx-auto mt-3 mb-6 w-28 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
        <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600">
          Industry-leading cloud training programs designed to accelerate your career in cloud computing
        </p>
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
                value="enroll"
                className="px-10 py-3 rounded-lg text-base font-medium border border-gray-300 bg-white shadow-sm hover:bg-blue-50 hover:text-blue-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition"
              >
                Enroll Now
              </TabsTrigger>
            </TabsList>

            {/* Responsive Centered Strips with Gradient Highlight */}
            <TabsContent value="overview">
              <div className="space-y-8 flex flex-col items-center">
                {coursesOverview.map((course, index) => (
                  <div
                    key={index}
                    className="w-full md:w-4/6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all 
                               border border-gray-200 hover:border-transparent hover:bg-gradient-to-r 
                               hover:from-blue-50 hover:to-indigo-50"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between p-6">
                      {/* Logo */}
                      <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center mb-4 md:mb-0">
                        <img
                          src={course.logo}
                          alt={`${course.title} logo`}
                          className="h-16 object-contain"
                        />
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 px-0 md:px-6 text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                          {course.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{course.description}</p>
                        <div className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0 text-sm text-gray-700 justify-center md:justify-start">
                          <div className="flex items-center space-x-2 justify-center md:justify-start">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2 justify-center md:justify-start">
                            <Users className="h-4 w-4 text-green-500" />
                            <span>{course.students}</span>
                          </div>
                          <div className="flex items-center space-x-2 justify-center md:justify-start">
                            <Award className="h-4 w-4 text-purple-500" />
                            <span>{course.level}</span>
                          </div>
                        </div>
                      </div>

                      {/* Enroll Button with Gradient */}
                      <div className="flex-shrink-0 mt-4 md:mt-0">
                        <button
                          onClick={() => setActiveTab('enroll')}
                          className="px-6 py-2 rounded-lg text-white font-medium 
                                     bg-gradient-to-r from-blue-500 to-indigo-600 
                                     hover:from-blue-600 hover:to-indigo-700 
                                     transition transform hover:scale-105"
                        >
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Enrollment Form */}
            <TabsContent value="enroll">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <CourseEnrollment />
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
