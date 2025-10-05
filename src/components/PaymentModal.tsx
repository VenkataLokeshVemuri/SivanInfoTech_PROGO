'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Shield, 
  Loader2, 
  CheckCircle,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { backendAPI } from '@/lib/backend-api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseDetails: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    nextBatch: {
      startDate: string;
      schedule: string;
      mode: string;
    };
  };
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  processingFee?: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, courseDetails }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'method' | 'details' | 'processing'>('method');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('phonePe');
  const [paymentDetails, setPaymentDetails] = useState({
    email: '',
    phone: '',
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreeTnC, setAgreeTnC] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { 
      id: 'phonePe', 
      name: 'PhonePe', 
      icon: Smartphone, 
      description: 'Pay with PhonePe UPI',
      processingFee: 0
    },
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      icon: CreditCard, 
      description: 'Visa, Mastercard, Rupay',
      processingFee: Math.round(courseDetails.price * 0.02) // 2% processing fee
    },
    { 
      id: 'netbanking', 
      name: 'Net Banking', 
      icon: Building2, 
      description: 'All major banks',
      processingFee: 0
    },
    { 
      id: 'emi', 
      name: 'EMI Options', 
      icon: Shield, 
      description: 'Easy installments',
      processingFee: Math.round(courseDetails.price * 0.01) // 1% processing fee
    }
  ];

  const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
  const finalAmount = courseDetails.price + (selectedMethod?.processingFee || 0);

  const handleMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setCurrentStep('details');
  };

  const handlePaymentSubmit = async () => {
    // Validate form data
    if (!paymentDetails.name || !paymentDetails.email || !paymentDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!agreeTnC) {
      toast({
        title: "Terms & Conditions",
        description: "Please accept the terms and conditions to proceed.",
        variant: "destructive"
      });
      return;
    }

    // Validate payment method specific fields
    if (selectedPaymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
        toast({
          title: "Card Information Required",
          description: "Please fill in all card details.",
          variant: "destructive"
        });
        return;
      }
    }

    setIsProcessing(true);
    setCurrentStep('processing');

    try {
      // Use the new enrollment with payment API
      const response = await backendAPI.enrollWithPayment({
        course_id: courseDetails.id,
        user_details: {
          name: paymentDetails.name,
          email: paymentDetails.email,
          phone: paymentDetails.phone
        },
        payment_method: selectedPaymentMethod,
        amount: finalAmount
      });

      if (response.success && response.data?.payment_url) {
        // Redirect to payment gateway
        window.location.href = response.data.payment_url;
      } else {
        throw new Error(response.message || 'Enrollment failed');
      }
    } catch (error) {
      setIsProcessing(false);
      setCurrentStep('details');
      toast({
        title: "Enrollment Error",
        description: error instanceof Error ? error.message : "Failed to process enrollment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Choose Payment Method</h3>
        <p className="text-gray-600 text-sm mt-1">Select how you'd like to pay</p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className="border rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <method.icon className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">{method.name}</div>
                  <div className="text-sm text-gray-500">{method.description}</div>
                </div>
              </div>
              <div className="text-right">
                {method.processingFee ? (
                  <div className="text-sm text-orange-600">
                    +₹{method.processingFee} fee
                  </div>
                ) : (
                  <Badge variant="secondary" className="text-green-600">
                    No Fee
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => setCurrentStep('method')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">Payment Details</h3>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Personal Information</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={paymentDetails.name}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={paymentDetails.email}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={paymentDetails.phone}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>
        </div>
      </div>

      {/* Payment Method Specific Fields */}
      {selectedPaymentMethod === 'card' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Lock className="h-4 w-4 mr-2" />
            Card Information
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedPaymentMethod === 'phonePe' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">UPI Information (Optional)</h4>
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              value={paymentDetails.upiId}
              onChange={(e) => setPaymentDetails(prev => ({ ...prev, upiId: e.target.value }))}
              placeholder="yourname@paytm (optional)"
            />
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="font-medium text-gray-900">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Course Fee</span>
            <span>₹{courseDetails.price.toLocaleString()}</span>
          </div>
          {selectedMethod?.processingFee ? (
            <div className="flex justify-between text-orange-600">
              <span>Processing Fee</span>
              <span>₹{selectedMethod.processingFee.toLocaleString()}</span>
            </div>
          ) : null}
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total Amount</span>
            <span>₹{finalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="agreeTnC"
          checked={agreeTnC}
          onChange={(e) => setAgreeTnC(e.target.checked)}
          className="rounded"
        />
        <Label htmlFor="agreeTnC" className="text-sm">
          I agree to the{' '}
          <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button 
        onClick={handlePaymentSubmit}
        className="w-full"
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ₹${finalAmount.toLocaleString()}`
        )}
      </Button>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-6 py-8">
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Processing Payment</h3>
        <p className="text-gray-600">Please wait while we process your payment...</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll in {courseDetails.title}</DialogTitle>
        </DialogHeader>
        
        {/* Course Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium">{courseDetails.title}</h4>
              <p className="text-sm text-gray-600">Next Batch: {courseDetails.nextBatch.startDate}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">₹{courseDetails.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500 line-through">
                ₹{courseDetails.originalPrice.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Steps */}
        {currentStep === 'method' && renderMethodSelection()}
        {currentStep === 'details' && renderPaymentDetails()}
        {currentStep === 'processing' && renderProcessing()}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;