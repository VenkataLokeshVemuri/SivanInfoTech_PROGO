"use client";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoreFeatures from "@/components/CoreFeatures";
import WhySitCloud from "@/components/WhySitCloud";

const WhyUs = () => {
  return (
    <>
      <SEOHead 
        title="Why Choose SitCloud - Expert Cloud Training & Placement" 
        description="Discover why SitCloud is the leading choice for cloud training. Expert trainers, hands-on projects, 100% placement guarantee, and comprehensive AWS, Azure, GCP certifications."
      />
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
        {/* Enhanced Hero Section */}
        <section className="relative pt-32 pb-20 bg-gradient-to-r from-green-600 via-blue-600 to-green-500 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Why Choose 
                <span className="bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent block md:inline"> SitCloud?</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-green-100 mb-12 leading-relaxed max-w-4xl mx-auto">
                Transform your career with industry-leading cloud training, expert guidance, and guaranteed placement opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Why SitCloud Section */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50">
          <WhySitCloud />
        </div>
        
        {/* Core Features Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50">
          <CoreFeatures />
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default WhyUs;
