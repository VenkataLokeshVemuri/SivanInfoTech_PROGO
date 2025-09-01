
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Award, CreditCard } from 'lucide-react';
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
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiService.getCourseAndBatchDetails();
      if (response.status === 200) {
        setCourses(response.details);
      }
    } catch (error) {
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
    return <div className="flex justify-center p-8">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Courses</h2>
        <p className="text-gray-600">Choose from our comprehensive cloud training programs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.courseid} className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">{course.coursetitle}</CardTitle>
              <CardDescription>Course ID: {course.courseid}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Available Batches:</h4>
                {course.batches.map((batch) => (
                  <div key={batch.batchid} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Batch {batch.batchid}</Badge>
                      <Badge className={batch.enrolled >= batch.capacity ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                        {batch.enrolled}/{batch.capacity} seats
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {batch.startdate} - {batch.enddate}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {batch.timing}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        Available seats: {batch.capacity - batch.enrolled}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEnroll(course, batch)}
                        disabled={batch.enrolled >= batch.capacity || enrolling === `${course.courseid}-${batch.batchid}`}
                        className="flex-1"
                        size="sm"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        {enrolling === `${course.courseid}-${batch.batchid}` ? 'Enrolling...' : 'Enroll'}
                      </Button>
                      <Button
                        onClick={() => handlePayment(5000, 'user123')}
                        variant="outline"
                        size="sm"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseEnrollment;
