
'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Clock,
  DollarSign,
  Star,
  Calendar,
  BookOpen,
  Award,
  MoreVertical
} from 'lucide-react';
import AdminLayout from './admin-layout'; // Update the path to the correct location

const CoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'AWS Cloud Practitioner',
      category: 'Cloud Computing',
      description: 'Complete AWS fundamentals course with hands-on labs and certification preparation.',
      duration: '6 weeks',
      price: '₹15,000',
      students: 45,
      rating: 4.8,
      status: 'active',
      instructor: 'Dr. Rajesh Kumar',
      startDate: '2025-09-15',
      image: '/api/placeholder/300/200' // Placeholder image
    },
    {
      id: 2,
      title: 'Azure DevOps Engineer',
      category: 'Cloud Computing',
      description: 'Master Azure DevOps tools and practices for modern software development.',
      duration: '8 weeks',
      price: '₹18,000',
      students: 32,
      rating: 4.7,
      status: 'active',
      instructor: 'Ms. Kavitha Sharma',
      startDate: '2025-09-20',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Python for Data Science',
      category: 'Programming',
      description: 'Learn Python programming with focus on data analysis and machine learning.',
      duration: '10 weeks',
      price: '₹20,000',
      students: 67,
      rating: 4.9,
      status: 'active',
      instructor: 'Mr. Suresh Patel',
      startDate: '2025-09-10',
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Google Cloud Platform',
      category: 'Cloud Computing',
      description: 'Comprehensive GCP training covering core services and best practices.',
      duration: '7 weeks',
      price: '₹16,500',
      students: 28,
      rating: 4.6,
      status: 'draft',
      instructor: 'Dr. Priya Reddy',
      startDate: '2025-10-01',
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      title: 'Kubernetes Administration',
      category: 'DevOps',
      description: 'Advanced Kubernetes concepts for container orchestration and management.',
      duration: '5 weeks',
      price: '₹14,000',
      students: 19,
      rating: 4.5,
      status: 'active',
      instructor: 'Mr. Vikram Singh',
      startDate: '2025-09-25',
      image: '/api/placeholder/300/200'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Courses Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create, edit, and manage your training courses and curriculum.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Course
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
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    className="focus:ring-primary-green focus:border-primary-green block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md sm:text-sm"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Programming">Programming</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold text-white bg-black bg-opacity-50 p-2 rounded">
                    {course.title}
                  </h3>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{course.category}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {course.students} students
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {course.price}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    Starts {course.startDate}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{course.instructor}</span>
                    <div className="flex items-center space-x-2">
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course statistics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Course Statistics</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-primary-green" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                        <dd className="text-lg font-medium text-gray-900">{courses.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-accent-blue" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {courses.reduce((sum, course) => sum + course.students, 0)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Star className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Avg Rating</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Award className="h-8 w-8 text-primary-orange" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Courses</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {courses.filter(course => course.status === 'active').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CoursesPage;


