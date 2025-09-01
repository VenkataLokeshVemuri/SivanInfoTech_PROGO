"use client";
// Migrated from src/pages/Verify.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CertificateVerification from '@/components/CertificateVerification';

const Verify = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Certificate Verification
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Verify the authenticity of SitCloud training certificates
            </p>
          </div>
          <CertificateVerification />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Verify;
