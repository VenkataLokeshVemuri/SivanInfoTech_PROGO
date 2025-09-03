'use client';

import React, { useState } from 'react';
import { 
  Save, 
  X, 
  Calendar,
  Clock,
  Users,
  BookOpen
} from 'lucide-react';
import AdminLayout from '../../admin-layout';

const CreateSchedulePage: React.FC = () => {
  const [scheduleData, setScheduleData] = useState({
    course: '',
    instructor: '',
    date: '',
    startTime: '',
    endTime: '',
    maxStudents: '',
    mode: 'online',
    location: '',
    description: '',
    recurring: false,
    recurringType: 'weekly',
    recurringEnd: '',
    status: 'scheduled'
  });

  const courses = [
    'AWS Cloud Practitioner',
    'Azure DevOps Engineer',
    'Python for Data Science',
    'Google Cloud Platform',
    'Kubernetes Administration'
  ];

  const instructors = [
    'Dr. Rajesh Kumar',
    'Ms. Kavitha Sharma',
    'Mr. Suresh Patel',
    'Dr. Priya Reddy',
    'Mr. Vikram Singh'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Schedule data:', scheduleData);
    // Here you would typically send the data to your backend
    alert('Batch scheduled successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Schedule New Batch
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a new batch schedule for training sessions.
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              form="schedule-form"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Schedule
            </button>
          </div>
        </div>

        {/* Schedule form */}
        <form id="schedule-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                    Course *
                  </label>
                  <select
                    id="course"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm rounded-md"
                    value={scheduleData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                    Instructor *
                  </label>
                  <select
                    id="instructor"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm rounded-md"
                    value={scheduleData.instructor}
                    onChange={(e) => handleInputChange('instructor', e.target.value)}
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor} value={instructor}>{instructor}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Date and Time</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      required
                      className="focus:ring-primary-green focus:border-primary-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={scheduleData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="startTime"
                      required
                      className="focus:ring-primary-green focus:border-primary-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={scheduleData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="time"
                      id="endTime"
                      required
                      className="focus:ring-primary-green focus:border-primary-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={scheduleData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Batch Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Batch Details</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700">
                    Maximum Students *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="maxStudents"
                      required
                      min="1"
                      className="focus:ring-primary-green focus:border-primary-green block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={scheduleData.maxStudents}
                      onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
                    Mode *
                  </label>
                  <select
                    id="mode"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm rounded-md"
                    value={scheduleData.mode}
                    onChange={(e) => handleInputChange('mode', e.target.value)}
                  >
                    <option value="online">Online</option>
                    <option value="classroom">Classroom</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                {scheduleData.mode !== 'online' && (
                  <div className="sm:col-span-2">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      placeholder="Enter classroom location"
                      className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={scheduleData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Additional notes or description for this batch"
                    className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={scheduleData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recurring Schedule */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recurring Schedule</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="recurring"
                    type="checkbox"
                    className="focus:ring-primary-green h-4 w-4 text-primary-green border-gray-300 rounded"
                    checked={scheduleData.recurring}
                    onChange={(e) => handleInputChange('recurring', e.target.checked)}
                  />
                  <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">
                    This is a recurring batch
                  </label>
                </div>
                
                {scheduleData.recurring && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="recurringType" className="block text-sm font-medium text-gray-700">
                        Recurring Type
                      </label>
                      <select
                        id="recurringType"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm rounded-md"
                        value={scheduleData.recurringType}
                        onChange={(e) => handleInputChange('recurringType', e.target.value)}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="recurringEnd" className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="recurringEnd"
                        className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={scheduleData.recurringEnd}
                        onChange={(e) => handleInputChange('recurringEnd', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Status</h3>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Batch Status *
                </label>
                <select
                  id="status"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm rounded-md"
                  value={scheduleData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateSchedulePage;

