
import React from 'react';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import EnrollModal from './EnrollModal';

const BatchSchedule = () => {
  const upcomingBatches = [
    {
      id: "aws-sa-associate-june",
      course: "AWS Solutions Architect Associate",
      startDate: "June 10, 2025",
      duration: "8 Weeks",
      location: "Chennai",
      mode: "Hybrid",
      seatsLeft: 5,
      timing: "Weekends 9 AM - 6 PM",
      instructor: "Rajesh Kumar (AWS Certified)",
      popular: true,
      price: 45000
    },
    {
      id: "azure-fundamentals-june",
      course: "Azure Fundamentals (AZ-900)",
      startDate: "June 12, 2025", 
      duration: "3 Weeks",
      location: "Bangalore",
      mode: "Offline",
      seatsLeft: 7,
      timing: "Weekdays 7 PM - 9 PM",
      instructor: "Priya Sharma (Azure Expert)",
      price: 20000
    },
    {
      id: "gcp-architect-june",
      course: "GCP Professional Cloud Architect",
      startDate: "June 15, 2025",
      duration: "10 Weeks", 
      location: "Online",
      mode: "Online",
      seatsLeft: 3,
      timing: "Weekends 10 AM - 5 PM",
      instructor: "Arjun Nair (GCP Certified)",
      price: 55000
    },
    {
      id: "aws-developer-june",
      course: "AWS Developer Associate",
      startDate: "June 18, 2025",
      duration: "8 Weeks",
      location: "Chennai",
      mode: "Offline",
      seatsLeft: 8,
      timing: "Weekdays 6 PM - 8 PM",
      instructor: "Kavya Reddy (DevOps Expert)",
      price: 42000
    },
    {
      id: "azure-admin-june",
      course: "Azure Administrator (AZ-104)",
      startDate: "June 20, 2025",
      duration: "8 Weeks",
      location: "Bangalore", 
      mode: "Hybrid",
      seatsLeft: 4,
      timing: "Weekends 9 AM - 6 PM",
      instructor: "Amit Singh (Azure Specialist)",
      popular: true,
      price: 40000
    },
    {
      id: "devops-bootcamp-june",
      course: "Multi-Cloud DevOps Bootcamp",
      startDate: "June 25, 2025",
      duration: "12 Weeks",
      location: "Online",
      mode: "Online",
      seatsLeft: 6,
      timing: "Weekdays 7 PM - 10 PM",
      instructor: "Sneha Patel (DevOps Architect)",
      price: 65000
    }
  ];

  return (
    <section id="batch-schedule" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
              <Calendar className="mr-2 h-4 w-4" />
              Upcoming Batch Schedule
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Secure Your Seat in Next <span className="text-blue-600">Certification Batch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our expert-led certification bootcamps starting soon. Limited seats available with small batch sizes for personalized attention.
            </p>
          </div>

          {/* Batch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {upcomingBatches.map((batch, index) => (
              <div key={index} className={`relative bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 ${batch.popular ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-200'}`}>
                {batch.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}
                
                <div className="space-y-4">
                  {/* Course Title */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{batch.course}</h3>
                    <div className="text-sm text-gray-600">{batch.instructor}</div>
                  </div>

                  {/* Batch Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-3 text-blue-600" />
                      <span><strong>Start:</strong> {batch.startDate}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-3 text-blue-600" />
                      <span><strong>Duration:</strong> {batch.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-blue-600" />
                      <span><strong>Location:</strong> {batch.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-3 text-blue-600" />
                      <span><strong>Timing:</strong> {batch.timing}</span>
                    </div>
                  </div>

                  {/* Mode and Seats */}
                  <div className="flex items-center justify-between">
                    <Badge className={`${
                      batch.mode === 'Online' ? 'bg-green-100 text-green-800' :
                      batch.mode === 'Offline' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {batch.mode}
                    </Badge>
                    <span className={`text-sm font-semibold ${
                      batch.seatsLeft <= 3 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {batch.seatsLeft} seats left
                    </span>
                  </div>

                  {/* CTA Button */}
                  <EnrollModal 
                    courseId={batch.id} 
                    courseName={batch.course} 
                    coursePrice={batch.price}
                  >
                    <Button 
                      className={`w-full ${
                        batch.popular 
                          ? 'bg-orange-600 hover:bg-orange-700' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white py-3 font-semibold`}
                    >
                      {batch.seatsLeft <= 3 ? 'Hurry! Enroll Now' : 'Enroll Now'}
                    </Button>
                  </EnrollModal>
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
              What You Get in Every Batch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Expert Trainers</h4>
                <p className="text-sm text-gray-600">Industry certified professionals</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Small Batches</h4>
                <p className="text-sm text-gray-600">Max 15 students per batch</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Flexible Timing</h4>
                <p className="text-sm text-gray-600">Weekday & weekend options</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Multiple Modes</h4>
                <p className="text-sm text-gray-600">Online, offline, hybrid</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Don't See Your Preferred Schedule?
            </h3>
            <p className="text-gray-600 mb-6">
              We offer flexible batch timings. Talk to our counselor to find the perfect schedule for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                📞 Talk to Counselor
              </Button>
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3">
                📅 Request Custom Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BatchSchedule;
