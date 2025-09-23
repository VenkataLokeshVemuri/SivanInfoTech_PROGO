"use client";
// Migrated from src/pages/Contact.tsx
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
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Youtube, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
        "Thank you! Your message has been sent successfully. We&apos;ll get back to you soon."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
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
      content: "@sivaninfotech.com",
      link: "mailto:info@sivaninfotech.com",
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      content: "+91-44-4201-5678\n+91-98765-43210",
      link: "tel:+914442015678",
    },
    {
      icon: MapPin,
      title: "Physical Address",
      content:
        "Old No: 6, New No: 10,\nGround Floor, 2nd Street,\nAbiramapuram, Chennai,\nTamil Nadu, India - 600018",
    },
    {
      icon: Clock,
      title: "Office Hours",
      content:
        "Monday - Friday: 9:00 AM - 6:00 PM IST\nSaturday: 10:00 AM - 2:00 PM IST\nSunday: Closed",
    },
  ];

  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: "#", color: "text-blue-600" },
    { icon: Instagram, name: "Instagram", url: "#", color: "text-pink-600" },
    { icon: Linkedin, name: "LinkedIn", url: "#", color: "text-blue-700" },
    { icon: Youtube, name: "YouTube", url: "#", color: "text-red-600" },
  ];

  return (
    <>
      <SEOHead
        title="Contact Us - Sivan InfoTech | Get in Touch"
        description="Contact Sivan InfoTech for inquiries, admissions, or support. Visit our Chennai office or reach out via phone, email, or our contact form."
        keywords="contact Sivan InfoTech, Chennai IT training institute, admissions, support, phone, email"
      />
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary via-primary/90 to-primary/80">
          <div className="container mx-auto px-4">
            <div className="text-center text-white max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4 text-primary bg-white">
                Contact Us
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Get in <span className="text-secondary">Touch</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Ready to start your IT career journey? We&apos;re here to help with
                any questions about admissions, courses, or support.
              </p>
            </div>
          </div>
        </section>
        {/* Contact Form and Info Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">Send us a Message</h2>
                  <p className="text-muted-foreground text-lg">
                    Fill out the form below and we&apos;ll get back to you as soon as
                    possible.
                  </p>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-primary" />
                      Contact Form
                    </CardTitle>
                    <CardDescription>
                      We typically respond within 24 hours during business days.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What is this regarding?"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Please describe your inquiry in detail..."
                          className="mt-1 min-h-[120px]"
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              {/* Contact Information */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Contact Information
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Reach out to us through any of these channels. We&apos;re always
                    happy to help!
                  </p>
                </div>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <info.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">
                              {info.title}
                            </h3>
                            {info.link ? (
                              <a
                                href={info.link}
                                className="text-primary hover:underline whitespace-pre-line"
                              >
                                {info.content}
                              </a>
                            ) : (
                              <p className="text-muted-foreground whitespace-pre-line">
                                {info.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {/* Social Media Links */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Follow Us</CardTitle>
                    <CardDescription>
                      Stay connected with us on social media for updates and
                      insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          className={`p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors ${social.color}`}
                          aria-label={social.name}
                        >
                          <social.icon className="h-6 w-6" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        {/* Map Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Visit Our Office</h2>
              <p className="text-xl text-muted-foreground">
                Located in the heart of Chennai, easily accessible by public
                transport
              </p>
            </div>
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Our Location</h3>
                  <p className="text-muted-foreground">
                    Abiramapuram, Chennai, Tamil Nadu
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Interactive map integration available upon request
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Don&apos;t wait – reach out today and take the first step towards your
              IT career transformation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-primary">
                Schedule a Call
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                Download Brochure
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
