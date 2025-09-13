
'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Clock,
  BookOpen,
  Users,
  MoreVertical
} from 'lucide-react';
import AdminLayout from '../admin-layout';

const SchedulePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const batches = [
    {
      id: 1,
      course: 'AWS Cloud Practitioner',
      instructor: 'Dr. Rajesh Kumar',
      date: '2025-09-15',
      time: '10:00 AM - 12:00 PM',
      students: 15,
      status: 'scheduled',
      mode: 'Online'
    },
    {
      id: 2,
      course: 'Azure DevOps Engineer',
      instructor: 'Ms. Kavitha Sharma',
      date: '2025-09-15',
      time: '02:00 PM - 04:00 PM',
      students: 12,
      status: 'scheduled',
      mode: 'Classroom'
    },
    {
      id: 3,
      course: 'Python for Data Science',
      instructor: 'Mr. Suresh Patel',
      date: '2025-09-16',
      time: '09:00 AM - 11:00 AM',
      students: 20,
      status: 'scheduled',
      mode: 'Online'
    },
    {
      id: 4,
      course: 'Google Cloud Platform',
      instructor: 'Dr. Priya Reddy',
      date: '2025-09-17',
      time: '01:00 PM - 03:00 PM',
      students: 10,
      status: 'scheduled',
      mode: 'Classroom'
    },
    {
      id: 5,
      course: 'Kubernetes Administration',
      instructor: 'Mr. Vikram Singh',
      date: '2025-09-18',
      time: '11:00 AM - 01:00 PM',
      students: 8,
      status: 'scheduled',
      mode: 'Online'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilterDate = filterDate === '' || batch.date === filterDate;
    return matchesSearch && matchesFilterDate;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Batch Schedule Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and organize training batch schedules.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Batch
            </button>
          </div>
        </div>

        {/* Filters and search */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-primary-green focus:border-primary-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search batches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="date"
                    className="focus:ring-primary-green focus:border-primary-green block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md sm:text-sm"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Batches table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBatches.map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{batch.course}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{batch.instructor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{batch.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{batch.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{batch.students}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{batch.mode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-gray-400 hover:text-primary-green">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBatches.length}</span> of{' '}
                <span className="font-medium">{batches.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SchedulePage;


