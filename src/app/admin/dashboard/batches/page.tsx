"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, PlusCircle, MoreHorizontal,
  Edit, Trash2, Users, Calendar, BookOpen,
  CheckCircle, XCircle, Clock, Loader2, Activity,
  TrendingUp, UserCheck, CheckCircle2, AlertCircle,
  Clock3, PlayCircle, Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { backendAPI } from '@/lib/backend-api';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { useToast } from '@/hooks/use-toast';

// Types for batch and trainee data
interface Trainee {
  id: number;
  name: string;
  progress: number;
  status: 'active' | 'ahead' | 'behind' | 'completed' | 'enrolled';
}

interface Batch {
  id: number;
  name: string;
  code: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  studentsCount: number;
  trainer: string;
  modules: number;
  completedModules: number;
  currentModule: string;
  nextClass: string;
  trainees?: Trainee[];  // Make trainees optional
  recentActivity: string;
  lastUpdated: string;
}

// Mock batch data with enhanced progress tracking and trainee information
const mockBatches = [
  {
    id: 1,
    name: 'AWS Solutions Architect - Batch 14',
    code: 'AWS-SA-14',
    status: 'ongoing',
    startDate: 'Aug 15, 2025',
    endDate: 'Oct 30, 2025',
    progress: 65,
    studentsCount: 24,
    trainer: 'Dr. Rajesh Kumar',
    modules: 12,
    completedModules: 8,
    currentModule: 'VPC & Networking',
    nextClass: 'Oct 3, 2025 at 2:00 PM',
    trainees: [
      { id: 1, name: 'Alex Johnson', progress: 68, status: 'active' },
      { id: 2, name: 'Maria Garcia', progress: 65, status: 'active' },
      { id: 3, name: 'Priya Sharma', progress: 72, status: 'ahead' },
      { id: 4, name: 'Rohit Patel', progress: 58, status: 'behind' },
      { id: 5, name: 'Sarah Wilson', progress: 63, status: 'active' }
    ],
    recentActivity: 'Module 8 completed by 18/24 students',
    lastUpdated: '2 hours ago'
  },
  {
    id: 2,
    name: 'Azure Administrator - Batch 7',
    code: 'AZ-ADMIN-7',
    status: 'upcoming',
    startDate: 'Oct 5, 2025',
    endDate: 'Dec 20, 2025',
    progress: 0,
    studentsCount: 18,
    trainer: 'Priya Sharma',
    modules: 10,
    completedModules: 0,
    currentModule: 'Pre-course preparation',
    nextClass: 'Oct 5, 2025 at 10:00 AM',
    trainees: [
      { id: 6, name: 'John Smith', progress: 0, status: 'enrolled' },
      { id: 7, name: 'Lisa Wong', progress: 0, status: 'enrolled' },
      { id: 8, name: 'David Kumar', progress: 0, status: 'enrolled' },
      { id: 9, name: 'Emma Brown', progress: 0, status: 'enrolled' },
      { id: 10, name: 'Raj Gupta', progress: 0, status: 'enrolled' }
    ],
    recentActivity: 'Welcome email sent to all students',
    lastUpdated: '1 day ago'
  },
  {
    id: 3,
    name: 'GCP Associate Engineer - Batch 5',
    code: 'GCP-AE-5',
    status: 'ongoing',
    startDate: 'Jul 10, 2025',
    endDate: 'Sep 25, 2025',
    progress: 85,
    studentsCount: 15,
    trainer: 'Amit Patel',
    modules: 8,
    completedModules: 7,
    currentModule: 'Final Project & Certification Prep',
    nextClass: 'Oct 2, 2025 at 3:00 PM',
    trainees: [
      { id: 11, name: 'Nina Patel', progress: 88, status: 'ahead' },
      { id: 12, name: 'Michael Chen', progress: 85, status: 'active' },
      { id: 13, name: 'Sophia Lee', progress: 82, status: 'active' },
      { id: 14, name: 'Carlos Rodriguez', progress: 90, status: 'ahead' },
      { id: 15, name: 'Aisha Khan', progress: 78, status: 'behind' }
    ],
    recentActivity: 'Certification practice test completed',
    lastUpdated: '30 minutes ago'
  },
  {
    id: 4,
    name: 'AWS Developer - Batch 9',
    code: 'AWS-DEV-9',
    status: 'completed',
    startDate: 'May 15, 2025',
    endDate: 'Aug 1, 2025',
    progress: 100,
    studentsCount: 22,
    trainer: 'Sneha Gupta',
    modules: 14,
    completedModules: 14,
    currentModule: 'Course Completed',
    nextClass: 'Course completed',
    trainees: [
      { id: 16, name: 'James Wilson', progress: 100, status: 'completed' },
      { id: 17, name: 'Elena Volkov', progress: 100, status: 'completed' },
      { id: 18, name: 'Ahmed Hassan', progress: 98, status: 'completed' },
      { id: 19, name: 'Grace Kim', progress: 100, status: 'completed' },
      { id: 20, name: 'Marco Silva', progress: 95, status: 'completed' }
    ],
    recentActivity: 'All students completed certification',
    lastUpdated: '2 weeks ago'
  },
  {
    id: 5,
    name: 'Azure Solutions Architect - Batch 3',
    code: 'AZ-SA-3',
    status: 'upcoming',
    startDate: 'Nov 10, 2025',
    endDate: 'Jan 25, 2026',
    progress: 0,
    studentsCount: 20,
    trainer: 'Vikram Singh',
    modules: 12,
    completedModules: 0,
    currentModule: 'Pre-course preparation',
    nextClass: 'Nov 10, 2025 at 9:00 AM',
    trainees: [
      { id: 21, name: 'Robert Taylor', progress: 0, status: 'enrolled' },
      { id: 22, name: 'Jennifer Davis', progress: 0, status: 'enrolled' },
      { id: 23, name: 'Kevin Zhang', progress: 0, status: 'enrolled' },
      { id: 24, name: 'Laura Martinez', progress: 0, status: 'enrolled' },
      { id: 25, name: 'Tom Anderson', progress: 0, status: 'enrolled' }
    ],
    recentActivity: 'Welcome email sent to all students',
    lastUpdated: '5 days ago'
  }
];

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { user, isAuthenticated, isAdmin } = useBackendAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/auth');
      return;
    }
  }, [isAuthenticated, isAdmin, router]);

  // Load batches data
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadBatches();
    }
  }, [isAuthenticated, isAdmin]);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const response = await backendAPI.getAllBatches();
      if (response.success && response.data) {
        setBatches(response.data.batches || []);
      } else {
        // Fallback to mock data if API fails
        setBatches(mockBatches as Batch[]);
        toast({
          title: "Info",
          description: "Using mock data - backend not available",
          variant: "default",
        });
      }
    } catch (error) {
      // Fallback to mock data on error
      setBatches(mockBatches as Batch[]);
      toast({
        title: "Info", 
        description: "Using mock data - backend not available",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (!confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await backendAPI.deleteBatch(batchId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Batch deleted successfully",
        });
        loadBatches(); // Reload the list
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete batch",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete batch",
        variant: "destructive",
      });
    }
  };

  // Show loading state while checking authentication
  if (!isAuthenticated || !isAdmin || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Filter batches based on search and status
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.trainer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const activeBatches = batches.filter(batch => batch.status === 'ongoing').length;
  const completedBatches = batches.filter(batch => batch.status === 'completed').length;
  const totalStudents = batches.reduce((total, batch) => total + (batch.studentsCount || 0), 0);

  // Get current date for comparison
  const currentDate = new Date('September 23, 2025');

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ongoing':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Ongoing</Badge>;
      case 'upcoming':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="p-8 space-y-8">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Batch Management</h1>
                    <p className="text-blue-100 text-lg">Monitor training batches and student progress</p>
                  </div>
                </div>
                
                {/* Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-200" />
                      <span className="text-sm font-medium text-blue-100">Total Batches</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{batches.length}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-200" />
                      <span className="text-sm font-medium text-blue-100">Active</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{activeBatches}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-yellow-200" />
                      <span className="text-sm font-medium text-blue-100">Completed</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{completedBatches}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-purple-200" />
                      <span className="text-sm font-medium text-blue-100">Students</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{totalStudents}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link href="/admin/dashboard/batches/create">
                  <Button className="w-full lg:w-auto bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Batch
                  </Button>
                </Link>
                <Button variant="outline" className="w-full lg:w-auto border-white/30 text-white hover:bg-white/10">
                  <Activity className="h-4 w-4 mr-2" />
                  Batch Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search batches by name, code, or trainer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList className="grid grid-cols-4 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="ongoing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Ongoing
                    </TabsTrigger>
                    <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Upcoming
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Completed
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Batches Overview ({filteredBatches.length} batches)
          </CardTitle>
          <CardDescription className="text-gray-600">
            Manage training batches, monitor progress, and track student performance
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b transition-colors">
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Batch
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden md:table-cell">
                      Progress
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden lg:table-cell">
                      Students
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden lg:table-cell">
                      Trainer
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBatches.map(batch => (
                    <tr 
                      key={batch.id} 
                      className="border-b transition-colors hover:bg-gray-50"
                    >
                      <td className="p-4 align-middle">
                        <div>
                          <div className="font-medium">{batch.name}</div>
                          <div className="text-gray-500 text-xs">{batch.code}</div>
                          <div className="text-gray-500 text-xs flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {batch.startDate} - {batch.endDate}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {getStatusBadge(batch.status)}
                      </td>
                      <td className="p-4 align-middle hidden md:table-cell">
                        <div className="space-y-3">
                          {/* Progress Bar and Stats */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">{batch.completedModules}/{batch.modules} modules</span>
                              <span className="font-medium">{batch.progress}%</span>
                            </div>
                            <Progress value={batch.progress} className="h-2" />
                          </div>

                          {/* Current Activity */}
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200/50">
                            <div className="flex items-start space-x-2">
                              <Activity className="h-4 w-4 text-green-600 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-green-800">Current Module:</p>
                                <p className="text-xs text-green-700 truncate">{batch.currentModule}</p>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Clock3 className="h-3 w-3 text-green-600" />
                                  <span className="text-xs text-green-600">{batch.nextClass}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Recent Activity */}
                          <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-200/50">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="h-3 w-3 text-blue-600" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-blue-800">Recent Activity:</p>
                                <p className="text-xs text-blue-700 truncate">{batch.recentActivity}</p>
                                <p className="text-xs text-blue-500 mt-1">{batch.lastUpdated}</p>
                              </div>
                            </div>
                          </div>

                          {/* Top Trainees Preview */}
                          <div className="bg-white rounded-lg p-2.5 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-1">
                                <UserCheck className="h-3 w-3 text-gray-600" />
                                <span className="text-xs font-medium text-gray-700">Top Performers</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-gray-500 hover:text-blue-600"
                                title="View all trainees"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="space-y-1.5">
                              {batch.trainees && Array.isArray(batch.trainees) && batch.trainees.slice(0, 3).map((trainee: Trainee, index: number) => (
                                <div key={trainee.id} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      trainee.status === 'ahead' ? 'bg-green-500' :
                                      trainee.status === 'behind' ? 'bg-red-500' :
                                      trainee.status === 'completed' ? 'bg-blue-500' :
                                      'bg-gray-400'
                                    }`} />
                                    <span className="text-xs text-gray-700 truncate max-w-[80px]">
                                      {trainee.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs font-medium text-gray-600">
                                      {trainee.progress}%
                                    </span>
                                    {trainee.status === 'ahead' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                                    {trainee.status === 'behind' && <AlertCircle className="h-3 w-3 text-red-500" />}
                                  </div>
                                </div>
                              ))}
                              {batch.trainees && batch.trainees.length > 3 && (
                                <div className="text-center pt-1 border-t border-gray-100">
                                  <span className="text-xs text-gray-500">
                                    +{batch.trainees.length - 3} more trainees
                                  </span>
                                </div>
                              )}
                              {(!batch.trainees || batch.trainees.length === 0) && (
                                <div className="text-center py-2">
                                  <span className="text-xs text-gray-500">
                                    No trainees enrolled yet
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{batch.studentsCount} students</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle hidden lg:table-cell">
                        {batch.trainer}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/dashboard/batches/${batch.id}`}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:border-green-300 transition-all duration-200"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 border-0 shadow-xl bg-white rounded-xl overflow-hidden">
                              <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-700 rounded-lg transition-all duration-200 group">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors mr-3">
                                  <Users className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">View Students</div>
                                  <div className="text-xs text-gray-500">See enrolled students</div>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 rounded-lg transition-all duration-200 group">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors mr-3">
                                  <BookOpen className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">Manage Modules</div>
                                  <div className="text-xs text-gray-500">Edit course content</div>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-green-50 hover:text-purple-700 rounded-lg transition-all duration-200 group">
                                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors mr-3">
                                  <Clock className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">Schedule Classes</div>
                                  <div className="text-xs text-gray-500">Set class timings</div>
                                </div>
                              </DropdownMenuItem>
                              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-2 my-2"></div>
                              <DropdownMenuItem 
                                className="cursor-pointer flex items-center px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group"
                                onClick={() => handleDeleteBatch(batch.code)}
                              >
                                <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors mr-3">
                                  <Trash2 className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">Delete Batch</div>
                                  <div className="text-xs text-gray-500">Remove permanently</div>
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredBatches.length}</span> of{" "}
            <span className="font-medium">{mockBatches.length}</span> batches
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
}