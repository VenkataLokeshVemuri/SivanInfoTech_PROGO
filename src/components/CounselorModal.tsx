import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { backendAPI } from '@/lib/backend-api';
import { MessageCircle, Clock } from 'lucide-react';

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
    setIsLoading(true);
    
    try {
      const response = await backendAPI.requestCounseling(counselingData);
      
      if (response.success) {
        toast({
          title: "Request Submitted!",
          description: "Our counselor will contact you within 24 hours.",
        });
        setIsOpen(false);
        // Reset form
        setCounselingData({
          name: '',
          email: '',
          phone: '',
          course_interest: '',
          preferred_time: '',
          message: '',
        });
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

  const isFormValid = counselingData.name && counselingData.email && counselingData.phone;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Talk to Counselor
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="counselor-name">Full Name *</Label>
            <Input
              id="counselor-name"
              value={counselingData.name}
              onChange={(e) => setCounselingData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="counselor-email">Email *</Label>
            <Input
              id="counselor-email"
              type="email"
              value={counselingData.email}
              onChange={(e) => setCounselingData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="counselor-phone">Phone Number *</Label>
            <Input
              id="counselor-phone"
              value={counselingData.phone}
              onChange={(e) => setCounselingData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-interest">Course Interest</Label>
            <Select 
              value={counselingData.course_interest} 
              onValueChange={(value) => setCounselingData(prev => ({ ...prev, course_interest: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course of interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aws-cloud-practitioner">AWS Cloud Practitioner</SelectItem>
                <SelectItem value="aws-solutions-architect">AWS Solutions Architect</SelectItem>
                <SelectItem value="aws-developer">AWS Developer</SelectItem>
                <SelectItem value="azure-fundamentals">Azure Fundamentals</SelectItem>
                <SelectItem value="azure-administrator">Azure Administrator</SelectItem>
                <SelectItem value="gcp-cloud-engineer">GCP Cloud Engineer</SelectItem>
                <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
                <SelectItem value="kubernetes">Kubernetes</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="terraform">Terraform</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred-time">Preferred Time</Label>
            <Select 
              value={counselingData.preferred_time} 
              onValueChange={(value) => setCounselingData(prev => ({ ...prev, preferred_time: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="When should we call you?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12:00 PM - 5:00 PM)</SelectItem>
                <SelectItem value="evening">Evening (5:00 PM - 8:00 PM)</SelectItem>
                <SelectItem value="anytime">Anytime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="counselor-message">Additional Message</Label>
            <Textarea
              id="counselor-message"
              value={counselingData.message}
              onChange={(e) => setCounselingData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Tell us about your career goals or any specific questions..."
              rows={3}
            />
          </div>

          <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
            <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <strong>Free Career Counseling:</strong> Our experts will help you choose the right cloud career path and certification roadmap.
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? "Submitting..." : "Request Callback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CounselorModal;