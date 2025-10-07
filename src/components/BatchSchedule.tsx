import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Globe, Award } from 'lucide-react';

const BatchSchedule = () => {
  const scheduleData = [
    {
      course: "AWS Cloud Practitioner",
      batch: "Weekend Batch",
      startDate: "15th Jan 2025",
      duration: "6 weeks",
      timing: "10:00 AM - 2:00 PM",
      mode: "Online/Offline",
      status: "Filling Fast",
      seats: "5 left"
    },
    {
      course: "Azure Fundamentals",
      batch: "Weekday Batch",
      startDate: "20th Jan 2025",
      duration: "4 weeks",
      timing: "7:00 PM - 9:00 PM",
      mode: "Online",
      status: "Available",
      seats: "12 left"
    },
    {
      course: "Google Cloud Associate",
      batch: "Fast Track",
      startDate: "25th Jan 2025",
      duration: "8 weeks",
      timing: "6:00 PM - 8:00 PM",
      mode: "Hybrid",
      status: "Available",
      seats: "8 left"
    },
    {
      course: "DevOps Engineer",
      batch: "Intensive Batch",
      startDate: "1st Feb 2025",
      duration: "12 weeks",
      timing: "10:00 AM - 1:00 PM",
      mode: "Online/Offline",
      status: "Available",
      seats: "15 left"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Filling Fast':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'New Batch':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-xl border border-white/20 rounded-full text-sm font-semibold text-blue-600 mb-6 shadow-lg">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Batch Schedule
          </div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            Secure Your Seat in Next Certification Batch
          </h2>
          <p className="text-xl text-gray-600">
            Join our expert-led certification programs with flexible learning modes.
          </p>
        </div>

        <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden mb-12">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
            <CardTitle className="text-2xl font-bold flex items-center">
              <Calendar className="h-6 w-6 mr-3" />
              Upcoming Certification Batches - January & February 2025
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Batch Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Duration</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Timing</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Mode</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scheduleData.map((batch, index) => (
                    <tr key={index} className="hover:bg-blue-50/50 transition-all duration-200">
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                            <Award className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-sm">{batch.course}</div>
                            <div className="text-gray-500 text-xs">Certification Track</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <Badge variant="outline" className="font-medium">
                          {batch.batch}
                        </Badge>
                      </td>
                      <td className="px-6 py-6 text-sm font-semibold text-gray-900">{batch.startDate}</td>
                      <td className="px-6 py-6 text-sm text-gray-700">{batch.duration}</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center text-sm text-gray-700">
                          <Clock className="h-4 w-4 mr-2 text-blue-500" />
                          {batch.timing}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          {batch.mode}
                        </Badge>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <Badge className={getStatusColor(batch.status)}>
                            {batch.status}
                          </Badge>
                          <div className="text-xs text-gray-500">{batch.seats}</div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                        >
                          Register Now
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-10 py-4 text-lg font-bold rounded-2xl">
            Talk to Expert Counselor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BatchSchedule;
