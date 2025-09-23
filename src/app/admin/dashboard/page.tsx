"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, BookOpen, ClipboardList, Calendar, Clock, 
  BarChart2, CheckCircle, UserPlus, AlertCircle, ArrowRight,
  RefreshCw, TrendingUp, TrendingDown, PieChart, LineChart,
  Layers, Eye, FileText, GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for the dashboard
const stats = {
  totalUsers: 356,
  activeUsers: 289,
  totalBatches: 24,
  activeBatches: 14,
  totalQuizzes: 145,
  publishedQuizzes: 112,
  totalAttempts: 1253,
  pendingGrading: 37,
  averageScore: 76.4,
  userGrowth: 12, // percentage
  batchGrowth: 8, // percentage
  quizGrowth: -3, // percentage
  attemptGrowth: 24, // percentage
};

// Mock data for recent activity
const recentActivity = [
  { 
    id: 1, 
    type: 'enrollment', 
    user: 'Alex Johnson', 
    batch: 'AWS Solutions Architect - Batch 14', 
    timestamp: '2 hours ago' 
  },
  { 
    id: 2, 
    type: 'quiz_completion', 
    user: 'Maria Garcia', 
    quiz: 'Azure Fundamentals - Week 3', 
    score: 92, 
    timestamp: '4 hours ago' 
  },
  { 
    id: 3, 
    type: 'batch_creation', 
    batch: 'Google Cloud Associate - Batch 8', 
    admin: 'Admin', 
    timestamp: '1 day ago' 
  },
  { 
    id: 4, 
    type: 'quiz_creation', 
    quiz: 'AWS Services Deep Dive', 
    admin: 'Admin', 
    timestamp: '1 day ago' 
  },
  { 
    id: 5, 
    type: 'user_creation', 
    user: 'Chris Wong', 
    role: 'Student', 
    timestamp: '2 days ago' 
  }
];

// Mock data for upcoming events
const upcomingEvents = [
  { 
    id: 1, 
    title: 'AWS Certification Exam', 
    batch: 'AWS Solutions Architect - Batch 14', 
    date: 'Sep 25, 2025', 
    time: '10:00 AM' 
  },
  { 
    id: 2, 
    title: 'Azure Fundamentals Quiz', 
    batch: 'Azure Administrator - Batch 7', 
    date: 'Sep 27, 2025', 
    time: '2:00 PM' 
  },
  { 
    id: 3, 
    title: 'New Batch Orientation', 
    batch: 'GCP Associate Engineer - Batch 5', 
    date: 'Sep 30, 2025', 
    time: '11:00 AM' 
  }
];

// Mock data for pending tasks
const pendingTasks = [
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
  },
  { 
    id: 3, 
    task: 'Finalize upcoming quizzes', 
    count: 8, 
    priority: 'medium',
    link: '/admin/dashboard/quizzes'
  },
  { 
    id: 4, 
    task: 'Update batch schedules', 
    count: 3, 
    priority: 'low',
    link: '/admin/dashboard/batches'
  }
];

