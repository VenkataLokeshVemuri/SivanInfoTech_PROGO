
'use client';

import React from 'react';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Clock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Students',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-primary-green',
    },
    {
      name: 'Active Courses',
      value: '8',
      change: '+2',
      changeType: 'increase',
      icon: BookOpen,
      color: 'bg-accent-blue',
    },
    {
      name: 'New Enquiries',
      value: '45',
      change: '+8%',
      changeType: 'increase',
      icon: MessageSquare,
      color: 'bg-primary-orange',
    },
    {
      name: 'Revenue',
      value: '₹2,45,000',
      change: '+15%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-green-600',
    },
  ];

  const recentEnquiries = [
    { id: 1, name: 'Rahul Sharma', course: 'AWS', email: 'rahul@example.com', date: '2025-09-01' },
    { id: 2, name: 'Priya Patel', course: 'Azure', email: 'priya@example.com', date: '2025-09-01' },
    { id: 3, name: 'Amit Kumar', course: 'Python', email: 'amit@example.com', date: '2025-08-31' },
    { id: 4, name: 'Sneha Reddy', course: 'GCP', email: 'sneha@example.com', date: '2025-08-31' },
    { id: 5, name: 'Vikram Singh', course: 'Kubernetes', email: 'vikram@example.com', date: '2025-08-30' },
  ];

  const upcomingClasses = [
    { id: 1, course: 'AWS Fundamentals', time: '10:00 AM', date: '2025-09-02', instructor: 'Dr. Rajesh' },
    { id: 2, course: 'Azure DevOps', time: '2:00 PM', date: '2025-09-02', instructor: 'Ms. Kavitha' },
    { id: 3, course: 'Python Advanced', time: '4:00 PM', date: '2025-09-02', instructor: 'Mr. Suresh' },
    { id: 4, course: 'GCP Certification', time: '11:00 AM', date: '2025-09-03', instructor: 'Dr. Priya' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your training institute.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Demo
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} p-3 rounded-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                          <span className="ml-1">{stat.change}</span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Enquiries */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Enquiries</h3>
              <a href="/admin/enquiries" className="text-sm text-primary-green hover:text-green-700">
                View all
              </a>
            </div>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentEnquiries.map((enquiry) => (
                  <li key={enquiry.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary-green flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {enquiry.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {enquiry.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {enquiry.email} • {enquiry.course}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {enquiry.date}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Classes</h3>
              <a href="/admin/schedule" className="text-sm text-primary-green hover:text-green-700">
                View schedule
              </a>
            </div>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {upcomingClasses.map((class_item) => (
                  <li key={class_item.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-accent-blue flex items-center justify-center">
                          <Clock className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {class_item.course}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {class_item.instructor} • {class_item.time}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {class_item.date}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <Users className="mr-2 h-4 w-4" />
              Add Student
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <BookOpen className="mr-2 h-4 w-4" />
              Create Course
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Class
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <Award className="mr-2 h-4 w-4" />
              Generate Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


