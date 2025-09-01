
import { MessageCircle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CounselorModal from '@/components/CounselorModal';

const FloatingCTA = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile Floating CTA */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        {isExpanded ? (
          <div className="bg-white rounded-lg shadow-2xl p-4 mb-4 border">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Talk to Expert</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Chat
              </Button>
              <CounselorModal>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CounselorModal>
            </div>
          </div>
        ) : null}
        
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full w-14 h-14 shadow-2xl"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Desktop Floating CTA */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-full shadow-2xl p-4 hover:scale-105 transition-transform duration-300">
          <CounselorModal>
            <Button className="bg-transparent hover:bg-white/20 text-white border-0 px-6 py-3 text-lg font-semibold">
              <Phone className="h-5 w-5 mr-2" />
              Talk to Career Counselor
            </Button>
          </CounselorModal>
        </div>
      </div>

      {/* Sticky Bottom CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 p-4 z-40 md:hidden">
        <div className="flex space-x-2">
          <Button className="flex-1 bg-white text-blue-600 hover:bg-gray-100 font-semibold">
            Get Free Demo
          </Button>
          <CounselorModal>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              Call Counselor
            </Button>
          </CounselorModal>
        </div>
      </div>
    </>
  );
};

export default FloatingCTA;