export default function AdminDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedDateTime = currentTime.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#084fa1] to-[#80b742]">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Administrator</p>
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
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : 'group-hover:animate-spin'}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{/* Stats Cards */}
        <Card className="overflow-hidden border-0 shadow-md bg-white">
          <div className="absolute h-1.5 w-full bg-gradient-to-r from-[#084fa1] to-[#084fa1]/70 top-0"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between text-sm font-medium text-gray-500">
              <span>Total Users</span>
              {stats.userGrowth > 0 ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" /> {stats.userGrowth}%
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <TrendingDown className="h-3 w-3 mr-1" /> {Math.abs(stats.userGrowth)}%
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{stats.totalUsers}</div>
              <div className="p-2.5 bg-[#084fa1]/10 rounded-full">
                <Users className="h-5 w-5 text-[#084fa1]" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.activeUsers} active users ({Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md bg-white">
          <div className="absolute h-1.5 w-full bg-gradient-to-r from-[#80b742] to-[#80b742]/70 top-0"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between text-sm font-medium text-gray-500">
              <span>Active Batches</span>
              {stats.batchGrowth > 0 ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" /> {stats.batchGrowth}%
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <TrendingDown className="h-3 w-3 mr-1" /> {Math.abs(stats.batchGrowth)}%
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{stats.activeBatches}</div>
              <div className="p-2.5 bg-[#80b742]/10 rounded-full">
                <BookOpen className="h-5 w-5 text-[#80b742]" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.totalBatches} total batches
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md bg-white">
          <div className="absolute h-1.5 w-full bg-gradient-to-r from-orange-500 to-orange-500/70 top-0"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between text-sm font-medium text-gray-500">
              <span>Published Quizzes</span>
              {stats.quizGrowth > 0 ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" /> {stats.quizGrowth}%
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <TrendingDown className="h-3 w-3 mr-1" /> {Math.abs(stats.quizGrowth)}%
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{stats.publishedQuizzes}</div>
              <div className="p-2.5 bg-orange-100 rounded-full">
                <ClipboardList className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.totalQuizzes} total quizzes
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-0 shadow-md bg-white">
          <div className="absolute h-1.5 w-full bg-gradient-to-r from-purple-500 to-purple-500/70 top-0"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between text-sm font-medium text-gray-500">
              <span>Quiz Attempts</span>
              {stats.attemptGrowth > 0 ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <TrendingUp className="h-3 w-3 mr-1" /> {stats.attemptGrowth}%
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <TrendingDown className="h-3 w-3 mr-1" /> {Math.abs(stats.attemptGrowth)}%
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold">{stats.totalAttempts}</div>
              <div className="p-2.5 bg-purple-100 rounded-full">
                <BarChart2 className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.pendingGrading} pending grading
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="bg-white p-1 shadow-sm border rounded-lg">
          <TabsTrigger value="activity" className="data-[state=active]:bg-[#084fa1] data-[state=active]:text-white rounded-md">
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#084fa1] data-[state=active]:text-white rounded-md">
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-[#084fa1] data-[state=active]:text-white rounded-md">
            Pending Tasks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity" className="space-y-4 mt-6">
          <Card className="border-0 shadow-md overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-[#084fa1]/10 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-[#084fa1]" /> 
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest actions and events across the platform
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Live Updates
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-start p-3 rounded-lg transition-all hover:bg-gray-50 border-b last:border-0"
                  >
                    <div className={`p-2 rounded-full mr-3 ${
                      activity.type === 'enrollment' ? 'bg-[#80b742]/10' :
                      activity.type === 'quiz_completion' ? 'bg-purple-100' :
                      activity.type === 'batch_creation' ? 'bg-blue-100' :
                      activity.type === 'quiz_creation' ? 'bg-orange-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'enrollment' ? 
                        <UserPlus className="h-5 w-5 text-[#80b742]" /> :
                      activity.type === 'quiz_completion' ? 
                        <CheckCircle className="h-5 w-5 text-purple-500" /> :
                      activity.type === 'batch_creation' ? 
                        <BookOpen className="h-5 w-5 text-blue-500" /> :
                      activity.type === 'quiz_creation' ? 
                        <ClipboardList className="h-5 w-5 text-orange-500" /> :
                        <Users className="h-5 w-5 text-gray-500" />
                      }
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.type === 'enrollment' && 
                          <>
                            <span className="font-semibold">{activity.user}</span> enrolled in <span className="font-semibold">{activity.batch}</span>
                          </>
                        }
                        {activity.type === 'quiz_completion' && 
                          <>
                            <span className="font-semibold">{activity.user}</span> completed <span className="font-semibold">{activity.quiz}</span> with a score of {activity.score}%
                          </>
                        }
                        {activity.type === 'batch_creation' && 
                          <>
                            <span className="font-semibold">{activity.batch}</span> was created by <span className="font-semibold">{activity.admin}</span>
                          </>
                        }
                        {activity.type === 'quiz_creation' && 
                          <>
                            <span className="font-semibold">{activity.quiz}</span> was created by <span className="font-semibold">{activity.admin}</span>
                          </>
                        }
                        {activity.type === 'user_creation' && 
                          <>
                            New <span className="font-semibold">{activity.role}</span> account created: <span className="font-semibold">{activity.user}</span>
                          </>
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                    </div>
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
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20">
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