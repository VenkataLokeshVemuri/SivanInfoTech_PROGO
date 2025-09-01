"use client";
// Migrated from src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Award, Download, Calendar, BookOpen, Cloud, LogOut, Mail } from 'lucide-react';
import CertificateGenerator from '@/components/CertificateGenerator';
import CloudProviderLogos from '@/components/CloudProviderLogos';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Enrollment {
  enrollmentID: string;
  courseID: string;
  courseShortForm: string;
  courseTitle: string;
  enrolledDate: string;
  enrollmentStatus: string;
  certificationID?: string;
  certifiedOn?: string;
  batchDetails: any;
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

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiService.getEnrollments();
      if (response.status === 200) {
        setUserData(response.user);
      } else {
        throw new Error(response.Message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      router.push('/login');
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout properly",
        variant: "destructive",
      });
    }
  };

  const getEnrollmentStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Certified':
        return <Badge className="bg-purple-100 text-purple-800">Certified</Badge>;
      case 'Waiting for Approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-200 text-gray-800">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Cloud className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load user data</p>
          <Link href="/login">
            <Button className="mt-4">Back to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedCourses = userData.enrollments?.filter(e => e.enrollmentStatus === 'Certified').length || 0;
  const totalEnrollments = userData.enrollments?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <Cloud className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">SitCloud</span>
              </Link>
              <div className="border-l border-gray-300 pl-3">
                <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
                <p className="text-gray-600">Welcome back, {userData.firstName}!</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/">
                <Button variant="outline">
                  Back to Home
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Student Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="text-sm font-medium">{userData.firstName} {userData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm">{userData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge className={userData.verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {userData.verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </div>
                {userData.isFromCollege && userData.collegeName && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">College:</span>
                    <span className="text-sm">{userData.collegeName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Enrollments:</span>
                  <span className="text-sm font-medium">{totalEnrollments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="text-sm font-medium">{completedCourses}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: totalEnrollments > 0 ? `${(completedCourses / totalEnrollments) * 100}%` : '0%' }}
                  ></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion:</span>
                  <span className="text-sm font-medium">
                    {totalEnrollments > 0 ? Math.round((completedCourses / totalEnrollments) * 100) : 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/courses">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Verify Certificate
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Cloud Provider Logos */}
        <CloudProviderLogos />
        {/* Main Content Tabs */}
        <Tabs defaultValue="enrollments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="enrollments">My Enrollments</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>
          <TabsContent value="enrollments">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Course Enrollments</CardTitle>
                  <CardDescription>Track your learning progress and course status</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.enrollments && userData.enrollments.length > 0 ? (
                    <div className="space-y-4">
                      {userData.enrollments.map((enrollment) => (
                        <div key={enrollment.enrollmentID} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{enrollment.courseTitle}</h3>
                              <p className="text-sm text-gray-600">Course ID: {enrollment.courseID}</p>
                              <p className="text-sm text-gray-600">Enrollment ID: {enrollment.enrollmentID}</p>
                            </div>
                            {getEnrollmentStatusBadge(enrollment.enrollmentStatus)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Enrolled:</span>
                              <p className="font-medium">{new Date(enrollment.enrolledDate).toLocaleDateString()}</p>
                            </div>
                            {enrollment.certifiedOn && (
                              <div>
                                <span className="text-gray-600">Certified:</span>
                                <p className="font-medium">{new Date(enrollment.certifiedOn).toLocaleDateString()}</p>
                              </div>
                            )}
                            {enrollment.certificationID && (
                              <div>
                                <span className="text-gray-600">Certificate ID:</span>
                                <p className="font-medium">{enrollment.certificationID}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No course enrollments yet</p>
                      <Link href="/courses">
                        <Button>Browse Available Courses</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="certificates">
            <CertificateGenerator 
              student={{
                name: `${userData.firstName} ${userData.lastName}`,
                enrollmentId: userData.enrollments?.[0]?.enrollmentID || 'N/A',
                certificateId: userData.enrollments?.find(e => e.certificationID)?.certificationID || 'N/A',
                enrollmentDate: userData.enrollments?.[0]?.enrolledDate || new Date().toISOString()
              }} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
