"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, BookOpen, ClipboardList, Calendar, Clock, 
  BarChart2, CheckCircle, UserPlus, AlertCircle, ArrowRight,
  RefreshCw, TrendingUp, TrendingDown, PieChart, LineChart,
  Layers, Eye, FileText, GraduationCap, Loader2, Activity,
  Briefcase, Trophy, Zap, Shield
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
    <div className="space-y-8 relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20">
      {/* Premium Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 -left-16 w-48 h-48 bg-gradient-to-br from-green-300/15 via-emerald-300/10 to-teal-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-gradient-to-br from-purple-300/20 via-pink-300/15 to-rose-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-yellow-300/15 via-amber-300/10 to-orange-300/15 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Premium Enhanced Header with Sophisticated Glassmorphism */}
      <div className="relative z-10 group">
        {/* Outer Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#084fa1]/20 via-purple-500/20 to-[#80b742]/20 rounded-3xl blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between p-10 bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] hover:bg-white/50">
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
                <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
              </div>
              <h1 className="text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#084fa1] via-purple-600 to-[#80b742] hover:scale-110 transition-transform duration-500 cursor-default">
                Dashboard
              </h1>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[#084fa1]/30 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500/30 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-[#80b742]/30 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-2xl text-gray-800 font-bold">
                Welcome back, 
                <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-[#084fa1] to-[#80b742] font-black">
                  {user?.name || 'Administrator'}
                </span>
                <span className="ml-2 text-2xl">👋</span>
              </p>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Manage your educational platform with powerful insights and streamlined controls
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-semibold">System Online</span>
              </div>
              
              <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-semibold">{formattedDateTime}</span>
              </div>
              
              <div className="flex items-center space-x-3 px-4 py-2.5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-200/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300">
                <Activity className="h-4 w-4 text-purple-600" />
                <span className="text-purple-700 font-semibold">Live Updates</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="group relative h-14 px-8 bg-white/60 backdrop-blur-xl hover:bg-white/80 border-white/50 hover:border-blue-300/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <RefreshCw className={`h-5 w-5 mr-3 text-blue-600 relative z-10 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="font-bold text-gray-700 relative z-10">Refresh Data</span>
            </Button>
            
            <div className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#084fa1]/10 to-[#80b742]/10 rounded-2xl border border-[#084fa1]/20 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-[#084fa1]" />
              <div className="text-sm">
                <div className="font-bold text-[#084fa1]">Admin Portal</div>
                <div className="text-xs text-gray-600">Full Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards with Premium Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {/* Premium Users Card with Advanced Animations */}
        <Card className="group relative border-0 shadow-2xl bg-gradient-to-br from-white/90 via-blue-50/60 to-indigo-100/40 backdrop-blur-2xl overflow-hidden hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 hover:rotate-2 hover:scale-105">
          {/* Outer Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#084fa1]/40 via-blue-500/30 to-purple-600/40 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative">
            {/* Floating Background Particles */}
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400/40 rounded-full animate-ping delay-300"></div>
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-bounce delay-700"></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
              <div className="flex-1">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  Total Users
                </CardTitle>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#084fa1] to-blue-600 mt-2 group-hover:scale-110 transition-transform duration-500">
                  {stats.totalUsers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-2 group-hover:text-blue-700 transition-colors">
                  Platform Members
                </div>
              </div>
              <div className="relative">
                <div className="p-5 bg-gradient-to-br from-[#084fa1] via-blue-600 to-purple-600 rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                  <Users className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10 pb-6">
              <div className="flex items-center space-x-4 mb-5">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg px-4 py-2 hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  +{stats.userGrowth}%
                </Badge>
                <span className="text-sm text-gray-600 font-semibold">{stats.activeUsers} active</span>
              </div>
              <div className="relative">
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-[#084fa1] via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1500 ease-out shadow-lg relative overflow-hidden group-hover:animate-pulse"
                    style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3 font-bold">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% engagement rate
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Premium Batches Card */}
        <Card className="group relative border-0 shadow-2xl bg-gradient-to-br from-white/90 via-green-50/60 to-emerald-100/40 backdrop-blur-2xl overflow-hidden hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 hover:rotate-2 hover:scale-105">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#80b742]/40 via-green-500/30 to-emerald-600/40 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative">
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-green-400/30 rounded-full animate-pulse delay-200"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping delay-500"></div>
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-green-400/30 rounded-full animate-bounce delay-1000"></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
              <div className="flex-1">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 group-hover:text-green-600 transition-colors duration-300">
                  Active Batches
                </CardTitle>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#80b742] to-emerald-600 mt-2 group-hover:scale-110 transition-transform duration-500">
                  {stats.activeBatches}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-2 group-hover:text-green-700 transition-colors">
                  Course Batches
                </div>
              </div>
              <div className="relative">
                <div className="p-5 bg-gradient-to-br from-[#80b742] via-green-600 to-emerald-600 rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                  <Briefcase className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10 pb-6">
              <div className="flex items-center space-x-4 mb-5">
                <Badge className={`${stats.batchGrowth >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'} border-0 shadow-lg px-4 py-2 hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  {stats.batchGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
                  {stats.batchGrowth}%
                </Badge>
                <span className="text-sm text-gray-600 font-semibold">{stats.totalBatches} total</span>
              </div>
              <div className="relative">
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-[#80b742] via-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1500 ease-out shadow-lg relative overflow-hidden group-hover:animate-pulse"
                    style={{ width: `${Math.min((stats.activeBatches / Math.max(stats.totalBatches, 1)) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3 font-bold">
                  {Math.round((stats.activeBatches / Math.max(stats.totalBatches, 1)) * 100)}% utilization rate
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Premium Quizzes Card */}
        <Card className="group relative border-0 shadow-2xl bg-gradient-to-br from-white/90 via-orange-50/60 to-amber-100/40 backdrop-blur-2xl overflow-hidden hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 hover:rotate-2 hover:scale-105">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/40 via-amber-500/30 to-yellow-500/40 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative">
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse delay-400"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-amber-400/40 rounded-full animate-ping delay-700"></div>
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-yellow-400/30 rounded-full animate-bounce delay-1200"></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-transparent to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
              <div className="flex-1">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 group-hover:text-orange-600 transition-colors duration-300">
                  Published Quizzes
                </CardTitle>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600 mt-2 group-hover:scale-110 transition-transform duration-500">
                  {stats.publishedQuizzes}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-2 group-hover:text-orange-700 transition-colors">
                  Assessment Tools
                </div>
              </div>
              <div className="relative">
                <div className="p-5 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                  <FileText className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10 pb-6">
              <div className="flex items-center space-x-4 mb-5">
                <Badge className={`${stats.quizGrowth >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'} border-0 shadow-lg px-4 py-2 hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  {stats.quizGrowth >= 0 ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
                  {stats.quizGrowth}%
                </Badge>
                <span className="text-sm text-gray-600 font-semibold">{stats.totalQuizzes} total</span>
              </div>
              <div className="relative">
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 h-4 rounded-full transition-all duration-1500 ease-out shadow-lg relative overflow-hidden group-hover:animate-pulse"
                    style={{ width: `${(stats.publishedQuizzes / Math.max(stats.totalQuizzes, 1)) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3 font-bold">
                  {Math.round((stats.publishedQuizzes / Math.max(stats.totalQuizzes, 1)) * 100)}% published rate
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Premium Quiz Attempts Card */}
        <Card className="group relative border-0 shadow-2xl bg-gradient-to-br from-white/90 via-purple-50/60 to-violet-100/40 backdrop-blur-2xl overflow-hidden hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 hover:rotate-2 hover:scale-105">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/40 via-violet-500/30 to-indigo-500/40 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative">
            <div className="absolute inset-0">
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse delay-600"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-violet-400/40 rounded-full animate-ping delay-900"></div>
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-bounce delay-1400"></div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-violet-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 relative z-10">
              <div className="flex-1">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 group-hover:text-purple-600 transition-colors duration-300">
                  Quiz Attempts
                </CardTitle>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-600 mt-2 group-hover:scale-110 transition-transform duration-500">
                  {stats.totalAttempts.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 font-medium mt-2 group-hover:text-purple-700 transition-colors">
                  Student Activity
                </div>
              </div>
              <div className="relative">
                <div className="p-5 bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-500 rounded-3xl shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 group-hover:rotate-12">
                  <Activity className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10 pb-6">
              <div className="flex items-center space-x-4 mb-5">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg px-4 py-2 hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  +{stats.attemptGrowth}%
                </Badge>
                <span className="text-sm text-gray-600 font-semibold">
                  {stats.completedAttempts > 0 ? `${((stats.completedAttempts / stats.totalAttempts) * 100).toFixed(1)}%` : '0%'} completed
                </span>
              </div>
              <div className="relative">
                <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 h-4 rounded-full transition-all duration-1500 ease-out shadow-lg relative overflow-hidden group-hover:animate-pulse"
                    style={{ width: `${stats.completedAttempts > 0 ? (stats.completedAttempts / stats.totalAttempts) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3 font-bold">
                  {Math.round(stats.completedAttempts > 0 ? (stats.completedAttempts / stats.totalAttempts) * 100 : 0)}% completion rate
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Premium Enhanced Activity Feed with Advanced Glassmorphism */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2">
          <Card className="group relative border-0 shadow-2xl bg-white/70 backdrop-blur-2xl overflow-hidden hover:shadow-3xl transition-all duration-700 hover:scale-[1.02]">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#084fa1]/30 via-blue-400/20 to-purple-500/30 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-700"></div>
            
            <div className="relative">
              {/* Floating Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-6 right-8 w-3 h-3 bg-blue-400/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-2 h-2 bg-green-400/25 rounded-full animate-bounce delay-300"></div>
                <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-ping delay-700"></div>
              </div>
              
              <CardHeader className="bg-gradient-to-r from-[#084fa1]/5 via-blue-50/60 to-transparent border-b border-gray-100/80 backdrop-blur-sm relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-5">
                    <div className="relative">
                      <div className="p-4 bg-gradient-to-br from-[#084fa1] via-blue-600 to-purple-600 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                        <BarChart2 className="h-7 w-7 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-gray-800 group-hover:text-[#084fa1] transition-colors duration-300">
                        Recent Activity
                      </CardTitle>
                      <CardDescription className="text-gray-600 font-semibold text-lg">
                        Live system updates and user actions
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-xl px-5 py-2.5 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-110">
                    <div className="w-3 h-3 bg-white rounded-full mr-3 animate-ping"></div>
                    <span className="font-bold">Live Updates</span>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="group/item relative">
                      {/* Timeline Line */}
                      {index < recentActivity.length - 1 && (
                        <div className="absolute left-7 top-16 w-0.5 h-12 bg-gradient-to-b from-gray-300 to-transparent"></div>
                      )}
                      
                      <div className="flex items-start space-x-6 p-6 rounded-2xl bg-gradient-to-r from-gray-50/80 via-white/50 to-transparent hover:from-blue-50/80 hover:via-indigo-50/40 hover:to-transparent transition-all duration-500 border border-gray-100/50 hover:border-blue-200/80 backdrop-blur-sm shadow-sm hover:shadow-xl group-hover/item:scale-[1.02]">
                        <div className="relative flex-shrink-0">
                          <div className={`relative p-4 rounded-2xl shadow-lg group-hover/item:shadow-xl transition-all duration-500 group-hover/item:scale-110 ${
                            activity.type === 'user_registered' ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600' :
                            activity.type === 'quiz_submitted' ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600' :
                            activity.type === 'batch_created' ? 'bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600' :
                            'bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600'
                          }`}>
                            {activity.type === 'user_registered' && <UserPlus className="h-5 w-5 text-white drop-shadow-sm" />}
                            {activity.type === 'quiz_submitted' && <CheckCircle className="h-5 w-5 text-white drop-shadow-sm" />}
                            {activity.type === 'batch_created' && <BookOpen className="h-5 w-5 text-white drop-shadow-sm" />}
                            {activity.type === 'system_alert' && <AlertCircle className="h-5 w-5 text-white drop-shadow-sm" />}
                            
                            {/* Activity Ring */}
                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-current to-transparent opacity-20 animate-pulse"></div>
                          </div>
                          
                          {/* Status Indicator */}
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-current shadow-sm">
                            <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-lg font-bold text-gray-900 group-hover/item:text-blue-700 transition-colors duration-300 leading-tight">
                                {activity.description}
                              </p>
                              <p className="text-sm text-gray-600 font-medium mt-1">
                                System activity • Performance tracking
                              </p>
                            </div>
                            <Badge className={`ml-4 px-3 py-1.5 rounded-xl font-semibold shadow-md ${
                              activity.type === 'user_registered' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' :
                              activity.type === 'quiz_submitted' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200' :
                              activity.type === 'batch_created' ? 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border border-purple-200' :
                              'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200'
                            }`}>
                              {activity.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-6 mt-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm"></div>
                              <span className="text-sm font-bold text-gray-700">{activity.user}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100/80 rounded-xl backdrop-blur-sm">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-600">{activity.time}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100/80 rounded-xl backdrop-blur-sm">
                              <Trophy className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">Success</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="bg-gradient-to-r from-gray-50/90 via-blue-50/40 to-transparent border-t border-gray-100/80 backdrop-blur-sm relative z-10 p-6">
                <Button className="w-full group/btn bg-gradient-to-r from-white/80 to-blue-50/80 hover:from-blue-50 hover:to-white text-gray-700 hover:text-blue-700 border border-gray-200/80 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 rounded-2xl py-4">
                  <Eye className="h-5 w-5 mr-3 group-hover/btn:scale-110 transition-transform duration-300" />
                  <span className="font-bold">View Complete Activity History</span>
                  <ArrowRight className="h-5 w-5 ml-3 group-hover/btn:translate-x-2 transition-transform duration-300" />
                </Button>
              </CardFooter>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Premium Top Performing Students Widget */}
          <Card className="group relative border-0 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden hover:shadow-3xl transition-all duration-700 hover:scale-105">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#80b742]/40 via-emerald-400/30 to-green-500/40 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-700"></div>
            
            <div className="relative">
              {/* Floating Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 right-4 w-2 h-2 bg-green-400/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-emerald-400/40 rounded-full animate-bounce delay-500"></div>
              </div>
              
              <CardHeader className="bg-gradient-to-r from-[#80b742]/10 via-emerald-50/60 to-transparent border-b border-green-100/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#80b742] via-emerald-600 to-green-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                    <GraduationCap className="h-6 w-6 text-white drop-shadow-sm" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-gray-800 group-hover:text-[#80b742] transition-colors duration-300">
                      Top Students
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-semibold">
                      Based on recent quiz performance
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-5">
                  {topStudents.map((student, index) => (
                    <div key={student.id} className="group/student flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-white/50 hover:from-green-50/80 hover:to-emerald-50/40 transition-all duration-500 border border-gray-100/50 hover:border-green-200/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:scale-105">
                      <div className={`relative flex items-center justify-center w-10 h-10 rounded-2xl text-sm font-black shadow-lg transition-all duration-300 group-hover/student:scale-110 ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500 text-white' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 via-slate-400 to-gray-500 text-white' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 via-amber-500 to-orange-500 text-white' :
                        'bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 text-white'
                      }`}>
                        {index + 1}
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-current">
                            <Trophy className="h-2 w-2 text-current m-0.5" />
                          </div>
                        )}
                      </div>
                      
                      <Avatar className="h-12 w-12 border-2 border-white shadow-lg group-hover/student:scale-110 transition-all duration-300">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-[#80b742] to-emerald-600 text-white">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate group-hover/student:text-[#80b742] transition-colors duration-300">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-600 font-medium">{student.course}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="bg-green-100 rounded-full h-1.5 w-16 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-[#80b742] to-emerald-500 h-full transition-all duration-1000"
                              style={{ width: `${student.score}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">{student.score}%</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#80b742] to-emerald-600">
                          {student.score}%
                        </div>
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 font-semibold">
                          {index === 0 ? '🥇 Gold' : index === 1 ? '🥈 Silver' : index === 2 ? '🥉 Bronze' : '⭐ Star'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="bg-gradient-to-r from-gray-50/90 via-green-50/40 to-transparent border-t border-green-100/50 backdrop-blur-sm p-6">
                <Button className="w-full group/btn bg-gradient-to-r from-white/80 to-green-50/80 hover:from-green-50 hover:to-white text-gray-700 hover:text-green-700 border border-gray-200/80 hover:border-green-300 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 rounded-2xl py-3">
                  <Trophy className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                  <span className="font-bold">View All Students</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardFooter>
            </div>
          </Card>

          {/* Premium System Status Widget */}
          <Card className="group relative border-0 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden hover:shadow-3xl transition-all duration-700 hover:scale-105">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400/40 via-emerald-400/30 to-cyan-400/40 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-700"></div>
            
            <div className="relative">
              {/* Floating Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-4 right-4 w-2 h-2 bg-green-400/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-6 left-6 w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse delay-700"></div>
              </div>
              
              <CardHeader className="bg-gradient-to-r from-green-500/10 via-emerald-50/60 to-transparent border-b border-green-100/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                  <div className="relative p-3 bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                    <CheckCircle className="h-6 w-6 text-white drop-shadow-sm" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                      System Status
                    </CardTitle>
                    <CardDescription className="text-gray-600 font-semibold">
                      All systems operational
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { name: 'Database', status: 'online', uptime: '99.9%' },
                    { name: 'Email Service', status: 'online', uptime: '99.8%' },
                    { name: 'Payment Gateway', status: 'online', uptime: '99.7%' },
                    { name: 'Quiz Engine', status: 'online', uptime: '100%' }
                  ].map((service, index) => (
                    <div key={service.name} className="group/service flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50/80 to-white/50 hover:from-green-50/80 hover:to-emerald-50/40 transition-all duration-500 border border-gray-100/50 hover:border-green-200/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:scale-105">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover/service:scale-110 transition-all duration-300">
                          <Activity className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 group-hover/service:text-green-700 transition-colors duration-300">
                            {service.name}
                          </span>
                          <div className="text-xs text-gray-500 font-medium">
                            Uptime: {service.uptime}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 font-bold shadow-sm hover:shadow-md transition-all duration-300">
                          ✓ Online
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="bg-gradient-to-r from-gray-50/90 via-green-50/40 to-transparent border-t border-green-100/50 backdrop-blur-sm p-6">
                <div className="w-full flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-green-100/80 to-emerald-100/80 rounded-2xl border border-green-200/50">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-green-700">All Systems Running Smoothly</span>
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      </div>

      {/* Premium Enhanced Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-gradient-to-r from-gray-100/80 via-white/90 to-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50 shadow-lg backdrop-blur-sm">
          <TabsTrigger 
            value="overview" 
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-white data-[state=active]:to-gray-50 data-[state=active]:shadow-xl data-[state=active]:border data-[state=active]:border-gray-200/50 font-bold transition-all duration-300 data-[state=active]:scale-105"
          >
            📊 Overview
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-white data-[state=active]:to-gray-50 data-[state=active]:shadow-xl data-[state=active]:border data-[state=active]:border-gray-200/50 font-bold transition-all duration-300 data-[state=active]:scale-105"
          >
            📅 Schedule
          </TabsTrigger>
          <TabsTrigger 
            value="tasks" 
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-white data-[state=active]:to-gray-50 data-[state=active]:shadow-xl data-[state=active]:border data-[state=active]:border-gray-200/50 font-bold transition-all duration-300 data-[state=active]:scale-105"
          >
            ✅ Tasks
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
        {/* Premium Quick Actions Grid */}
        <Card className="group relative border-0 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden hover:shadow-3xl transition-all duration-700 hover:scale-105">
          {/* Outer Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#084fa1]/40 via-blue-400/30 to-cyan-400/40 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-700"></div>
          
          <div className="relative">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-1 h-1 bg-cyan-400/40 rounded-full animate-bounce delay-300"></div>
            </div>
            
            <CardHeader className="bg-gradient-to-r from-[#084fa1]/10 via-blue-50/60 to-transparent border-b border-blue-100/50 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-[#084fa1] via-blue-600 to-cyan-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                  <Layers className="h-6 w-6 text-white drop-shadow-sm" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-gray-800 group-hover:text-[#084fa1] transition-colors duration-300">
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-semibold">
                    Frequently used admin functions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Add User Action */}
                <Link href="/admin/dashboard/users/create" className="group/action transform transition-all duration-500 hover:scale-110">
                  <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-blue-50/60 to-white/90 border-2 border-gray-100/50 hover:border-[#084fa1]/50 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 h-full text-center shadow-lg hover:shadow-2xl backdrop-blur-sm group-hover/action:bg-gradient-to-br group-hover/action:from-blue-50/80 group-hover/action:to-white/90 transition-all duration-700">
                    {/* Background Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#084fa1]/5 via-transparent to-blue-500/10 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 p-4 rounded-3xl bg-gradient-to-br from-[#084fa1]/10 via-blue-100/60 to-[#084fa1]/5 group-hover/action:from-[#084fa1]/20 group-hover/action:to-blue-200/80 transition-all duration-500 shadow-md group-hover/action:shadow-xl group-hover/action:scale-110">
                      <UserPlus className="h-8 w-8 text-[#084fa1] group-hover/action:scale-110 transition-transform duration-300" />
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                      <span className="font-black text-gray-800 group-hover/action:text-[#084fa1] transition-colors duration-300 text-lg">Add User</span>
                      <span className="text-sm text-gray-600 font-medium group-hover/action:text-gray-700 transition-colors duration-300">Create new user accounts</span>
                    </div>
                  </div>
                </Link>

                {/* New Batch Action */}
                <Link href="/admin/dashboard/batches/create" className="group/action transform transition-all duration-500 hover:scale-110">
                  <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-green-50/60 to-white/90 border-2 border-gray-100/50 hover:border-[#80b742]/50 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 h-full text-center shadow-lg hover:shadow-2xl backdrop-blur-sm group-hover/action:bg-gradient-to-br group-hover/action:from-green-50/80 group-hover/action:to-white/90 transition-all duration-700">
                    {/* Background Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#80b742]/5 via-transparent to-green-500/10 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 p-4 rounded-3xl bg-gradient-to-br from-[#80b742]/10 via-green-100/60 to-[#80b742]/5 group-hover/action:from-[#80b742]/20 group-hover/action:to-green-200/80 transition-all duration-500 shadow-md group-hover/action:shadow-xl group-hover/action:scale-110">
                      <BookOpen className="h-8 w-8 text-[#80b742] group-hover/action:scale-110 transition-transform duration-300" />
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                      <span className="font-black text-gray-800 group-hover/action:text-[#80b742] transition-colors duration-300 text-lg">New Batch</span>
                      <span className="text-sm text-gray-600 font-medium group-hover/action:text-gray-700 transition-colors duration-300">Create course batches</span>
                    </div>
                  </div>
                </Link>

                {/* Create Quiz Action */}
                <Link href="/admin/dashboard/quizzes/create" className="group/action transform transition-all duration-500 hover:scale-110">
                  <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-orange-50/60 to-white/90 border-2 border-gray-100/50 hover:border-orange-500/50 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 h-full text-center shadow-lg hover:shadow-2xl backdrop-blur-sm group-hover/action:bg-gradient-to-br group-hover/action:from-orange-50/80 group-hover/action:to-white/90 transition-all duration-700">
                    {/* Background Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-400/10 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 p-4 rounded-3xl bg-gradient-to-br from-orange-100/80 via-orange-100/60 to-orange-50/80 group-hover/action:from-orange-200/80 group-hover/action:to-orange-100/80 transition-all duration-500 shadow-md group-hover/action:shadow-xl group-hover/action:scale-110">
                      <FileText className="h-8 w-8 text-orange-500 group-hover/action:scale-110 transition-transform duration-300" />
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                      <span className="font-black text-gray-800 group-hover/action:text-orange-600 transition-colors duration-300 text-lg">Create Quiz</span>
                      <span className="text-sm text-gray-600 font-medium group-hover/action:text-gray-700 transition-colors duration-300">Design assessments</span>
                    </div>
                  </div>
                </Link>

                {/* Analytics Action */}
                <Link href="/admin/dashboard/analytics" className="group/action transform transition-all duration-500 hover:scale-110">
                  <div className="relative overflow-hidden bg-gradient-to-br from-white/90 via-purple-50/60 to-white/90 border-2 border-gray-100/50 hover:border-purple-500/50 rounded-3xl p-6 flex flex-col items-center justify-center space-y-4 h-full text-center shadow-lg hover:shadow-2xl backdrop-blur-sm group-hover/action:bg-gradient-to-br group-hover/action:from-purple-50/80 group-hover/action:to-white/90 transition-all duration-700">
                    {/* Background Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-400/10 opacity-0 group-hover/action:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 p-4 rounded-3xl bg-gradient-to-br from-purple-100/80 via-purple-100/60 to-purple-50/80 group-hover/action:from-purple-200/80 group-hover/action:to-purple-100/80 transition-all duration-500 shadow-md group-hover/action:shadow-xl group-hover/action:scale-110">
                      <BarChart2 className="h-8 w-8 text-purple-500 group-hover/action:scale-110 transition-transform duration-300" />
                    </div>
                    
                    <div className="relative z-10 space-y-2">
                      <span className="font-black text-gray-800 group-hover/action:text-purple-600 transition-colors duration-300 text-lg">Analytics</span>
                      <span className="text-sm text-gray-600 font-medium group-hover/action:text-gray-700 transition-colors duration-300">View performance data</span>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </div>
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