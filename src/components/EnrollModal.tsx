import { useState, useEffect, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useBackendAuth } from "@/hooks/useBackendAuth";
import { backendAPI } from "@/lib/backend-api";
import { ArrowRight, CreditCard, Loader2 } from "lucide-react";

interface EnrollModalProps {
  // Controlled modal props (optional) — if omitted, component works as an uncontrolled Dialog trigger
  isOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  // Preferred new API: pass a course object
  course?: {
    courseid: string;
    coursetitle?: string;
    courseshortform?: string;
    price?: number;
  };
  // Legacy/shortcut props accepted for backward compatibility
  courseId?: string;
  courseName?: string;
  coursePrice?: number;

  batch?: any;
  onEnrollmentSuccess?: () => void;
}

interface BatchOption {
  batchId: string;
  batchName: string;
  startdate: string;
  enddate: string;
  maxStudents?: number;
  enrolledStudents?: number;
}

const EnrollModal = ({
  isOpen,
  onClose,
  children,
  course,
  batch,
  onEnrollmentSuccess,
}: EnrollModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchOption | null>(null);
  const [availableBatches, setAvailableBatches] = useState<BatchOption[]>([]);
  const [enrollmentData, setEnrollmentData] = useState({
    name: "",
    email: "",
    phone: "",
    course_interest: course?.coursetitle || course?.courseshortform || "",
  });

  const { user, isAuthenticated } = useBackendAuth();
  const { toast } = useToast();

  // Support controlled or uncontrolled usage
  const [internalOpen, setInternalOpen] = useState(false);
  const dialogOpen = typeof isOpen === "boolean" ? isOpen : internalOpen;
  const handleDialogOpenChange = (next: boolean) => {
    if (typeof isOpen === "boolean") {
      // controlled by parent; when it closes notify parent via onClose
      if (!next) onClose?.();
    } else {
      setInternalOpen(next);
      if (!next) onClose?.();
    }
  };
  const closeDialog = () => {
    if (typeof isOpen === "boolean") {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  // prefer structured `course` prop, fall back to legacy props passed as top-level props
  const derivedCourseId = course?.courseid || ({} as any).courseId;
  const derivedCourseName =
    course?.coursetitle ||
    course?.courseshortform ||
    ({} as any).courseName ||
    "";
  const derivedCourseShortForm =
    course?.courseshortform || ({} as any).courseName;
  const derivedCoursePrice = course?.price ?? ({} as any).coursePrice;

  const loadBatches = async (courseId?: string) => {
    if (!courseId) return;
    try {
      const response = await backendAPI.getCourseAndBatchDetails();
      if (response.success && response.data?.details) {
        const courseData = response.data.details.find(
          (c: any) => c.courseid === courseId
        );
        if (courseData?.batches) {
          setAvailableBatches(courseData.batches);
        }
      }
    } catch (error) {
      console.error("Error loading batches:", error);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      loadBatches(derivedCourseId || undefined);
      setEnrollmentData((prev) => ({
        ...prev,
        course_interest:
          course?.coursetitle ||
          course?.courseshortform ||
          ({} as any).courseName ||
          "",
      }));
    }
  }, [dialogOpen, course]);

  // Note: dialog open/close is handled by `handleDialogOpenChange`/`closeDialog` above

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
          message: `I am interested in enrolling for ${derivedCourseName}. Please contact me with enrollment details.`,
        };

        const response = await backendAPI.submitInquiry(inquiryData);

        if (response.success) {
          toast({
            title: "Inquiry Submitted!",
            description: "We will contact you soon with enrollment details.",
          });
          closeDialog();
          resetForm();
        } else {
          throw new Error(response.error || "Failed to submit inquiry");
        }
      } else {
        // For authenticated users, proceed with enrollment
        if (!derivedCourseId || !derivedCourseName || !derivedCourseShortForm) {
          throw new Error("Course information is missing");
        }

        const enrollmentRequestData = {
          courseid: derivedCourseId,
          courseshortform: derivedCourseShortForm,
          coursetitle: derivedCourseName,
          batchtoenroll: selectedBatch || {
            batchId: "default",
            batchName: "Standard Batch",
            startdate: new Date().toISOString().split("T")[0],
            enddate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
          },
        };

        const enrollResponse = await backendAPI.enrollInCourse(
          enrollmentRequestData
        );

        if (enrollResponse.success) {
          if (derivedCoursePrice && derivedCoursePrice > 0) {
            // Initiate payment for paid courses
            const paymentData = {
              amount: derivedCoursePrice,
              user_id: user?.email || "guest",
            };

            const paymentResponse = await backendAPI.initiatePayment(
              paymentData
            );

            if (paymentResponse.success && paymentResponse.data?.pay_page_url) {
              // Open payment page in new tab
              window.open(paymentResponse.data.pay_page_url, "_blank");
              toast({
                title: "Enrollment Initiated",
                description: "Complete your payment to confirm enrollment.",
              });
              closeDialog();
              resetForm();
              onEnrollmentSuccess?.();
            } else {
              throw new Error(
                paymentResponse.error || "Failed to initiate payment"
              );
            }
          } else {
            // Free course enrollment
            toast({
              title: "Enrollment Successful!",
              description: `You have been enrolled in ${derivedCourseName}. Enrollment ID: ${enrollResponse.data?.EnrollmentID}`,
            });
            closeDialog();
            resetForm();
            onEnrollmentSuccess?.();
          }
        } else {
          throw new Error(enrollResponse.error || "Failed to enroll");
        }
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast({
        title: "Enrollment Failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEnrollmentData({
      name: "",
      email: "",
      phone: "",
      course_interest:
        course?.coursetitle ||
        course?.courseshortform ||
        ({} as any).courseName ||
        "",
    });
    setSelectedBatch(null);
  };

  const isFormValid = () => {
    if (!isAuthenticated) {
      return Boolean(
        enrollmentData.name && enrollmentData.email && enrollmentData.phone
      );
    }
    return true; // For authenticated users, basic validation is sufficient
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Enroll in {derivedCourseName}
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
                  onChange={(e) =>
                    setEnrollmentData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setEnrollmentData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setEnrollmentData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
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
                value={selectedBatch?.batchId || ""}
                onValueChange={(value) => {
                  const batch = availableBatches.find(
                    (b) => b.batchId === value
                  );
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

          {derivedCoursePrice && derivedCoursePrice > 0 && (
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Course Fee:</span>
                <span className="text-lg font-bold text-primary">
                  ₹{derivedCoursePrice.toLocaleString()}
                </span>
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
                <strong>Note:</strong> Please sign up or log in to complete
                enrollment directly. We&apos;ll contact you with enrollment
                details shortly.
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1 transition-colors duration-300"
              onClick={() => closeDialog()}
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
                  {derivedCoursePrice && derivedCoursePrice > 0
                    ? "Pay & Enroll"
                    : "Enroll Now"}
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
