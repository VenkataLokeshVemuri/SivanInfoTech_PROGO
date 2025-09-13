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
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      {/* Main Card */}
      <Card className="shadow-lg rounded-xl border border-gray-200 transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl bg-white">
        <CardHeader className="text-center bg-gradient-to-r from-green-50 to-green-100 rounded-t-xl p-6 transition-colors duration-300 hover:from-green-100 hover:to-green-50">
          <CardTitle className="flex items-center justify-center space-x-3 text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-300">
            <Search className="h-7 w-7 text-green-600 animate-pulse" />
            <span>Certificate Verification</span>
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            Verify the authenticity of SitCloud certificates instantly
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 p-6">
          <div className="space-y-4">
            <Label htmlFor="enrollmentID" className="font-semibold text-gray-700">Enrollment ID</Label>
            <Input
              id="enrollmentID"
              placeholder="Enter Enrollment ID (e.g., EID20241201ABCDE)"
              value={enrollmentID}
              onChange={(e) => setEnrollmentID(e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-green-400 rounded-lg transition-all duration-200"
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="certificateID" className="font-semibold text-gray-700">Certificate ID</Label>
            <Input
              id="certificateID"
              placeholder="Enter Certificate ID (e.g., SIT20241201ABCDEAWS)"
              value={certificateID}
              onChange={(e) => setCertificateID(e.target.value)}
              className="border-gray-300 focus:ring-2 focus:ring-green-400 rounded-lg transition-all duration-200"
            />
          </div>

          <Button
            onClick={handleVerify}
            disabled={verifying}
            className="w-48 py-2 text-base font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 transition-all duration-300 rounded-lg shadow-md mx-auto block"
          >
            {verifying ? 'Verifying...' : 'Verify Certificate'}
          </Button>
        </CardContent>
      </Card>

      {/* Error Card */}
      {error && (
        <Card className="border-red-300 bg-red-50 shadow-md rounded-xl transition-all duration-300 hover:scale-[1.01]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3 text-red-700 font-semibold">
              <XCircle className="h-6 w-6" />
              <span>Verification Failed</span>
            </div>
            <p className="text-red-600 mt-3">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Result Card */}
      {result && (
        <Card className="border-green-300 bg-green-50 shadow-md rounded-xl transition-all duration-300 hover:scale-[1.01]">
          <CardHeader className="bg-green-100 rounded-t-xl p-5 transition-colors duration-300 hover:bg-green-200">
            <CardTitle className="flex items-center space-x-3 text-green-900 font-bold text-xl">
              <CheckCircle className="h-6 w-6" />
              <span>Certificate Verified Successfully</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold shadow-sm">
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
