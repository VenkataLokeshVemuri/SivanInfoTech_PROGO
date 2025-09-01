"use client";
// Migrated from src/pages/PaymentStatus.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';

const PaymentStatus = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  // Get transactionId from searchParams (App Router)
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const transactionId = searchParams?.get('transactionId');

  useEffect(() => {
    if (transactionId) {
      checkPaymentStatus(transactionId);
    }
  }, [transactionId]);

  const checkPaymentStatus = async (txnId: string) => {
    try {
      const response = await fetch(`https://sitcloud.in/api/callback/${txnId}`);
      const data = await response.json();
      setPaymentDetails(data);
      if (data.success && data.data.state === 'COMPLETED') {
        setStatus('success');
      } else if (data.data.state === 'PENDING') {
        setStatus('pending');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      setStatus('failed');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-600" />;
      case 'failed':
        return <XCircle className="h-16 w-16 text-red-600" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-600" />;
      default:
        return <Clock className="h-16 w-16 text-gray-400 animate-spin" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Processing Payment...';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'success':
        return 'Your payment has been processed successfully. You will receive a confirmation email shortly.';
      case 'failed':
        return 'Your payment could not be processed. Please try again or contact support.';
      case 'pending':
        return 'Your payment is being processed. Please wait for confirmation.';
      default:
        return 'Please wait while we check your payment status...';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-2xl">{getStatusTitle()}</CardTitle>
            <CardDescription>{getStatusDescription()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentDetails && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{paymentDetails.data?.transaction_id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">9{paymentDetails.data?.amount / 100}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">{paymentDetails.data?.state}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col space-y-3">
              {status === 'success' && (
                <Link href="/dashboard">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              )}
              {status === 'failed' && (
                <Link href="/courses">
                  <Button className="w-full">Try Again</Button>
                </Link>
              )}
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentStatus;
