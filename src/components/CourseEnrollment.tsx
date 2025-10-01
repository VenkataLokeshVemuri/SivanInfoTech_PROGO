'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Award, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [openCourse, setOpenCourse] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses...');
      const response = await apiService.getCourseAndBatchDetails();
      console.log('API Response:', response);
      
      if (response.status === 200) {
        setCourses(response.details);
        console.log('Courses set:', response.details);
      } else {
        throw new Error(response.Message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course: Course, batch: Batch) => {
    setEnrolling(`${course.courseid}-${batch.batchid}`);
    try {
      const response = await apiService.enroll({
        courseid: course.courseid,
        courseshortform: course.courseshortform || '',
        coursetitle: course.coursetitle || '',
        batchtoenroll: batch,
      });

      if (response.status === 200) {
        toast({
          title: "Enrollment Successful",
          description: `Enrollment ID: ${response.EnrollmentID}`,
        });
      } else {
        throw new Error(response.Message);
      }
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setEnrolling(null);
    }
  };

  const handlePayment = async (amount: number, userId: string) => {
    try {
      const response = await apiService.initiatePayment(amount, userId);
      if (response.pay_page_url) {
        window.location.href = response.pay_page_url;
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to process payment",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8 text-lg font-semibold">Loading courses...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-gray-600 mb-4">No courses available</h3>
        <p className="text-gray-500">Please check back later or contact support.</p>
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

      {/* Accordion for courses */}
      <div className="space-y-4">
        {courses.map((course) => {
          const isOpen = openCourse === course.courseid;
          return (
            <div
              key={course.courseid}
              className="border rounded-2xl shadow-md bg-white hover:shadow-lg transition"
            >
              {/* Accordion Header */}
              <button
                onClick={() => setOpenCourse(isOpen ? null : course.courseid)}
                className="flex justify-between items-center w-full px-6 py-4 text-left focus:outline-none"
              >
                <div>
                  <h3 className="text-2xl font-bold text-blue-600">{course.coursetitle}</h3>
                  <p className="text-lg text-cyan-700 font-medium">
                    Course ID: <span className="text-xl font-semibold">{course.courseid}</span>
                  </p>
                </div>
                <div>{isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}</div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div className="px-6 pb-6 space-y-4">
                  {course.batches.map((batch) => (
                    <div
                      key={batch.batchid}
                      className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-center">
                        <p className="text-blue-600 font-semibold">Batch {batch.batchid}</p>
                        <p
                          className={`px-2 py-1 text-sm font-semibold rounded ${
                            batch.enrolled >= batch.capacity
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {batch.enrolled}/{batch.capacity} seats
                        </p>
                      </div>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center text-blue-600">
                          <Calendar className="w-4 h-4 mr-1" /> {batch.startdate} → {batch.enddate}
                        </div>
                        <div className="flex items-center text-purple-600">
                          <Clock className="w-4 h-4 mr-1" /> {batch.timing || 'Timing not available'}
                        </div>
                        <div className="flex items-center text-green-600">
                          <Users className="w-4 h-4 mr-1" /> Seats left: {Number(batch.capacity || 0) - Number(batch.enrolled || 0)}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {/* Enroll Button updated */}
                        <Button
                          onClick={() => handleEnroll(course, batch)}
                          disabled={batch.enrolled >= batch.capacity || enrolling === `${course.courseid}-${batch.batchid}`}
                          className="w-56 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-green-500 hover:to-green-400 text-white hover:opacity-90"
                          size="sm"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          {enrolling === `${course.courseid}-${batch.batchid}` ? 'Enrolling...' : 'Enroll'}
                        </Button>

                        <Button
                          onClick={() => handlePayment(5000, 'user123')}
                          variant="outline"
                          size="sm"
                          className="flex items-center hover:bg-gray-200 text-blue-600 border-blue-400"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseEnrollment;
