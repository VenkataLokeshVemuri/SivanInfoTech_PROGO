'use client';

import React, { useState } from 'react';
import { 
  Save, 
  X, 
  Upload,
  Plus,
  Trash2
} from 'lucide-react';
import AdminLayout from '../../admin-layout';

const CreateCoursePage: React.FC = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    category: '',
    description: '',
    duration: '',
    price: '',
    instructor: '',
    startDate: '',
    maxStudents: '',
    mode: 'online',
    status: 'draft',
    prerequisites: [''],
    learningOutcomes: [''],
    syllabus: [{ module: '', topics: [''] }]
  });

  const handleInputChange = (field: string, value: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSyllabusChange = (moduleIndex: number, field: string, value: string | string[], topicIndex?: number) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) => {
        if (i === moduleIndex) {
          if (field === 'module') {
            return { ...module, module: value as string };
          } else if (field === 'topics' && topicIndex !== undefined) {
            return {
              ...module,
              topics: module.topics.map((topic, j) => 
                j === topicIndex ? value as string : topic
              )
            };
          }
        }
        return module;
      })
    }));
  };

  const addSyllabusModule = () => {
    setCourseData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, { module: '', topics: [''] }]
    }));
  };

  const addSyllabusTopic = (moduleIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) => 
        i === moduleIndex 
          ? { ...module, topics: [...module.topics, ''] }
          : module
      )
    }));
  };

  const removeSyllabusModule = (moduleIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== moduleIndex)
    }));
  };

  const removeSyllabusTopic = (moduleIndex: number, topicIndex: number) => {
    setCourseData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((module, i) => 
        i === moduleIndex 
          ? { ...module, topics: module.topics.filter((_, j) => j !== topicIndex) }
          : module
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Course data:', courseData);
    // Here you would typically send the data to your backend
    alert('Course created successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Create New Course
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details to create a new training course.
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
              form="course-form"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green transition-colors duration-200"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Course
            </button>
          </div>
        </div>

        {/* Course form */}
        <form id="course-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={courseData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm rounded-md"
                    value={courseData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="">Select Category</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Programming">Programming</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    required
                    className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={courseData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Course Details</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration *
                  </label>
                  <input
                    type="text"
                    id="duration"
                    required
                    placeholder="e.g., 6 weeks"
                    className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={courseData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price *
                  </label>
                  <input
                    type="text"
                    id="price"
                    required
                    placeholder="e.g., ₹15,000"
                    className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={courseData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700">
                    Max Students
                  </label>
                  <input
                    type="number"
                    id="maxStudents"
                    className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={courseData.maxStudents}
                    onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    id="instructor"
                    required
                    className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={courseData.instructor}
                    onChange={(e) => handleInputChange('instructor', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    required
                    className="mt-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={courseData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
                    Mode *
                  </label>
                  <select
                    id="mode"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm rounded-md"
                    value={courseData.mode}
                    onChange={(e) => handleInputChange('mode', e.target.value)}
                  >
                    <option value="online">Online</option>
                    <option value="classroom">Classroom</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Prerequisites</h3>
              {courseData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter prerequisite"
                    className="flex-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={prerequisite}
                    onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('prerequisites', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('prerequisites')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Prerequisite
              </button>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Learning Outcomes</h3>
              {courseData.learningOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter learning outcome"
                    className="flex-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={outcome}
                    onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('learningOutcomes', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('learningOutcomes')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Learning Outcome
              </button>
            </div>
          </div>

          {/* Syllabus */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Course Syllabus</h3>
              {courseData.syllabus.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      placeholder="Module name"
                      className="flex-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md mr-2"
                      value={module.module}
                      onChange={(e) => handleSyllabusChange(moduleIndex, 'module', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeSyllabusModule(moduleIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {module.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center space-x-2 mb-2 ml-4">
                      <input
                        type="text"
                        placeholder="Topic"
                        className="flex-1 focus:ring-primary-green focus:border-primary-green block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={topic}
                        onChange={(e) => handleSyllabusChange(moduleIndex, 'topics', e.target.value, topicIndex)}
                      />
                      <button
                        type="button"
                        onClick={() => removeSyllabusTopic(moduleIndex, topicIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSyllabusTopic(moduleIndex)}
                    className="ml-4 inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Topic
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSyllabusModule}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Module
              </button>
            </div>
          </div>

          {/* Course Status */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Course Status</h3>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="status"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm rounded-md"
                  value={courseData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateCoursePage;

