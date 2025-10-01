'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Award, CreditCard, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { backendAPI } from '@/lib/backend-api';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { useToast } from '@/hooks/use-toast';
import EnrollModal from './EnrollModal';

interface Course {
  courseid: string;
  coursetitle?: string;
  courseshortform?: string;
  batches: Batch[];
}

interface Batch {
  batchid: string;
  startdate: string;
  enddate: string;
  timing: string;
  capacity: number;
  enrolled: number;
}

const CourseEnrollment = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const { user, isAuthenticated } = useBackendAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await backendAPI.getCourseAndBatchDetails();
      if (response.success && response.details) {
        setCourses(response.details);
      } else {
        throw new Error(response.error || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollClick = (course: Course, batch: Batch) => {
    setSelectedCourse(course);
    setSelectedBatch(batch);
    setShowEnrollModal(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const calculateSeatsLeft = (capacity: number, enrolled: number) => {
    const seatsLeft = Number(capacity || 0) - Number(enrolled || 0);
    return Math.max(0, seatsLeft);
  };

  const isBatchFull = (capacity: number, enrolled: number) => {
    return Number(enrolled || 0) >= Number(capacity || 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg font-semibold text-blue-900">Loading courses...</span>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses available</h3>
        <p className="text-gray-500">Please check back later for new course offerings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 px-4 md:px-8 max-w-5xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-4">
          Available Courses
        </h2>
        <p className="text-gray-700 text-lg">Choose from our comprehensive cloud training programs</p>
      </div>

      {/* User Authentication Status */}
      {!isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-center">
            <strong>Note:</strong> You can browse courses as a guest, but you'll need to provide your details during enrollment.
          </p>
        </div>
      )}

      {/* Courses Accordion */}
      <div className="space-y-4">
        {courses.map((course) => {
          const isOpen = openCourse === course.courseid;
          return (
            <div
              key={course.courseid}
              className="border rounded-2xl shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
            >
              {/* Accordion Header */}
              <button
                onClick={() => setOpenCourse(isOpen ? null : course.courseid)}
                className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-t-2xl hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="text-2xl font-bold text-blue-600">{course.coursetitle}</h3>
                  <p className="text-lg text-cyan-700 font-medium">
                    Course ID: <span className="text-xl font-semibold">{course.courseid}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {course.batches?.length || 0} batch{course.batches?.length !== 1 ? 'es' : ''} available
                  </p>
                </div>
                <div className="flex items-center">
                  {isOpen ? (
                    <ChevronUp className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
                  {course.batches && course.batches.length > 0 ? (
                    course.batches.map((batch) => {
                      const seatsLeft = calculateSeatsLeft(batch.capacity, batch.enrolled);
                      const isFullBatch = isBatchFull(batch.capacity, batch.enrolled);
                      
                      return (
                        <div
                          key={batch.batchid}
                          className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-3"
                        >
                          <div className="flex justify-between items-center">
                            <p className="text-blue-600 font-semibold text-lg">Batch {batch.batchid}</p>
                            <p
                              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                isFullBatch
                                  ? 'bg-red-100 text-red-700'
                                  : seatsLeft <= 5
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {batch.enrolled}/{batch.capacity} seats
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center text-blue-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>
                                {formatDate(batch.startdate)} → {formatDate(batch.enddate)}
                              </span>
                            </div>
                            <div className="flex items-center text-purple-600">
                              <Clock className="w-4 h-4 mr-2" />
                              <span>{batch.timing || 'Timing not available'}</span>
                            </div>
                            <div className="flex items-center text-green-600">
                              <Users className="w-4 h-4 mr-2" />
                              <span>
                                {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Batch full'}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-4">
                            <Button
                              onClick={() => handleEnrollClick(course, batch)}
                              disabled={isFullBatch}
                              className={`flex-1 ${
                                isFullBatch
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                              } text-white transition-all duration-300`}
                              size="sm"
                            >
                              <Award className="h-4 w-4 mr-2" />
                              {isFullBatch ? 'Batch Full' : 'Enroll Now'}
                            </Button>

                            {seatsLeft <= 5 && seatsLeft > 0 && (
                              <div className="flex items-center text-orange-600 text-xs font-medium">
                                ⚡ Only {seatsLeft} seats left!
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <p>No batches available for this course at the moment.</p>
                      <p className="text-sm mt-1">Please check back later or contact us for updates.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && selectedCourse && selectedBatch && (
        <EnrollModal
          isOpen={showEnrollModal}
          onClose={() => {
            setShowEnrollModal(false);
            setSelectedCourse(null);
            setSelectedBatch(null);
          }}
          course={{
            courseid: selectedCourse.courseid,
            coursetitle: selectedCourse.coursetitle || '',
            courseshortform: selectedCourse.courseshortform || ''
          }}
          batch={selectedBatch}
          onEnrollmentSuccess={() => {
            // Refresh courses to update enrollment numbers
            fetchCourses();
          }}
        />
      )}
    </div>
  );
};

export default CourseEnrollment;
