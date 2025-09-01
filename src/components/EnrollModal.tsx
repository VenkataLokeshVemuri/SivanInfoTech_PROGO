import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { backendAPI } from '@/lib/backend-api';
import { ArrowRight, CreditCard } from 'lucide-react';

interface EnrollModalProps {
  courseId?: string;
  courseName?: string;
  coursePrice?: number;
  children: React.ReactNode;
}

const EnrollModal = ({ courseId, courseName, coursePrice, children }: EnrollModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [enrollmentData, setEnrollmentData] = useState({
    name: '',
    email: '',
    phone: '',
    course_interest: courseName || '',
  });

  const { user, isAuthenticated } = useBackendAuth();
  const { toast } = useToast();

  const handleEnrollment = async () => {
    setIsLoading(true);
    
    try {
      if (!isAuthenticated) {
        // For non-authenticated users, submit inquiry
        const response = await backendAPI.submitInquiry({
          name: enrollmentData.name,
          email: enrollmentData.email,
          phone: enrollmentData.phone,
          message: `I am interested in enrolling for ${courseName}`,
          course_interest: courseName,
        });

        if (response.success) {
          toast({
            title: "Inquiry Submitted!",
            description: "We will contact you soon with enrollment details.",
          });
          setIsOpen(false);
        } else {
          throw new Error(response.error || 'Failed to submit inquiry');
        }
      } else {
        // For authenticated users, proceed with enrollment and payment
        if (courseId && coursePrice) {
          const paymentResponse = await backendAPI.initiatePayment({
            course_id: courseId,
            batch_id: selectedBatch || undefined,
            amount: coursePrice,
          });

          if (paymentResponse.success && paymentResponse.data?.payment_url) {
            // Open payment page in new tab
            window.open(paymentResponse.data.payment_url, '_blank');
            toast({
              title: "Payment Initiated",
              description: "Complete your payment to confirm enrollment.",
            });
            setIsOpen(false);
          } else {
            throw new Error(paymentResponse.error || 'Failed to initiate payment');
          }
        } else {
          // Submit enrollment request without payment
          const response = await backendAPI.enrollInCourse(courseId || '', selectedBatch);
          
          if (response.success) {
            toast({
              title: "Enrollment Successful!",
              description: "You have been enrolled in the course.",
            });
            setIsOpen(false);
          } else {
            throw new Error(response.error || 'Failed to enroll');
          }
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                />
              </div>
            </>
          )}

          {isAuthenticated && (
            <div className="space-y-2">
              <Label htmlFor="batch">Select Batch (Optional)</Label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning Batch (9:00 AM - 12:00 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon Batch (2:00 PM - 5:00 PM)</SelectItem>
                  <SelectItem value="evening">Evening Batch (6:00 PM - 9:00 PM)</SelectItem>
                  <SelectItem value="weekend">Weekend Batch (Sat-Sun)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {coursePrice && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Course Fee:</span>
                <span className="text-lg font-bold text-primary">₹{coursePrice.toLocaleString()}</span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleEnrollment}
              disabled={isLoading || (!isAuthenticated && (!enrollmentData.name || !enrollmentData.email || !enrollmentData.phone))}
            >
              {isLoading ? (
                "Processing..."
              ) : isAuthenticated ? (
                <>
                  {coursePrice ? "Pay & Enroll" : "Enroll Now"}
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