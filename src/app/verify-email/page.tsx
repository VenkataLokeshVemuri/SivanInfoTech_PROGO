"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cloud, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import Link from 'next/link';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useBackendAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setMessage('Verification token not found. Please check your email link.');
      return;
    }

    const performVerification = async () => {
      try {
        const result = await verifyEmail(token);
        
        if (result.success) {
          setVerificationStatus('success');
          setMessage(result.message || 'Email verified successfully! You can now log in.');
        } else {
          setVerificationStatus('error');
          setMessage(result.error || 'Email verification failed. The link may be expired or invalid.');
        }
      } catch (error) {
        setVerificationStatus('error');
        setMessage('An error occurred during verification. Please try again.');
      }
    };

    performVerification();
  }, [searchParams, verifyEmail]);

  const handleReturnToLogin = () => {
    router.push('/login');
  };

  const handleReturnToSignup = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Cloud className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SitCloud</span>
          </div>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {verificationStatus === 'loading' && 'Verifying your email address...'}
            {verificationStatus === 'success' && 'Your email has been verified!'}
            {verificationStatus === 'error' && 'Verification failed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {verificationStatus === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-gray-600">Please wait while we verify your email...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-green-800">Verification Successful!</h3>
                <p className="text-gray-600">{message}</p>
              </div>
              <Button onClick={handleReturnToLogin} className="w-full">
                Continue to Login
              </Button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-800">Verification Failed</h3>
                <p className="text-gray-600">{message}</p>
              </div>
              <div className="space-y-2 w-full">
                <Button onClick={handleReturnToSignup} variant="outline" className="w-full">
                  Sign Up Again
                </Button>
                <Link href="/login" className="block">
                  <Button variant="ghost" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;