import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { backendAPI } from '@/lib/backend-api';
import { MessageCircle, Clock, Loader2, Phone, Mail, User, BookOpen, Calendar, CheckCircle, Star, CalendarDays } from 'lucide-react';

interface CounselorModalProps {
  children: React.ReactNode;
}

const CounselorModal = ({ children }: CounselorModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [counselingData, setCounselingData] = useState({
    name: '',
    email: '',
    phone: '',
    course_interest: '',
    preferred_time: '',
    message: '',
  });

  const { toast } = useToast();

  const handleSubmit = async () => {
    // Validate required fields
    if (!counselingData.name || !counselingData.email || !counselingData.phone) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Email, Phone).",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(counselingData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(counselingData.phone)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await backendAPI.requestCounseling(counselingData);
      
      if (response.success) {
        toast({
          title: "Request Submitted!",
          description: response.message || "Our counselor will contact you within 24 hours.",
        });
        setIsOpen(false);
        resetForm();
      } else {
        throw new Error(response.error || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Counseling request error:', error);
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    // Validate required fields
    if (!counselingData.name || !counselingData.email || !counselingData.phone) {
      toast({
        title: "Validation Error", 
        description: "Please fill in all required fields to book an appointment.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Add appointment flag to the data
      const appointmentData = {
        ...counselingData,
        request_type: 'appointment',
        message: counselingData.message + ' [APPOINTMENT REQUEST]'
      };

      const response = await backendAPI.requestCounseling(appointmentData);
      
      if (response.success) {
        toast({
          title: "Appointment Request Submitted!",
          description: "We'll send you available time slots within 2 hours via email/WhatsApp.",
        });
        setIsOpen(false);
        resetForm();
      } else {
        throw new Error(response.error || 'Failed to submit appointment request');
      }
    } catch (error) {
      console.error('Appointment request error:', error);
      toast({
        title: "Appointment Request Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCounselingData({
      name: '',
      email: '',
      phone: '',
      course_interest: '',
      preferred_time: '',
      message: '',
    });
  };

  const isFormValid = counselingData.name && counselingData.email && counselingData.phone;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl w-full max-h-[95vh] overflow-hidden bg-white rounded-3xl shadow-2xl border-0 p-0">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-green-600/20"></div>
          <div className="relative z-10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-2xl font-bold">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black">Talk to Expert Counselor</div>
                  <div className="text-blue-100 text-sm font-normal mt-1">Get personalized career guidance - 100% Free</div>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {/* Enhanced Trust Indicators */}
            <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="flex flex-wrap items-center justify-center gap-6 text-white">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="font-bold">Free Consultation</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span className="font-bold">Expert Guidance</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl">
                  <Clock className="h-5 w-5 text-blue-300" />
                  <span className="font-bold">24hr Response</span>
                </div>
              </div>
              <div className="text-center mt-2 text-white/80 text-sm font-medium">
                🎯 Trusted by 1000+ students • 💼 100% placement assistance
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white space-y-6 max-h-[60vh] overflow-y-auto counselor-scrollbar">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="counselor-name" className="text-gray-800 font-semibold text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="counselor-name"
              value={counselingData.name}
              onChange={(e) => setCounselingData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
              className="h-12 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="counselor-email" className="text-gray-800 font-semibold text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-green-600" />
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="counselor-email"
              type="email"
              value={counselingData.email}
              onChange={(e) => setCounselingData(prev => ({ ...prev, email: e.target.value.toLowerCase() }))}
              placeholder="Enter your email address"
              required
              className="h-12 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all duration-300 text-gray-800 placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="counselor-phone" className="text-gray-800 font-semibold text-sm flex items-center gap-2">
              <Phone className="h-4 w-4 text-purple-600" />
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="counselor-phone"
              value={counselingData.phone}
              onChange={(e) => setCounselingData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
              required
              className="h-12 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 text-gray-800 placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>

          {/* Course Interest Field */}
          <div className="space-y-2">
            <Label htmlFor="course-interest" className="text-gray-800 font-semibold text-sm flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-orange-600" />
              Course Interest
            </Label>
            <Select
              value={counselingData.course_interest}
              onValueChange={(value) => setCounselingData(prev => ({ ...prev, course_interest: value }))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-12 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all duration-300 text-gray-800">
                <SelectValue placeholder="Select your course of interest" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-xl">
                <SelectItem value="aws-solution-architect" className="h-12 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    AWS Solution Architect Associate
                  </div>
                </SelectItem>
                <SelectItem value="azure-administrator" className="h-12 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Azure Administrator Associate
                  </div>
                </SelectItem>
                <SelectItem value="google-cloud-associate" className="h-12 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Google Cloud Associate
                  </div>
                </SelectItem>
                <SelectItem value="devops-multicloud" className="h-12 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    DevOps with Multi-Cloud
                  </div>
                </SelectItem>
                <SelectItem value="devsecops-multicloud" className="h-12 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    DevSecOps with Multi-Cloud
                  </div>
                </SelectItem>
                <SelectItem value="kubernetes-multicloud" className="h-12 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    Kubernetes with Multi-Cloud
                  </div>
                </SelectItem>
                <SelectItem value="ai-professional" className="h-12 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                    AI Professional Program
                  </div>
                </SelectItem>
                <SelectItem value="other" className="h-12 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Other / Not Sure
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Time Field */}
          <div className="space-y-2">
            <Label htmlFor="preferred-time" className="text-gray-800 font-semibold text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Preferred Call Time
            </Label>
            <Select
              value={counselingData.preferred_time}
              onValueChange={(value) => setCounselingData(prev => ({ ...prev, preferred_time: value }))}
              disabled={isLoading}
            >
              <SelectTrigger className="h-12 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 text-gray-800">
                <SelectValue placeholder="When should we call you?" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-xl">
                <SelectItem value="morning" className="h-11 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      🌅
                    </div>
                    <div>
                      <div className="font-medium">Morning</div>
                      <div className="text-xs text-gray-500">9:00 AM - 12:00 PM</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="afternoon" className="h-11 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      ☀️
                    </div>
                    <div>
                      <div className="font-medium">Afternoon</div>
                      <div className="text-xs text-gray-500">12:00 PM - 5:00 PM</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="evening" className="h-11 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      🌆
                    </div>
                    <div>
                      <div className="font-medium">Evening</div>
                      <div className="text-xs text-gray-500">5:00 PM - 8:00 PM</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="anytime" className="h-11 text-sm hover:bg-blue-50 focus:bg-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      ⏰
                    </div>
                    <div>
                      <div className="font-medium">Anytime</div>
                      <div className="text-xs text-gray-500">Flexible timing</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="counselor-message" className="text-gray-800 font-semibold text-sm flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-cyan-600" />
              Additional Message (Optional)
            </Label>
            <Textarea
              id="counselor-message"
              value={counselingData.message}
              onChange={(e) => setCounselingData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tell us about your career goals, experience level, or any specific questions..."
              rows={4}
              className="bg-white border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all duration-300 text-gray-800 placeholder:text-gray-400 resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Enhanced Info Box */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-green-50 border-2 border-blue-300 p-6 rounded-2xl shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-gray-900 mb-2 text-lg flex items-center gap-2">
                  💯 Free Career Counseling
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">100% FREE</span>
                </h4>
                <p className="text-gray-800 leading-relaxed font-medium mb-3">
                  Our cloud experts will help you choose the right career path, certification roadmap, and provide 
                  personalized guidance to accelerate your cloud journey. 
                </p>
                <div className="mb-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays className="h-4 w-4 text-purple-600" />
                    <span className="font-bold text-purple-800 text-sm">Two Options Available:</span>
                  </div>
                  <div className="text-sm text-purple-700 space-y-1">
                    <div>📞 <strong>Quick Callback:</strong> We call you at your convenience</div>
                    <div>📅 <strong>Scheduled Appointment:</strong> Book specific date & time slots</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">No Cost</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">No Commitment</span>
                  <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">Expert Guidance</span>
                  <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full">Flexible Timing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Premium Footer */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-blue-200">
          {/* Action Buttons */}
          <div className="space-y-4 mb-4">
            {/* Primary Actions Row */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold transition-all duration-300"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleSubmit}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-5 w-5" />
                    Request Free Callback
                  </>
                )}
              </Button>
            </div>

            {/* Secondary Action - Book Appointment */}
            <div className="relative">
              <div className="absolute inset-x-0 top-0 flex justify-center">
                <span className="bg-white px-3 py-1 text-xs font-medium text-gray-500 rounded-full border">
                  OR
                </span>
              </div>
              <div className="pt-3">
                <Button
                  variant="outline"
                  className="w-full h-12 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  onClick={handleBookAppointment}
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Booking Appointment...
                    </>
                  ) : (
                    <>
                      <CalendarDays className="mr-2 h-5 w-5" />
                      📅 Book Specific Appointment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Bottom Information */}
          <div className="p-4 bg-white rounded-2xl border-2 border-blue-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-2 text-green-700">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                <span>✅ Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                <span>📞 Callback & 📅 Appointments</span>
              </div>
              <div className="flex items-center gap-2 text-purple-700">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg"></div>
                <span>🔒 Privacy Protected</span>
              </div>
            </div>
            <div className="text-center mt-3 text-sm text-gray-700 font-semibold">
              🎯 Join 1000+ students who got personalized career guidance
            </div>
            <div className="text-center mt-2 text-xs text-gray-600 bg-yellow-50 px-3 py-1 rounded-full inline-block">
              💡 Choose callback for quick response or book appointment for specific timing
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CounselorModal;
