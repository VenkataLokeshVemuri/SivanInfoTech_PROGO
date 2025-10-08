import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Search, Loader2 } from "lucide-react";
import { backendAPI } from "@/lib/backend-api";
import { useToast } from "@/hooks/use-toast";

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
  const [enrollmentID, setEnrollmentID] = useState("");
  const [certificateID, setCertificateID] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleVerify = async () => {
    // Validation
    if (!enrollmentID.trim() || !certificateID.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both Enrollment ID and Certificate ID",
        variant: "destructive",
      });
      return;
    }

    // Basic format validation
    if (enrollmentID.length < 10) {
      toast({
        title: "Invalid Format",
        description: "Enrollment ID must be at least 10 characters long",
        variant: "destructive",
      });
      return;
    }

    if (certificateID.length < 10) {
      toast({
        title: "Invalid Format",
        description: "Certificate ID must be at least 10 characters long",
        variant: "destructive",
      });
      return;
    }

    setVerifying(true);
    setError("");
    setResult(null);

    try {
      const response = await backendAPI.verifyCertificate({
        enrollmentID: enrollmentID.trim(),
        certificateID: certificateID.trim(),
      });

      if (response.success && response.data) {
        setResult(response.data as VerificationResult);
        toast({
          title: "Verification Successful",
          description: "Certificate is valid and verified",
        });
      } else {
        const errorMsg = response.error || "Certificate verification failed";
        setError(errorMsg);
        toast({
          title: "Verification Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Certificate verification error:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Unable to verify certificate. Please try again.";
      setError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleReset = () => {
    setEnrollmentID("");
    setCertificateID("");
    setResult(null);
    setError("");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !verifying &&
      enrollmentID.trim() &&
      certificateID.trim()
    ) {
      handleVerify();
    }
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
            <Label
              htmlFor="enrollmentID"
              className="font-semibold text-gray-700"
            >
              Enrollment ID *
            </Label>
            <Input
              id="enrollmentID"
              placeholder="Enter Enrollment ID (e.g., EID20241201ABCDE)"
              value={enrollmentID}
              onChange={(e) => setEnrollmentID(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-gray-300 focus:ring-2 focus:ring-green-400 rounded-lg transition-all duration-200"
              disabled={verifying}
              maxLength={50}
            />
          </div>

          <div className="space-y-4">
            <Label
              htmlFor="certificateID"
              className="font-semibold text-gray-700"
            >
              Certificate ID *
            </Label>
            <Input
              id="certificateID"
              placeholder="Enter Certificate ID (e.g., SIT20241201ABCDEAWS)"
              value={certificateID}
              onChange={(e) => setCertificateID(e.target.value)}
              onKeyPress={handleKeyPress}
              className="border-gray-300 focus:ring-2 focus:ring-green-400 rounded-lg transition-all duration-200"
              disabled={verifying}
              maxLength={50}
            />
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <Button
              onClick={handleVerify}
              disabled={
                verifying || !enrollmentID.trim() || !certificateID.trim()
              }
              className="px-6 py-2 text-base font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 transition-all duration-300 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Certificate"
              )}
            </Button>

            {(result || error) && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="px-6 py-2 text-base font-semibold border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 rounded-lg"
                disabled={verifying}
              >
                Reset
              </Button>
            )}
          </div>
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
            <div className="mt-4 p-3 bg-red-100 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Please check:</strong>
              </p>
              <ul className="text-sm text-red-600 mt-1 list-disc list-inside">
                <li>Enrollment ID and Certificate ID are correct</li>
                <li>IDs are copied exactly as shown on your certificate</li>
                <li>Certificate has been issued and is active</li>
              </ul>
            </div>
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
                <Label className="text-sm font-medium text-gray-600">
                  Student Name
                </Label>
                <p className="text-lg font-semibold text-gray-900">
                  {result.userName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Course Title
                </Label>
                <p className="text-lg font-semibold text-gray-900">
                  {result.enrollmentDetails.courseTitle}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Enrollment ID
                </Label>
                <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded border">
                  {result.enrollmentDetails.enrollmentID}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Certificate ID
                </Label>
                <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded border">
                  {result.enrollmentDetails.certificationID}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Certification Date
                </Label>
                <p className="text-sm text-gray-900">
                  {formatDate(result.enrollmentDetails.certifiedOn)}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Status
                </Label>
                <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold shadow-sm">
                  {result.enrollmentDetails.enrollmentStatus}
                </Badge>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-100 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Certificate Authentic</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                This certificate has been verified as authentic and was issued
                by SitCloud Training Institute.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-800 mb-3">
            How to find your IDs:
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Enrollment ID:</strong> Found in your enrollment
              confirmation email or dashboard
            </p>
            <p>
              • <strong>Certificate ID:</strong> Located on your certificate
              document (usually at the bottom)
            </p>
            <p>
              • Both IDs are case-sensitive and must be entered exactly as shown
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateVerification;
