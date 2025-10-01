import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { backendAPI } from '@/lib/backend-api';
import { ArrowRight, CreditCard, Loader2 } from 'lucide-react';

interface EnrollModalProps {
  courseId?: string;
  courseName?: string;
  coursePrice?: number;
  courseShortForm?: string;
  children: React.ReactNode;
}

interface BatchOption {
  batchId: string;
  batchName: string;
  startdate: string;
  enddate: string;
  maxStudents?: number;
  enrolledStudents?: number;
}

const EnrollModal = ({ courseId, courseName, coursePrice, courseShortForm, children }: EnrollModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchOption | null>(null);
  const [availableBatches, setAvailableBatches] = useState<BatchOption[]>([]);
  const [enrollmentData, setEnrollmentData] = useState({
    name: '',
    email: '',
    phone: '',
    course_interest: courseName || '',
  });

  const { user, isAuthenticated } = useBackendAuth();
  const { toast } = useToast();

  // Load available batches when modal opens
  const handleModalOpen = async (open: boolean) => {
    setIsOpen(open);
    
    if (open && courseId) {
      try {
        const response = await backendAPI.getCourseAndBatchDetails();
        if (response.success && response.data?.details) {
          const courseData = response.data.details.find((course: any) => course.courseid === courseId);
          if (courseData?.batches) {
            setAvailableBatches(courseData.batches);
          }
        }
      } catch (error) {
        console.error('Error loading batches:', error);
      }
    }
  };

  const handleEnrollment = async () => {
    setIsLoading(true);
    
    try {
      if (!isAuthenticated) {
        // For non-authenticated users, submit inquiry
        const inquiryData = {
          name: enrollmentData.name,
          email: enrollmentData.email,
          phone: enrollmentData.phone,
          course: enrollmentData.course_interest,
          message: `I am interested in enrolling for ${courseName}. Please contact me with enrollment details.`,
        };

        const response = await backendAPI.submitInquiry(inquiryData);

        if (response.success) {
          toast({
            title: "Inquiry Submitted!",
            description: "We will contact you soon with enrollment details.",
          });
          setIsOpen(false);
          resetForm();
        } else {
          throw new Error(response.error || 'Failed to submit inquiry');
        }
      } else {
        // For authenticated users, proceed with enrollment
        if (!courseId || !courseName || !courseShortForm) {
          throw new Error('Course information is missing');
        }

        const enrollmentRequestData = {
          courseid: courseId,
          courseshortform: courseShortForm,
          coursetitle: courseName,
          batchtoenroll: selectedBatch || {
            batchId: 'default',
            batchName: 'Standard Batch',
            startdate: new Date().toISOString().split('T')[0],
            enddate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
        };

        const enrollResponse = await backendAPI.enrollInCourse(enrollmentRequestData);

        if (enrollResponse.success) {
          if (coursePrice && coursePrice > 0) {
            // Initiate payment for paid courses
            const paymentData = {
              amount: coursePrice,
              user_id: user?.email || 'guest',
            };

            const paymentResponse = await backendAPI.initiatePayment(paymentData);

            if (paymentResponse.success && paymentResponse.data?.pay_page_url) {
              // Open payment page in new tab
              window.open(paymentResponse.data.pay_page_url, '_blank');
              toast({
                title: "Enrollment Initiated",
                description: "Complete your payment to confirm enrollment.",
              });
              setIsOpen(false);
              resetForm();
            } else {
              throw new Error(paymentResponse.error || 'Failed to initiate payment');
            }
          } else {
            // Free course enrollment
            toast({
              title: "Enrollment Successful!",
              description: `You have been enrolled in ${courseName}. Enrollment ID: ${enrollResponse.data?.EnrollmentID}`,
            });
            setIsOpen(false);
            resetForm();
          }
        } else {
          throw new Error(enrollResponse.error || 'Failed to enroll');
        }
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEnrollmentData({
      name: '',
      email: '',
      phone: '',
      course_interest: courseName || '',
    });
    setSelectedBatch(null);
  };

  const isFormValid = () => {
    if (!isAuthenticated) {
      return enrollmentData.name && enrollmentData.email && enrollmentData.phone;
    }
    return true; // For authenticated users, basic validation is sufficient
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Enroll in {courseName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isAuthenticated && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={enrollmentData.name}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={enrollmentData.email}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={enrollmentData.phone}
                  onChange={(e) => setEnrollmentData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter your phone number"
                  required
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          {isAuthenticated && availableBatches.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="batch">Select Batch (Optional)</Label>
              <Select 
                value={selectedBatch?.batchId || ''} 
                onValueChange={(value) => {
                  const batch = availableBatches.find(b => b.batchId === value);
                  setSelectedBatch(batch || null);
                }}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a batch" />
                </SelectTrigger>
                <SelectContent>
                  {availableBatches.map((batch) => (
                    <SelectItem key={batch.batchId} value={batch.batchId}>
                      <div className="flex flex-col">
                        <span>{batch.batchName}</span>
                        <span className="text-sm text-gray-500">
                          {batch.startdate} to {batch.enddate}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {coursePrice && coursePrice > 0 && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Course Fee:</span>
                <span className="text-lg font-bold text-primary">₹{coursePrice.toLocaleString()}</span>
              </div>
              {isAuthenticated && (
                <p className="text-sm text-gray-600 mt-1">
                  You will be redirected to the payment page after enrollment.
                </p>
              )}
            </div>
          )}

          {!isAuthenticated && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Please sign up or log in to complete enrollment directly. 
                We&apos;ll contact you with enrollment details shortly.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1 transition-colors duration-300"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              onClick={handleEnrollment}
              disabled={isLoading || !isFormValid()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isAuthenticated ? (
                <>
                  {coursePrice && coursePrice > 0 ? "Pay & Enroll" : "Enroll Now"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "Submit Inquiry"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollModal;