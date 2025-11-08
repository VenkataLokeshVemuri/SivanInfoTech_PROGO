"use client";
// Enhanced Premium Student Dashboard
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Award,
  BookOpen,
  Cloud,
  LogOut,
  Mail,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  Settings,
  BarChart3,
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import CertificateGenerator from "@/components/CertificateGenerator";
import CloudProviderLogos from "@/components/CloudProviderLogos";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Enrollment {
  enrollmentID: string;
  courseID: string;
  courseShortForm: string;
  courseTitle: string;
  enrolledDate: string;
  enrollmentStatus: string;
  certificationID?: string;
  certifiedOn?: string;
  batchDetails: Record<string, unknown>;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  verified: boolean;
  isFromCollege: boolean;
  collegeName?: string;
  enrollments: Enrollment[];
}

// Premium Student Navbar Component
const StudentNavbar = ({
  userData,
  onLogout,
}: {
  userData: UserData;
  onLogout: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Why SitCloud", href: "/why-us" },
    { name: "Verify Certificate", href: "/verify" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/95 via-blue-50/90 to-green-50/95 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-blue-500/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-xl">
                <Cloud className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                SitCloud
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}

            {/* View Schedule Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  View Schedule
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-80 p-0 border-0 shadow-xl bg-white rounded-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 text-white">
                  <h3 className="font-semibold">My Enrolled Courses</h3>
                  <p className="text-sm opacity-90">
                    {userData.enrollments?.length || 0} active enrollments
                  </p>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  {userData.enrollments && userData.enrollments.length > 0 ? (
                    <div className="space-y-3">
                      {userData.enrollments.map((enrollment) => (
                        <div
                          key={enrollment.enrollmentID}
                          className="p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {enrollment.courseTitle}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                Course ID: {enrollment.courseShortForm}
                              </p>
                              <div className="flex items-center mt-2">
                                <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                                <span className="text-xs text-gray-500">
                                  Enrolled:{" "}
                                  {new Date(
                                    enrollment.enrolledDate
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Badge
                              className={
                                enrollment.enrollmentStatus === "Approved"
                                  ? "bg-green-100 text-green-800 text-xs"
                                  : enrollment.enrollmentStatus === "Certified"
                                  ? "bg-purple-100 text-purple-800 text-xs"
                                  : "bg-yellow-100 text-yellow-800 text-xs"
                              }
                            >
                              {enrollment.enrollmentStatus}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        No courses enrolled yet
                      </p>
                      <Link href="/courses">
                        <Button size="sm" className="mt-3">
                          Browse Courses
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Profile Dropdown */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 p-2 hover:bg-white/60 rounded-2xl transition-all duration-200"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold">
                    {userData.firstName?.[0]}
                    {userData.lastName?.[0]}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {userData.firstName} {userData.lastName}
                    </div>
                    <div className="text-xs text-gray-500">Student</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-72 p-0 border-0 shadow-xl bg-white rounded-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                      {userData.firstName?.[0]}
                      {userData.lastName?.[0]}
                    </div>
                    <div>
                      <div className="font-medium">
                        {userData.firstName} {userData.lastName}
                      </div>
                      <div className="text-sm opacity-90">{userData.email}</div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/my-courses"
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors mr-3">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">My Courses</div>
                        <div className="text-xs text-gray-500">
                          Access your enrolled courses
                        </div>
                      </div>
                      <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                        {userData.enrollments?.length || 0}
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/certificates"
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-green-50 hover:text-yellow-700 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg group-hover:bg-yellow-200 transition-colors mr-3">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Certificates</div>
                        <div className="text-xs text-gray-500">
                          View your achievements
                        </div>
                      </div>
                      <div className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-medium">
                        {userData.enrollments?.filter(
                          (e) => e.enrollmentStatus === "Certified"
                        ).length || 0}
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link
                      href="/profile"
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors mr-3">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Profile</div>
                        <div className="text-xs text-gray-500">
                          Manage your account
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4"></div>

                <div className="p-2">
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors mr-3">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Logout</div>
                      <div className="text-xs text-gray-500">
                        Sign out of your account
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/20 bg-white/80 backdrop-blur-xl">
            <div className="py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      const response = await apiService.getEnrollments();
      if (response.status === 200) {
        setUserData(response.user);
      } else {
        throw new Error(response.Message);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [toast, router]);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserData();
  }, [fetchUserData, router]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      router.push("/login");
    } catch {
      toast({
        title: "Logout Error",
        description: "Failed to logout properly",
        variant: "destructive",
      });
    }
  };

  const getEnrollmentStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Approved
          </Badge>
        );
      case "Certified":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Certified
          </Badge>
        );
      case "Waiting for Approval":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pending
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-200 text-gray-800 border-gray-300">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur opacity-75 animate-pulse"></div>
            <Cloud className="relative h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
          </div>
          <p className="text-gray-700 font-medium">
            Loading your premium dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <p className="text-gray-600 mb-4">Unable to load user data</p>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedCourses =
    userData.enrollments?.filter((e) => e.enrollmentStatus === "Certified")
      .length || 0;
  const totalEnrollments = userData.enrollments?.length || 0;
  const progressPercentage =
    totalEnrollments > 0
      ? Math.round((completedCourses / totalEnrollments) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Premium Student Navbar */}
      <StudentNavbar userData={userData} onLogout={handleLogout} />

      {/* Main Content with top padding for fixed navbar */}
      <div className="pt-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
            {/* Welcome Header */}
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/60 backdrop-blur-xl border border-white/20 rounded-full text-xs sm:text-sm font-semibold text-blue-600 mb-4 sm:mb-6 shadow-lg">
                <Star className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Premium Learning Dashboard
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
                Welcome back, {userData.firstName}!
              </h1>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Continue your cloud certification journey with personalized
                insights and premium features
              </p>
            </div>

            {/* Premium Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
              {/* Total Enrollments */}
              <Card className="relative overflow-hidden border-0 bg-white/60 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-2 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl">
                      <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
                    {totalEnrollments}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Enrollments
                  </div>
                  <div className="text-xs text-blue-600 mt-1 sm:mt-2">
                    Active learning paths
                  </div>
                </CardContent>
              </Card>

              {/* Completed Courses */}
              <Card className="relative overflow-hidden border-0 bg-white/60 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-2 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl">
                      <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
                    {completedCourses}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600">
                    Certificates Earned
                  </div>
                  <div className="text-xs text-green-600 mt-1 sm:mt-2">
                    Professional achievements
                  </div>
                </CardContent>
              </Card>

              {/* Progress Percentage */}
              <Card className="relative overflow-hidden border-0 bg-white/60 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-500 group sm:col-span-2 lg:col-span-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10 pb-2 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl">
                      <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">
                    {progressPercentage}%
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-gray-600">
                    Overall Progress
                  </div>
                  <div className="text-xs text-purple-600 mt-1 sm:mt-2">
                    Learning completion
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Cloud Provider Logos */}
          <div className="mb-12">
            <CloudProviderLogos />
          </div>

          {/* Premium Tabs */}
          <Tabs defaultValue="enrollments" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="bg-white/60 backdrop-blur-xl border-0 shadow-lg rounded-2xl p-1">
                <TabsTrigger
                  value="enrollments"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-green-500 data-[state=active]:text-white rounded-xl font-medium px-6 py-3"
                >
                  My Enrollments
                </TabsTrigger>
                <TabsTrigger
                  value="certificates"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl font-medium px-6 py-3"
                >
                  Certificates
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="enrollments">
              <Card className="border-0 bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <GraduationCap className="h-6 w-6 mr-3" />
                    Your Course Enrollments
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Track your learning progress and course status with premium
                    insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {userData.enrollments && userData.enrollments.length > 0 ? (
                    <div className="space-y-6">
                      {userData.enrollments.map((enrollment) => (
                        <Card
                          key={enrollment.enrollmentID}
                          className="border-0 bg-gradient-to-r from-white via-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                  {enrollment.courseTitle}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <BookOpen className="h-4 w-4 mr-1" />
                                    {enrollment.courseShortForm}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Enrolled:{" "}
                                    {new Date(
                                      enrollment.enrolledDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                {getEnrollmentStatusBadge(
                                  enrollment.enrollmentStatus
                                )}
                                {enrollment.certifiedOn && (
                                  <div className="text-xs text-gray-500 mt-2">
                                    Certified:{" "}
                                    {new Date(
                                      enrollment.certifiedOn
                                    ).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        No Enrollments Yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start your cloud certification journey today
                      </p>
                      <Link href="/courses">
                        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-medium">
                          Browse Courses
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates">
              <Card className="border-0 bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <Award className="h-6 w-6 mr-3" />
                    Your Certificates
                  </CardTitle>
                  <CardDescription className="text-purple-100">
                    Download and manage your professional certifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {userData ? (
                    <CertificateGenerator
                      student={{
                        name:
                          `${userData.firstName || ""} ${
                            userData.lastName || ""
                          }`.trim() || "Student",
                        enrollmentId:
                          userData.enrollments?.[0]?.enrollmentID || "N/A",
                        certificateId:
                          userData.enrollments?.find((e) => e.certificationID)
                            ?.certificationID || "N/A",
                        enrollmentDate:
                          userData.enrollments?.[0]?.enrolledDate ||
                          new Date().toISOString(),
                      }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Loading certificate information...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
