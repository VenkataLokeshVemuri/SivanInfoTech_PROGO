
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface VerificationResult {
  userName: string;
  enrollmentDetails: {
    enrollmentID: string;
    certificationID: string;
    courseTitle: string;
    certifiedOn: string;
    enrollmentStatus: string;
  };
}

const CertificateVerification = () => {
  const [enrollmentID, setEnrollmentID] = useState('');
  const [certificateID, setCertificateID] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleVerify = async () => {
    if (!enrollmentID || !certificateID) {
      toast({
        title: "Missing Information",
        description: "Please enter both Enrollment ID and Certificate ID",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);
    setError('');
    setResult(null);

    try {
      const response = await apiService.verifyCertificate(enrollmentID, certificateID);
      
      if (response.status === 200) {
        setResult(response);
        toast({
          title: "Verification Successful",
          description: "Certificate is valid and verified",
        });
      } else {
        setError(response.Message);
        toast({
          title: "Verification Failed",
          description: response.Message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
      toast({
        title: "Error",
        description: "Unable to verify certificate",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Search className="h-6 w-6 text-blue-600" />
            <span>Certificate Verification</span>
          </CardTitle>
          <CardDescription>
            Verify the authenticity of SitCloud certificates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="enrollmentID">Enrollment ID</Label>
            <Input
              id="enrollmentID"
              placeholder="Enter Enrollment ID (e.g., EID20241201ABCDE)"
              value={enrollmentID}
              onChange={(e) => setEnrollmentID(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="certificateID">Certificate ID</Label>
            <Input
              id="certificateID"
              placeholder="Enter Certificate ID (e.g., SIT20241201ABCDEAWS)"
              value={certificateID}
              onChange={(e) => setCertificateID(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleVerify} 
            disabled={verifying}
            className="w-full"
          >
            {verifying ? 'Verifying...' : 'Verify Certificate'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-700">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Verification Failed</span>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-6 w-6" />
              <span>Certificate Verified Successfully</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Student Name</Label>
                <p className="text-lg font-semibold text-gray-900">{result.userName}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Course Title</Label>
                <p className="text-lg font-semibold text-gray-900">{result.enrollmentDetails.courseTitle}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Enrollment ID</Label>
                <p className="text-sm text-gray-900">{result.enrollmentDetails.enrollmentID}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Certificate ID</Label>
                <p className="text-sm text-gray-900">{result.enrollmentDetails.certificationID}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Certification Date</Label>
                <p className="text-sm text-gray-900">{formatDate(result.enrollmentDetails.certifiedOn)}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-600">Status</Label>
                <Badge className="bg-green-100 text-green-800">
                  {result.enrollmentDetails.enrollmentStatus}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CertificateVerification;
