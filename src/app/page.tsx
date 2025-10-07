
'use client';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WhySivanInfoTech from '@/components/WhySivanInfoTech';
import CoreFeatures from '@/components/CoreFeatures';
import HowItWorks from '@/components/HowItWorks';
import CourseTracksNew from '@/components/CourseTracksNew';
import SuccessStoriesNew from '@/components/SuccessStoriesNew';
import PlacementPartners from '@/components/PlacementPartners';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import FloatingCTA from '@/components/FloatingCTA';

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Sivan InfoTech LLP",
    "description": "Premier cloud computing training institute offering AWS, Azure, GCP certification courses and internships in Chennai and Bangalore",
  // ...existing code...
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "9, Sumathi Square & Madan Square, Neelamangalam, Guduvancheri",
        "addressLocality": "Chennai",
        "addressRegion": "Tamil Nadu", 
        "postalCode": "603202",
        "addressCountry": "IN"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "BMTC Complex, Outer Ring Rd, Old Madiwala, Kuvempu Nagar, BTM 2nd Stage, BTM Layout",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560068",
        "addressCountry": "IN"
      }
    ],
    "sameAs": [
      "https://facebook.com/sitcloud",
      "https://twitter.com/sitcloud",
      "https://linkedin.com/company/sitcloud"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2000"
    },
    "offers": [
      {
        "@type": "Course",
        "name": "AWS Certification Bootcamp",
        "provider": "SitCloud",
        "courseCode": "AWS-BOOTCAMP"
      },
      {
        "@type": "Course", 
        "name": "Azure Certification Bootcamp",
        "provider": "SitCloud",
        "courseCode": "AZURE-BOOTCAMP"
      },
      {
        "@type": "Course",
        "name": "GCP Certification Bootcamp", 
        "provider": "SitCloud",
        "courseCode": "GCP-BOOTCAMP"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Sivan InfoTech - #1 Cloud Computing Training Institute in Chennai & Bangalore | AWS, Azure, GCP Certifications"
        description="Build Your Cloud Career with Real-World Projects and Certifications. Master AWS, Azure, GCP with expert training in Chennai and Bangalore. Join thousands of successful interns."
        keywords="cloud computing training chennai bangalore, AWS certification course, Azure training bootcamp, GCP certification program, DevOps internship, cloud architect course india"
        canonical="https://sivaninfotech.com"
        structuredData={structuredData}
      />
      <Header />
      <Hero />
      <WhySivanInfoTech />
      <CoreFeatures />
      <HowItWorks />
      <CourseTracksNew />
      <SuccessStoriesNew />
      {/* <BatchSchedule /> */}
      <PlacementPartners />
      <Gallery />
      <Testimonials />
      <Blog />
      <Footer />
      <FloatingCTA />
    </div>
  );
};

export default Index;
