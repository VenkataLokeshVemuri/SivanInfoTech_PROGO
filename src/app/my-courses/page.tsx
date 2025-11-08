"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Calendar,
  Clock,
  Award,
  Play,
  ArrowLeft,
  GraduationCap,
  Star,
  TrendingUp,
  CheckCircle,
  PlayCircle,
  FileText,
  Users,
  Target,
  Zap,
} from "lucide-react";
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
  enrollments: Enrollment[];
}

const MyCoursesPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await apiService.getEnrollments();
        setUserData({ enrollments: data });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your courses",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: { color: "bg-green-100 text-green-800", icon: PlayCircle },
      Completed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      Certified: { color: "bg-yellow-100 text-yellow-800", icon: Award },
      Pending: { color: "bg-gray-100 text-gray-800", icon: Clock },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig["Pending"];
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} font-medium flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const getCourseProgress = (enrollment: Enrollment) => {
    // Mock progress calculation based on status
    switch (enrollment.enrollmentStatus) {
      case "Certified":
        return 100;
      case "Completed":
        return 95;
      case "Active":
        return Math.floor(Math.random() * 70) + 20;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="hidden sm:block h-8 w-px bg-white/30"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">My Courses</h1>
                <p className="text-blue-100 mt-1 text-sm">
                  Track your learning journey and progress
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:space-x-6">
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-blue-200">
                  Total Courses
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {userData?.enrollments?.length || 0}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs sm:text-sm text-blue-200">
                  Certified
                </div>
                <div className="text-xl sm:text-2xl font-bold">
                  {userData?.enrollments?.filter(
                    (e) => e.enrollmentStatus === "Certified"
                  ).length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userData?.enrollments && userData.enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.enrollments.map((enrollment) => {
              const progress = getCourseProgress(enrollment);

              return (
                <Card
                  key={enrollment.enrollmentID}
                  className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-[1.02] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                      {getStatusBadge(enrollment.enrollmentStatus)}
                    </div>

                    <div className="mt-4">
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {enrollment.courseTitle}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 mt-1">
                        {enrollment.courseShortForm}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-0">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>
                        <span className="text-sm font-bold text-blue-600">
                          {progress}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Course Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        Enrolled:{" "}
                        {new Date(enrollment.enrolledDate).toLocaleDateString()}
                      </div>

                      {enrollment.certifiedOn && (
                        <div className="flex items-center text-sm text-green-600">
                          <Award className="h-4 w-4 mr-2 text-green-500" />
                          Certified:{" "}
                          {new Date(
                            enrollment.certifiedOn
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Continue
                      </Button>

                      {enrollment.enrollmentStatus === "Certified" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                        >
                          <Award className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-gradient-to-r from-gray-100 to-gray-50 rounded-3xl mb-6 inline-block">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Courses Yet
              </h3>
              <p className="text-gray-600 mb-8">
                You haven't enrolled in any courses yet. Start your learning
                journey today!
              </p>
              <Link href="/courses">
                <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Learning Statistics */}
        {userData?.enrollments && userData.enrollments.length > 0 && (
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
              <CardContent className="p-4 sm:p-6 text-center">
                <Target className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-blue-200" />
                <div className="text-xl sm:text-2xl font-bold">
                  {
                    userData.enrollments.filter(
                      (e) => e.enrollmentStatus === "Active"
                    ).length
                  }
                </div>
                <div className="text-xs sm:text-sm text-blue-200">
                  Active Courses
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
              <CardContent className="p-4 sm:p-6 text-center">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-green-200" />
                <div className="text-xl sm:text-2xl font-bold">
                  {
                    userData.enrollments.filter(
                      (e) => e.enrollmentStatus === "Completed"
                    ).length
                  }
                </div>
                <div className="text-xs sm:text-sm text-green-200">
                  Completed
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg">
              <CardContent className="p-4 sm:p-6 text-center">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-yellow-200" />
                <div className="text-xl sm:text-2xl font-bold">
                  {
                    userData.enrollments.filter(
                      (e) => e.enrollmentStatus === "Certified"
                    ).length
                  }
                </div>
                <div className="text-xs sm:text-sm text-yellow-200">
                  Certified
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg">
              <CardContent className="p-4 sm:p-6 text-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-purple-200" />
                <div className="text-xl sm:text-2xl font-bold">
                  {Math.round(
                    userData.enrollments.reduce(
                      (acc, e) => acc + getCourseProgress(e),
                      0
                    ) / userData.enrollments.length
                  )}
                  %
                </div>
                <div className="text-xs sm:text-sm text-purple-200">
                  Avg Progress
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
