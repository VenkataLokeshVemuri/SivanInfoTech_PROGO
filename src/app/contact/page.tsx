"use client";

import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Youtube, Send, 
  MessageSquare, HelpCircle, Users, BookOpen, Award, Building2, Car, 
  Train, Bus, Coffee, Wifi, Accessibility, CheckCircle2, ArrowRight,
  Globe, Headphones, Calendar, Star, Heart, Shield
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    course: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        "Thank you! Your message has been sent successfully. We'll get back to you soon."
      );
      setFormData({ 
        name: "", 
        email: "", 
        phone: "",
        company: "",
        inquiryType: "",
        course: "",
        message: "" 
      });
    } catch {
      toast.error(
        "Something went wrong. Please try again or contact us directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Address",
      content: "info@sivaninfotech.com\nadmissions@sivaninfotech.com\nsupport@sivaninfotech.com",
      link: "mailto:info@sivaninfotech.com",
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      content: "+91-44-4201-5678 (Main)\n+91-98765-43210 (Admissions)\n+91-87654-32109 (Support)",
      link: "tel:+914442015678",
    },
    {
      icon: MapPin,
      title: "Head Office - Chennai",
      content: "Old No: 6, New No: 10,\nGround Floor, 2nd Street,\nAbiramapuram, Chennai,\nTamil Nadu, India - 600018",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content: "Monday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 2:00 PM IST\nSunday: Closed",
    },
  ];

  const officeLocations = [
    {
      city: "Chennai (Head Office)",
      address: "Old No: 6, New No: 10, Ground Floor\n2nd Street, Abiramapuram\nChennai, Tamil Nadu - 600018",
      phone: "+91-44-4201-5678",
      email: "chennai@sivaninfotech.com",
      timing: "Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 2:00 PM",
      facilities: ["Wi-Fi", "Parking", "Cafeteria", "Lab Access", "Library"],
      transport: ["Metro: Thousand Lights", "Bus: Multiple Routes", "Car Parking Available"],
      manager: "Rajesh Kumar",
      established: "2015"
    },
    {
      city: "Bangalore",
      address: "3rd Floor, Tech Park Building\nKoramangala 5th Block\nBangalore, Karnataka - 560095",
      phone: "+91-80-4567-8901",
      email: "bangalore@sivaninfotech.com",
      timing: "Mon-Fri: 9:30 AM - 6:30 PM\nSat: 10:00 AM - 2:00 PM",
      facilities: ["Wi-Fi", "Parking", "Food Court", "Lab Access", "Conference Rooms"],
      transport: ["Metro: Koramangala", "Bus: Volvo Routes", "Uber/Ola Hub"],
      manager: "Priya Sharma",
      established: "2018"
    },
    {
      city: "Hyderabad",
      address: "2nd Floor, Cyber Towers\nMadhapur, HITEC City\nHyderabad, Telangana - 500081",
      phone: "+91-40-6789-0123",
      email: "hyderabad@sivaninfotech.com",
      timing: "Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 2:00 PM",
      facilities: ["Wi-Fi", "Parking", "Cafeteria", "Lab Access", "Study Rooms"],
      transport: ["Metro: Madhapur", "Bus: TSRTC Routes", "Ample Parking"],
      manager: "Arjun Reddy",
      established: "2020"
    }
  ];

  const inquiryTypes = [
    { value: "admission", label: "Course Admission" },
    { value: "corporate", label: "Corporate Training" },
    { value: "placement", label: "Placement Assistance" },
    { value: "support", label: "Technical Support" },
    { value: "partnership", label: "Business Partnership" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "other", label: "Other Inquiry" }
  ];

  const courses = [
    { value: "aws", label: "AWS Cloud Training" },
    { value: "azure", label: "Microsoft Azure" },
    { value: "devops", label: "DevOps Engineering" },
    { value: "kubernetes", label: "Kubernetes & Docker" },
    { value: "python", label: "Python Development" },
    { value: "java", label: "Java Full Stack" },
    { value: "data-science", label: "Data Science" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "other", label: "Other Course" }
  ];

  const faqs = [
    {
      question: "What are your admission requirements?",
      answer: "Basic computer knowledge and willingness to learn. We welcome students from all backgrounds."
    },
    {
      question: "Do you provide placement assistance?",
      answer: "Yes, we have a dedicated placement team with 90%+ placement record and partnerships with 150+ companies."
    },
    {
      question: "Are the courses industry-relevant?",
      answer: "All our courses are designed with industry experts and updated regularly to match current market demands."
    },
    {
      question: "What is the class schedule?",
      answer: "We offer flexible timings - weekday batches, weekend batches, and online sessions to suit your schedule."
    }
  ];

  const socialLinks = [
    { 
      icon: Facebook, 
      name: "Facebook", 
      url: "https://facebook.com/sivaninfotech", 
      color: "text-blue-600",
      followers: "12.5K"
    },
    { 
      icon: Instagram, 
      name: "Instagram", 
      url: "https://instagram.com/sivaninfotech", 
      color: "text-pink-600",
      followers: "8.2K"
    },
    { 
      icon: Linkedin, 
      name: "LinkedIn", 
      url: "https://linkedin.com/company/sivaninfotech", 
      color: "text-blue-700",
      followers: "15.3K"
    },
    { 
      icon: Youtube, 
      name: "YouTube", 
      url: "https://youtube.com/sivaninfotech", 
      color: "text-red-600",
      followers: "25K+"
    },
  ];

  const stats = [
    { icon: Users, label: "Students Trained", value: "10,000+", color: "text-blue-600" },
    { icon: Award, label: "Success Rate", value: "95%", color: "text-green-600" },
    { icon: Building2, label: "Office Locations", value: "3", color: "text-purple-600" },
    { icon: Globe, label: "Years Experience", value: "10+", color: "text-orange-600" },
  ];

  return (
    <>
      <SEOHead
        title="Contact Us - Sivan InfoTech | Get in Touch"
        description="Contact Sivan InfoTech for inquiries, admissions, or support. Visit our Chennai, Bangalore, or Hyderabad offices or reach out via phone, email, or our contact form."
        keywords="contact Sivan InfoTech, Chennai IT training institute, Bangalore, Hyderabad, admissions, support, phone, email"
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-[#084fa1] via-[#1e40af] to-[#80b742] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center text-white max-w-5xl mx-auto">
              <Badge variant="secondary" className="mb-6 text-[#084fa1] bg-white/90 backdrop-blur-sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Us
              </Badge>
              <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Let's Start Your <span className="text-[#80b742]">Journey</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                Ready to transform your career? We're here to guide you every step of the way.<br />
                Get in touch with our expert team today.
              </p>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color.replace('text-', 'text-white')}`} />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold mb-4 text-gray-900">Send us a Message</h2>
                  <p className="text-gray-600 text-lg">
                    Fill out the form below and we'll get back to you within 24 hours during business days.
                  </p>
                </div>
                
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-[#084fa1] to-[#80b742] text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Send className="h-6 w-6" />
                      Contact Form
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      We typically respond within 24 hours during business days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="mt-2 h-12 border-gray-300 focus:border-[#084fa1] focus:ring-[#084fa1]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="mt-2 h-12 border-gray-300 focus:border-[#084fa1] focus:ring-[#084fa1]"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91-XXXXX-XXXXX"
                            className="mt-2 h-12 border-gray-300 focus:border-[#084fa1] focus:ring-[#084fa1]"
                          />
                        </div>
                        <div>
                          <Label htmlFor="company" className="text-sm font-semibold text-gray-700">Company/Organization</Label>
                          <Input
                            id="company"
                            name="company"
                            type="text"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Your company name (optional)"
                            className="mt-2 h-12 border-gray-300 focus:border-[#084fa1] focus:ring-[#084fa1]"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="inquiryType" className="text-sm font-semibold text-gray-700">Inquiry Type *</Label>
                          <Select value={formData.inquiryType} onValueChange={(value) => setFormData(prev => ({...prev, inquiryType: value}))}>
                            <SelectTrigger className="mt-2 h-12 border-gray-300 focus:border-[#084fa1] focus:ring-[#084fa1]">
                              <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                            <SelectContent>
                              {inquiryTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="course" className="text-sm font-semibold text-gray-700">Interested Course</Label>
                          <Select value={formData.course} onValueChange={(value) => setFormData(prev => ({...prev, course: value}))}>
                            <SelectTrigger className="mt-2 h-12 border-gray-300 focus:border-[#084fa1] focus:ring-[#084fa1]">
                              <SelectValue placeholder="Select a course (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.value} value={course.value}>
                                  {course.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="message" className="text-sm font-semibold text-gray-700">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Please describe your inquiry in detail..."
                          className="mt-2 min-h-[140px] border-gray-300 focus:border-[#084fa1] focus:ring-[#084fa1]"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-gradient-to-r from-[#084fa1] to-[#80b742] hover:from-[#063a7a] hover:to-[#6d9e37] h-14 text-lg font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Contact Info - Takes 1 column */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">
                    Quick Contact
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Reach out to us through any of these channels.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-[#084fa1] to-[#80b742] text-white">
                            <info.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2 text-gray-900">
                              {info.title}
                            </h3>
                            {info.link ? (
                              <a
                                href={info.link}
                                className="text-[#084fa1] hover:text-[#80b742] transition-colors whitespace-pre-line text-sm"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="text-gray-600 whitespace-pre-line text-sm">
                                {info.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Social Media */}
                <Card className="mt-6 border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Heart className="h-5 w-5 text-red-500" />
                      Follow Us
                    </CardTitle>
                    <CardDescription>
                      Stay connected for updates and insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${social.color}`}
                        >
                          <social.icon className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium text-sm text-gray-900">{social.name}</div>
                            <div className="text-xs text-gray-500">{social.followers}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-gradient-to-r from-[#084fa1] to-[#80b742] text-white">
                <Building2 className="h-4 w-4 mr-2" />
                Our Locations
              </Badge>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Visit Our Offices</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We have strategically located offices across major IT hubs in India to serve you better.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {officeLocations.map((office, index) => (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#084fa1] to-[#80b742] text-white">
                    <CardTitle className="flex items-center justify-between">
                      <span>{office.city}</span>
                      <Badge variant="secondary" className="text-[#084fa1] bg-white">
                        Est. {office.established}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      {office.manager} - Center Manager
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-[#084fa1] mt-1 flex-shrink-0" />
                        <p className="text-gray-600 text-sm whitespace-pre-line">{office.address}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-[#80b742]" />
                        <a href={`tel:${office.phone}`} className="text-[#80b742] hover:underline">
                          {office.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-[#084fa1]" />
                        <a href={`mailto:${office.email}`} className="text-[#084fa1] hover:underline">
                          {office.email}
                        </a>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-gray-600 mt-1" />
                        <p className="text-gray-600 text-sm whitespace-pre-line">{office.timing}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Facilities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {office.facilities.map((facility, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        How to Reach
                      </h4>
                      <div className="space-y-1">
                        {office.transport.map((transport, idx) => (
                          <p key={idx} className="text-sm text-gray-600">• {transport}</p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-gradient-to-r from-[#084fa1] to-[#80b742] text-white">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </Badge>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quick answers to questions you may have about our programs and services.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3 text-gray-900 flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-[#084fa1] mt-1 flex-shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed pl-8">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Card className="inline-block bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Still have questions?</h3>
                  <p className="text-gray-600 mb-4">Our team is here to help you with any additional queries.</p>
                  <div className="flex gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-[#084fa1] to-[#80b742]">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Us
                    </Button>
                    <Button variant="outline" className="border-[#084fa1] text-[#084fa1] hover:bg-[#084fa1] hover:text-white">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map and Directions Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-gradient-to-r from-[#084fa1] to-[#80b742] text-white">
                <MapPin className="h-4 w-4 mr-2" />
                Find Us
              </Badge>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Locate Our Offices</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                All our offices are strategically located near major transportation hubs for easy accessibility.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                      <MapPin className="h-6 w-6 text-[#084fa1]" />
                      Head Office - Chennai
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-[#084fa1]/10">
                          <Building2 className="h-5 w-5 text-[#084fa1]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Address</h4>
                          <p className="text-gray-600 text-sm">
                            Old No: 6, New No: 10, Ground Floor<br />
                            2nd Street, Abiramapuram<br />
                            Chennai, Tamil Nadu - 600018
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-[#80b742]/10">
                          <Train className="h-5 w-5 text-[#80b742]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Nearest Metro</h4>
                          <p className="text-gray-600 text-sm">Thousand Lights Metro Station (2 mins walk)</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <Bus className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Bus Routes</h4>
                          <p className="text-gray-600 text-sm">Multiple MTC bus routes available</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-green-100">
                          <Car className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Parking</h4>
                          <p className="text-gray-600 text-sm">Dedicated parking space available</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t">
                      <Button className="w-full bg-gradient-to-r from-[#084fa1] to-[#80b742]">
                        <MapPin className="h-4 w-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="overflow-hidden border-0 shadow-xl">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-[#084fa1] mx-auto mb-4" />
                      <h3 className="text-2xl font-semibold mb-2 text-gray-900">Interactive Map</h3>
                      <p className="text-gray-600 mb-4">
                        Chennai Office Location
                      </p>
                      <Badge className="bg-gradient-to-r from-[#084fa1] to-[#80b742] text-white">
                        Map integration available
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#084fa1] via-[#1e40af] to-[#80b742] text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <Badge className="mb-6 bg-white/20 text-white border-white/30">
              <Star className="h-4 w-4 mr-2" />
              Start Your Journey
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
              Join thousands of successful professionals who have accelerated their careers with Sivan InfoTech.<br />
              Your future in technology starts with a single conversation.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Phone className="h-8 w-8 mx-auto mb-3 text-[#80b742]" />
                <h3 className="font-semibold text-lg mb-2">Call Now</h3>
                <p className="text-white/80 text-sm mb-3">Speak with our counselors</p>
                <Button variant="secondary" className="text-[#084fa1] hover:bg-white/90">
                  <Phone className="h-4 w-4 mr-2" />
                  Call +91-44-4201-5678
                </Button>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Calendar className="h-8 w-8 mx-auto mb-3 text-[#80b742]" />
                <h3 className="font-semibold text-lg mb-2">Schedule Call</h3>
                <p className="text-white/80 text-sm mb-3">Book a convenient time</p>
                <Button variant="outline" className="border-white/50 text-white hover:bg-white hover:text-[#084fa1]">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Now
                </Button>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-[#80b742]" />
                <h3 className="font-semibold text-lg mb-2">Visit Office</h3>
                <p className="text-white/80 text-sm mb-3">Meet us in person</p>
                <Button variant="outline" className="border-white/50 text-white hover:bg-white hover:text-[#084fa1]">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-[#084fa1] hover:bg-white/90 px-8 py-4 text-lg font-semibold">
                <MessageSquare className="h-5 w-5 mr-2" />
                Send Message
              </Button>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white hover:text-[#084fa1] px-8 py-4 text-lg">
                <BookOpen className="h-5 w-5 mr-2" />
                Download Brochure
              </Button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm">100% Job Assistance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="text-sm">Industry Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  <span className="text-sm">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">10,000+ Alumni</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
