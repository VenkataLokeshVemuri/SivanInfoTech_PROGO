
import { Cloud, Mail, Phone, MapPin, BookOpen, Users, GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cloud className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">SitCloud</span>
              </div>
              <p className="text-gray-400">
                Empowering freshers with comprehensive cloud and AI internship programs. Your gateway to a successful tech career.
              </p>
              <div className="flex space-x-4">
                <BookOpen className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Users className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <GraduationCap className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
                <Cloud className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Programs */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Programs</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">90-Day Cloud Internship</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bootcamp Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Junior Engineer Program</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Specialization</a></li>
              </ul>
            </div>

            {/* Cloud Platforms */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Cloud Platforms</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AWS Training</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Azure Certification</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GCP Fundamentals</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Multi-Cloud Skills</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">hello@sitcloud.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">+91 123 456 7890</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">Mumbai, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-6 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 SitCloud. All rights reserved. Empowering the next generation of cloud professionals.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Admission Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
