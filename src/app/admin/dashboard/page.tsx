"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, BookOpen, ClipboardList, Calendar, Clock, 
  BarChart2, CheckCircle, UserPlus, AlertCircle, ArrowRight,
  RefreshCw, TrendingUp, TrendingDown, PieChart, LineChart,
  Layers, Eye, FileText, GraduationCap, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { backendAPI } from '@/lib/backend-api';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBatches: number;
  activeBatches: number;
  totalQuizzes: number;
  publishedQuizzes: number;
  totalAttempts: number;
  pendingGrading: number;
  averageScore: number;
  userGrowth: number;
  batchGrowth: number;
  quizGrowth: number;
  attemptGrowth: number;
  completedAttempts: number;
}

interface ActivityItem {
  id: number;
  type: string;
  user?: string;
  batch?: string;
  quiz?: string;
  score?: number;
  admin?: string;
  role?: string;
  timestamp: string;
  description: string;
  time: string;
}

interface UpcomingEvent {
  id: number;
  title: string;
  batch: string;
  date: string;
  time: string;
}

interface PendingTask {
  id: number;
  task: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
  link: string;
}

interface TopStudent {
  id: number;
  name: string;
  course: string;
  score: number;
  avatar?: string;
}

export default function AdminDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalBatches: 0,
    activeBatches: 0,
    totalQuizzes: 0,
    publishedQuizzes: 0,
    totalAttempts: 0,
    pendingGrading: 0,
    averageScore: 0,
    userGrowth: 0,
    batchGrowth: 0,
    quizGrowth: 0,
    attemptGrowth: 0,
    completedAttempts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [topStudents, setTopStudents] = useState<TopStudent[]>([]);

  const { user, loading, isAuthenticated, isAdmin } = useBackendAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  // Authentication check
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth');
        return;
      }
      if (!isAdmin) {
        router.push('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        });
        return;
      }
    }
  }, [loading, isAuthenticated, isAdmin, router, toast]);
  
  // Show loading state while checking authentication
  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  const formattedDateTime = currentTime.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const loadDashboardData = async () => {
    try {
      setDataLoading(true);
      
      // Load dashboard statistics
      const [coursesResponse] = await Promise.allSettled([
        backendAPI.getCourseAndBatchDetails()
      ]);

      // Process courses/batches data
      let totalBatches = 0;
      let activeBatches = 0;
      if (coursesResponse.status === 'fulfilled' && coursesResponse.value.success) {
        const courses = coursesResponse.value.data?.details || [];
        courses.forEach((course: any) => {
          if (course.batches) {
            totalBatches += course.batches.length;
            // Assume batches with recent start dates are active
            const now = new Date();
            activeBatches += course.batches.filter((batch: any) => {
              const startDate = new Date(batch.startdate);
              const endDate = new Date(batch.enddate);
              return startDate <= now && endDate >= now;
            }).length;
          }
        });
      }

      // Update stats with real data (mock some values for now)
      setStats({
        totalUsers: 356, // Would come from getAllUsers API
        activeUsers: 289, // Would come from getAllUsers API
        totalBatches,
        activeBatches,
        totalQuizzes: 145, // Would come from getAllQuizzes API
        publishedQuizzes: 112, // Would come from getAllQuizzes API
        totalAttempts: 1247, // Would need quiz attempts API
        pendingGrading: 37, // Would need pending grading API
        averageScore: 76.4, // Would calculate from quiz results
        userGrowth: 12,
        batchGrowth: Math.round(((activeBatches / Math.max(totalBatches, 1)) - 0.6) * 100),
        quizGrowth: -3,
        attemptGrowth: 24,
        completedAttempts: 1089,
      });

      // Mock recent activity (would come from activity logs API)
      setRecentActivity([
        { 
          id: 1, 
          type: 'user_registered',
          description: 'New user registration',
          user: 'Alex Johnson', 
          time: '2 hours ago',
          timestamp: '2 hours ago' 
        },
        { 
          id: 2, 
          type: 'quiz_submitted', 
          description: 'Quiz submission completed',
          user: 'Maria Garcia', 
          time: '4 hours ago',
          timestamp: '4 hours ago' 
        },
        { 
          id: 3, 
          type: 'batch_created', 
          description: 'New batch created',
          user: 'Admin',
          time: '1 day ago',
          timestamp: '1 day ago' 
        }
      ]);

      // Mock upcoming events (would come from calendar API)
      setUpcomingEvents([
        { 
          id: 1, 
          title: 'AWS Certification Exam', 
          batch: 'AWS Solutions Architect - Batch 14', 
          date: 'Oct 25, 2025', 
          time: '10:00 AM' 
        },
        { 
          id: 2, 
          title: 'Azure Fundamentals Quiz', 
          batch: 'Azure Administrator - Batch 7', 
          date: 'Oct 27, 2025', 
          time: '2:00 PM' 
        }
      ]);

      // Mock pending tasks (would come from tasks API)
      setPendingTasks([
        { 
          id: 1, 
          task: 'Grade quiz submissions', 
          count: 37, 
          priority: 'high',
          link: '/admin/dashboard/attempts'
        },
        { 
          id: 2, 
          task: 'Approve new user registrations', 
          count: 14, 
          priority: 'medium',
          link: '/admin/dashboard/users'
        }
      ]);

      // Mock top students
      setTopStudents([
        { id: 1, name: 'Sarah Chen', course: 'AWS Solutions Architect', score: 94 },
        { id: 2, name: 'Michael Rodriguez', course: 'Azure Administrator', score: 91 },
        { id: 3, name: 'Emily Johnson', course: 'Google Cloud Engineer', score: 89 },
        { id: 4, name: 'David Kim', course: 'AWS Developer', score: 87 },
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error Loading Dashboard",
        description: "Some data may not be up to date. Please try refreshing.",
        variant: "destructive",
      });
    } finally {
      setDataLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
    toast({
      title: "Dashboard Refreshed",
      description: "Data has been updated successfully.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#084fa1] to-[#80b742]">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.email || 'Administrator'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Last updated: {formattedDateTime}
          </span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="group"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-[#084fa1]/10 to-transparent">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#084fa1]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#084fa1]">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">+{stats.activeUsers}</span> active users
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-[#80b742]/10 to-transparent">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <BookOpen className="h-4 w-4 text-[#80b742]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#80b742]">{stats.activeBatches}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-gray-600">{stats.totalBatches} total batches</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-100 to-transparent">
            <CardTitle className="text-sm font-medium">Published Quizzes</CardTitle>
            <ClipboardList className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.publishedQuizzes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-gray-600">{stats.totalQuizzes} total quizzes</span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-100 to-transparent">
            <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">{stats.totalAttempts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600 font-medium">
                {stats.completedAttempts > 0 ? `${((stats.completedAttempts / stats.totalAttempts) * 100).toFixed(1)}%` : '0%'}
              </span> completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#084fa1]/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-[#084fa1]" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest system activities and user interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'user_registered' ? 'bg-green-100' :
                      activity.type === 'quiz_submitted' ? 'bg-blue-100' :
                      activity.type === 'batch_created' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      {activity.type === 'user_registered' && <UserPlus className="h-4 w-4 text-green-600" />}
                      {activity.type === 'quiz_submitted' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'batch_created' && <BookOpen className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'system_alert' && <AlertCircle className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-500">{activity.user}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${
                      activity.type === 'user_registered' ? 'border-green-200 text-green-700' :
                      activity.type === 'quiz_submitted' ? 'border-blue-200 text-blue-700' :
                      activity.type === 'batch_created' ? 'border-purple-200 text-purple-700' :
                      'border-orange-200 text-orange-700'
                    }`}>
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" size="sm" className="w-full hover:bg-white">
                View All Activity
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Top Performing Students */}
          <Card className="border-0 shadow-md bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#80b742]/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#80b742]" />
                Top Students
              </CardTitle>
              <CardDescription>
                Based on recent quiz performance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topStudents.map((student, index) => (
                  <div key={student.id} className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback className="text-xs">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.course}</p>
                    </div>
                    <div className="text-sm font-bold text-[#80b742]">{student.score}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" size="sm" className="w-full hover:bg-white">
                View All Students
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-md bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-100 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                System Status
              </CardTitle>
              <CardDescription>
                All systems operational
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Service</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Gateway</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Quiz Engine</span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Online</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card className="border-0 shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-[#084fa1]/10 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#084fa1]" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    Key performance indicators for this month
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="text-xs h-8">
                  This Month ▾
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#084fa1] mb-2">94.2%</div>
                  <div className="text-sm text-gray-600 mb-1">Course Completion Rate</div>
                  <div className="flex items-center justify-center text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-600">+2.4% from last month</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#80b742] mb-2">87.8%</div>
                  <div className="text-sm text-gray-600 mb-1">Student Satisfaction</div>
                  <div className="flex items-center justify-center text-xs">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-green-600">+1.2% from last month</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">76.4%</div>
                  <div className="text-sm text-gray-600 mb-1">Average Quiz Score</div>
                  <div className="flex items-center justify-center text-xs">
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-600">-0.8% from last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 mt-6">
          <Card className="border-0 shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-[#084fa1]/10 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#084fa1]" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>
                    Scheduled quizzes, exams and orientations
                  </CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  Next 7 Days
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center p-3 rounded-lg transition-all hover:bg-gray-50 border-b last:border-0"       
                  >
                    <div className="p-2 rounded-full bg-[#084fa1]/10 mr-3">
                      <Calendar className="h-5 w-5 text-[#084fa1]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="px-2 py-0 h-5 bg-transparent border-[#80b742] text-[#80b742] rounded-sm">
                          {event.batch}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{event.date}, {event.time}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-[#084fa1] hover:text-[#084fa1] hover:bg-[#084fa1]/10"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" size="sm" className="w-full hover:bg-white">
                View Calendar
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4 mt-6">
          <Card className="border-0 shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-[#084fa1]/10 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-[#084fa1]" />
                    Pending Tasks
                  </CardTitle>
                  <CardDescription>
                    Tasks that require your attention
                  </CardDescription>
                </div>
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                  {pendingTasks.length} Tasks
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-3 rounded-lg transition-all hover:bg-gray-50 border-b last:border-0"       
                  >
                    <div className={`p-2 rounded-full mr-3 ${
                      task.priority === 'high' ? 'bg-red-100' :
                      task.priority === 'medium' ? 'bg-amber-100' :
                      'bg-green-100'
                    }`}>
                      <AlertCircle className={`h-5 w-5 ${
                        task.priority === 'high' ? 'text-red-500' :
                        task.priority === 'medium' ? 'text-amber-500' :
                        'text-green-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{task.task}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge className={`${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-gray-500 ml-1">
                          {task.count} {task.task.includes('Grade') ? 'submissions' :
                                      task.task.includes('Approve') ? 'users' :
                                      task.task.includes('Finalize') ? 'quizzes' : 'batches'}
                        </span>
                      </div>
                    </div>
                    <Link href={task.link}>
                      <Button size="sm" className="bg-[#80b742] hover:bg-[#80b742]/90">
                        Take Action
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <Button variant="outline" size="sm" className="w-full hover:bg-white">
                View All Tasks
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links and Analytics Preview */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#084fa1]/10 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#084fa1]" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used admin functions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/dashboard/users/create" className="group">
                <div className="bg-white border rounded-xl p-5 flex flex-col items-center justify-center space-y-3 h-full text-center group-hover:border-[#084fa1] group-hover:shadow-md transition-all duration-200">
                  <div className="p-3 rounded-full bg-gradient-to-br from-[#084fa1]/10 to-[#084fa1]/5 group-hover:from-[#084fa1]/20 group-hover:to-[#084fa1]/10 transition-all duration-200">
                    <UserPlus className="h-6 w-6 text-[#084fa1]" />
                  </div>
                  <span className="font-medium">Add User</span>
                  <span className="text-xs text-gray-500">Create new user accounts</span>
                </div>
              </Link>

              <Link href="/admin/dashboard/batches/create" className="group">
                <div className="bg-white border rounded-xl p-5 flex flex-col items-center justify-center space-y-3 h-full text-center group-hover:border-[#80b742] group-hover:shadow-md transition-all duration-200">
                  <div className="p-3 rounded-full bg-gradient-to-br from-[#80b742]/10 to-[#80b742]/5 group-hover:from-[#80b742]/20 group-hover:to-[#80b742]/10 transition-all duration-200">
                    <BookOpen className="h-6 w-6 text-[#80b742]" />
                  </div>
                  <span className="font-medium">New Batch</span>
                  <span className="text-xs text-gray-500">Create course batches</span>
                </div>
              </Link>

              <Link href="/admin/dashboard/quizzes/create" className="group">
                <div className="bg-white border rounded-xl p-5 flex flex-col items-center justify-center space-y-3 h-full text-center group-hover:border-orange-500 group-hover:shadow-md transition-all duration-200">
                  <div className="p-3 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 group-hover:from-orange-200 group-hover:to-orange-100 transition-all duration-200">
                    <FileText className="h-6 w-6 text-orange-500" />
                  </div>
                  <span className="font-medium">Create Quiz</span>
                  <span className="text-xs text-gray-500">Design assessments</span>
                </div>
              </Link>

              <Link href="/admin/dashboard/analytics" className="group">
                <div className="bg-white border rounded-xl p-5 flex flex-col items-center justify-center space-y-3 h-full text-center group-hover:border-purple-500 group-hover:shadow-md transition-all duration-200">
                  <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 group-hover:from-purple-200 group-hover:to-purple-100 transition-all duration-200">
                    <BarChart2 className="h-6 w-6 text-purple-500" />
                  </div>
                  <span className="font-medium">Analytics</span>
                  <span className="text-xs text-gray-500">View performance data</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#084fa1]/10 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[#084fa1]" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Average quiz scores by category
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-8">
                Last 30 Days ▾
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-[210px]">
              <div className="text-center">
                <div className="relative mx-auto mb-4 w-32 h-32 rounded-full bg-gradient-to-r from-[#084fa1]/10 to-[#80b742]/10 flex items-center justify-center overflow-hidden">
                  <PieChart className="h-12 w-12 text-gray-300 absolute z-10" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-20">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#084fa1] to-[#80b742]">76.4%</span>
                    <span className="text-xs text-gray-500">Avg. Score</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">Performance chart will render here</p>
                <p className="text-xs text-gray-400 mt-1">Using recharts library as specified</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <div className="text-lg font-bold text-[#084fa1]">82%</div>
                <div className="text-xs text-gray-500">AWS</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <div className="text-lg font-bold text-[#80b742]">78%</div>
                <div className="text-xs text-gray-500">Azure</div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <div className="text-lg font-bold text-orange-500">69%</div>
                <div className="text-xs text-gray-500">GCP</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t">
            <Button variant="outline" size="sm" className="w-full hover:bg-white">
              View Detailed Analytics
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}