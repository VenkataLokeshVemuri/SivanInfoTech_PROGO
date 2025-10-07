"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, LogOut, LayoutDashboard, Users, BookOpen, 
  ClipboardList, BarChart2, Menu, X, 
  ChevronDown, Bell, Search, Home, ChevronRight,
  Activity, PieChart, FileText, Calendar, Award,
  Zap, Shield, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBackendAuth, User as AuthUser } from '@/hooks/useBackendAuth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useBackendAuth();
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Format time
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Navigation items with modern categorization and better icons
  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: LayoutDashboard,
      active: pathname === '/admin/dashboard',
      description: 'Overview & insights'
    },
    { 
      name: 'Users', 
      href: '/admin/dashboard/users', 
      icon: Users,
      active: pathname?.includes('/admin/dashboard/users'),
      description: 'Manage students & admins'
    },
    { 
      name: 'Batches', 
      href: '/admin/dashboard/batches', 
      icon: Briefcase,
      active: pathname?.includes('/admin/dashboard/batches'),
      description: 'Training programs'
    },
    { 
      name: 'Quizzes', 
      href: '/admin/dashboard/quizzes', 
      icon: FileText,
      active: pathname?.includes('/admin/dashboard/quizzes'),
      badge: 3,
      description: 'Assessment center'
    },
    { 
      name: 'Attempts', 
      href: '/admin/dashboard/attempts', 
      icon: Activity,
      active: pathname?.includes('/admin/dashboard/attempts'),
      description: 'Quiz submissions'
    },
    { 
      name: 'Analytics', 
      href: '/admin/dashboard/analytics', 
      icon: PieChart,
      active: pathname?.includes('/admin/dashboard/analytics'),
      description: 'Performance metrics'
    }
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        return (
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Sivan InfoTech</h1>
                <p className="text-xl text-gray-600">Empowering careers through expert IT training and cloud technologies</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">10,000+ Students</h3>
                  <p className="text-gray-600">Successfully trained professionals across various technologies</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">95% Success Rate</h3>
                  <p className="text-gray-600">Industry-leading placement and certification success</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">150+ Partners</h3>
                  <p className="text-gray-600">Strong industry partnerships for guaranteed placements</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h2>
                <p className="text-lg mb-6">Join thousands of successful professionals who transformed their careers with us</p>
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Explore Courses
                </Button>
              </div>
            </div>
          </div>
        );

      case 'why-sitcloud':
        return (
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Why Choose SitCloud?</h1>
                <p className="text-xl text-gray-600">Discover what makes us the preferred choice for IT training</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Industry Certified Trainers</h3>
                      <p className="text-gray-600">Learn from experts with real-world experience and industry certifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Hands-on Learning</h3>
                      <p className="text-gray-600">Practical labs and real projects to build job-ready skills</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">100% Placement Support</h3>
                      <p className="text-gray-600">Dedicated placement team with guaranteed job assistance</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Our Success Stories</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <p className="font-medium">AWS Solutions Architect</p>
                      <p className="text-sm text-gray-600">₹12 LPA at TCS - Rahul Sharma</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <p className="font-medium">DevOps Engineer</p>
                      <p className="text-sm text-gray-600">₹15 LPA at Infosys - Priya Patel</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <p className="font-medium">Cloud Architect</p>
                      <p className="text-sm text-gray-600">₹18 LPA at Accenture - Amit Kumar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h1>
                <p className="text-xl text-gray-600">Comprehensive training programs designed for career success</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AWS Certification</h3>
                  <p className="text-gray-600 mb-4">Complete AWS training with hands-on labs and certification preparation</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹25,000</span>
                    <Badge>4 months</Badge>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">DevOps Engineering</h3>
                  <p className="text-gray-600 mb-4">Master CI/CD, Docker, Kubernetes, and automation tools</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹30,000</span>
                    <Badge>5 months</Badge>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Python Development</h3>
                  <p className="text-gray-600 mb-4">Full-stack Python development with Django and Flask frameworks</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹20,000</span>
                    <Badge>3 months</Badge>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <PieChart className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Data Science</h3>
                  <p className="text-gray-600 mb-4">Machine learning, AI, and data analytics with Python</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹35,000</span>
                    <Badge>6 months</Badge>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cybersecurity</h3>
                  <p className="text-gray-600 mb-4">Ethical hacking, penetration testing, and security analysis</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹40,000</span>
                    <Badge>6 months</Badge>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart2 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Full Stack Development</h3>
                  <p className="text-gray-600 mb-4">Complete web development with React, Node.js, and databases</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">₹28,000</span>
                    <Badge>5 months</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'verify':
        return (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Verify Certificate</h1>
                <p className="text-xl text-gray-600">Enter certificate ID to verify authenticity</p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="max-w-md mx-auto">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate ID
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter certificate ID (e.g., SIT2024001)"
                      className="w-full h-12 text-center text-lg tracking-wider"
                    />
                  </div>
                  
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 text-lg">
                    Verify Certificate
                  </Button>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-center">Recent Verifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">AWS Solutions Architect</p>
                        <p className="text-sm text-gray-600">SIT2024156 - Verified ✓</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">DevOps Engineer</p>
                        <p className="text-sm text-gray-600">SIT2024142 - Verified ✓</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                <p className="text-xl text-gray-600">Get in touch with our team</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input placeholder="Your Name" className="h-12" />
                      <Input placeholder="Your Email" className="h-12" />
                    </div>
                    <Input placeholder="Subject" className="h-12" />
                    <textarea
                      placeholder="Your Message"
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600">
                      Send Message
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Home className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        <p className="text-gray-600">Old No: 6, New No: 10, Ground Floor<br />2nd Street, Abiramapuram, Chennai - 600018</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p className="text-gray-600">+91-44-4201-5678<br />+91-98765-43210</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-gray-600">info@sivaninfotech.com<br />admissions@sivaninfotech.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Office Hours</h3>
                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return children;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg text-gray-800`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <button 
            className={`flex items-center ${sidebarOpen ? 'space-x-2' : 'justify-center'} hover:opacity-80 transition-opacity`}
          >
            <div className="bg-gradient-to-r from-[#084fa1] to-[#80b742] p-1.5 rounded">
              <img 
                src="/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png" 
                alt="Sivan InfoTech Logo" 
                className="h-6 w-auto"
              />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#084fa1] to-[#80b742]">
                SIT Admin
              </span>
            )}
          </button>
          <button
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="py-4 overflow-y-auto h-[calc(100%-4rem)]">
          {sidebarOpen && (
            <div className="px-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#084fa1] to-[#80b742] flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'admin@sivancloud.com'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {sidebarOpen && (
            <div className="px-4 mb-4">
              <div className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Main Navigation
              </div>
            </div>
          )}
          
          <nav className={`${sidebarOpen ? 'px-2' : 'px-1'} space-y-1.5`}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center ${sidebarOpen ? 'px-3 py-2.5' : 'p-2 justify-center'} text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-[#084fa1]/10 to-[#80b742]/10 text-[#084fa1]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#084fa1]'
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5 ${
                  item.active 
                    ? 'text-[#80b742]' 
                    : 'text-gray-500 group-hover:text-[#80b742]'
                }`} />
                {sidebarOpen && <span>{item.name}</span>}
                {sidebarOpen && item.badge && (
                  <Badge className="ml-auto bg-[#80b742] hover:bg-[#80b742]/90 text-white">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
          
          {sidebarOpen && (
            <>
              <div className="px-4 mt-8 mb-4">
                <div className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                  System
                </div>
              </div>
              
              <div className="px-4">
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      {formattedDate}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {formattedTime}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${!sidebarOpen ? 'lg:ml-20' : ''}`}>
        {/* Admin Navigation Bar - Based on Main Website Header */}
        <header className="bg-gradient-to-r from-white/95 via-blue-50/90 to-green-50/95 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-blue-500/5 z-10">
          <div className="flex items-center justify-between h-20 px-6 lg:px-8">
            {/* Left Section - Controls & Navigation */}
            <div className="flex items-center space-x-6">
              {/* Mobile Menu Button */}
              <button
                className="text-gray-500 hover:text-gray-700 lg:hidden transition-colors p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              
              {/* Sidebar Toggle */}
              <button
                className="hidden lg:flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-10 w-10 rounded-xl transition-all duration-200 group"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarOpen ? (
                  <ChevronDown className="h-5 w-5 rotate-90 group-hover:scale-110 transition-transform" />
                ) : (
                  <ChevronDown className="h-5 w-5 -rotate-90 group-hover:scale-110 transition-transform" />
                )}
              </button>

              {/* Main Website Navigation Items */}
              <nav className="hidden lg:flex items-center space-x-1">
                <Link
                  href="/"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === '/' ? 'text-blue-600' : ''
                  }`}
                >
                  <span className="relative z-10">Home</span>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                    pathname === '/' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                    pathname === '/' ? 'w-3/4 left-1/8' : 'w-0 group-hover:w-3/4 group-hover:left-1/8'
                  }`}></div>
                </Link>
                <Link
                  href="/why-us"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === '/why-us' ? 'text-blue-600' : ''
                  }`}
                >
                  <span className="relative z-10">Why SitCloud</span>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                    pathname === '/why-us' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                    pathname === '/why-us' ? 'w-3/4 left-1/8' : 'w-0 group-hover:w-3/4 group-hover:left-1/8'
                  }`}></div>
                </Link>
                <Link
                  href="/courses"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === '/courses' ? 'text-blue-600' : ''
                  }`}
                >
                  <span className="relative z-10">Courses</span>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                    pathname === '/courses' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                    pathname === '/courses' ? 'w-3/4 left-1/8' : 'w-0 group-hover:w-3/4 group-hover:left-1/8'
                  }`}></div>
                </Link>
                <Link
                  href="/verify"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === '/verify' ? 'text-blue-600' : ''
                  }`}
                >
                  <span className="relative z-10">Verify Certificate</span>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                    pathname === '/verify' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                    pathname === '/verify' ? 'w-3/4 left-1/8' : 'w-0 group-hover:w-3/4 group-hover:left-1/8'
                  }`}></div>
                </Link>
                <Link
                  href="/contact"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === '/contact' ? 'text-blue-600' : ''
                  }`}
                >
                  <span className="relative z-10">Contact</span>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                    pathname === '/contact' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  <div className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                    pathname === '/contact' ? 'w-3/4 left-1/8' : 'w-0 group-hover:w-3/4 group-hover:left-1/8'
                  }`}></div>
                </Link>
              </nav>
            </div>

            {/* Right Section - Notifications & Profile Only */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative hover:bg-gray-100 rounded-xl h-10 w-10"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-0 border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">3 new</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <DropdownMenuItem className="py-2 hover:bg-gray-50">
                      <div className="flex flex-col">
                        <span className="font-medium">New quiz submission</span>
                        <span className="text-xs text-gray-500">5 mins ago</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 hover:bg-gray-50">
                      <div className="flex flex-col">
                        <span className="font-medium">User account verified</span>
                        <span className="text-xs text-gray-500">1 hour ago</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin Profile - Using main website header style */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-slate-100">
                    <Avatar className="h-10 w-10 border-2 border-slate-200 hover:border-blue-400 transition-colors">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold text-sm">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-0 border-0 shadow-xl bg-white rounded-2xl overflow-hidden" align="end" forceMount>
                  {/* Header Section with Gradient */}
                  <div className="bg-gradient-to-r from-green-600 via-blue-600 to-green-500 p-6 text-white">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-3 border-white shadow-lg">
                        <AvatarFallback className="bg-white text-green-600 font-bold text-lg">
                          AD
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold leading-tight truncate">Admin User</p>
                        <p className="text-sm text-green-100 truncate">admin@sivaninfotech.com</p>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                            Admin Account
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link 
                        href="/settings"
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-700 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors mr-3">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Settings</div>
                          <div className="text-xs text-gray-500">Profile & preferences</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4"></div>
                  
                  {/* Logout Section */}
                  <div className="p-2">
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="cursor-pointer flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors mr-3">
                        <LogOut className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Logout</div>
                        <div className="text-xs text-gray-500">Sign out of account</div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area with modern styling */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}