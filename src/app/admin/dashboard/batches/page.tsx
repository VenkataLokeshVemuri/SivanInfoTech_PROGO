'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  PlusCircle, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  GraduationCap,
  BarChart3,
  PieChart,
  BookOpen,
  CalendarDays,
  UserCheck,
  Award,
  DollarSign,
  MessageCircle,
  XCircle,
  TrendingUp,
  PlayCircle,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import backendAPI from '@/lib/backend-api';

// Type definitions
interface Revenue {
  totalRevenue: number;
  paidStudents: number;
  pendingPayments: number;
}

interface Statistics {
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  attendanceRate: number;
}

interface BatchAnalysis {
  batchInfo: any;
  statistics: Statistics;
  revenue: Revenue;
  students: any[];
  enrollments: any[];
}

interface Student {
  firstName: string;
  lastName: string;
  email: string;
  enrollmentStatus: string;
  progress: number;
  enrolledDate: string;
}

interface Module {
  moduleId: string;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  order: number;
}

interface Schedule {
  scheduleId: string;
  topic: string;
  description: string;
  dateTime: string;
  duration: number;
  instructor: string;
  type: string;
  status: string;
  meetingLink?: string;
}

interface Trainee {
  id: number;
  name: string;
  progress: number;
  status: string;
}

interface Batch {
  id: string;
  name: string;
  code: string;
  courseId: string;
  courseTitle: string;
  status: string;
  startDate: string;
  endDate: string;
  timing: string;
  mode: string;
  studentsCount: number;
  progress?: number;
  modules?: number;
  completedModules?: number;
  currentModule?: string;
  nextClass?: string;
  trainer?: string;
  trainees?: Trainee[];
  recentActivity?: string;
  lastUpdated?: string;
}

const mockBatches: Batch[] = [
  {
    id: '1',
    name: 'AWS Solutions Architect - Batch 14',
    code: 'AWS-SA-14',
    courseId: 'course_aws_sa',
    courseTitle: 'AWS Solutions Architect Associate',
    status: 'ongoing',
    startDate: 'Aug 15, 2025',
    endDate: 'Oct 30, 2025',
    timing: '10:00 AM - 12:00 PM',
    mode: 'Online',
    studentsCount: 24,
    progress: 65,
    modules: 12,
    completedModules: 8,
    currentModule: 'VPC and Networking',
    nextClass: 'Oct 2, 2025 at 10:00 AM',
    trainer: 'Rajesh Kumar',
    trainees: [
      { id: 1, name: 'Ankit Sharma', progress: 78, status: 'ahead' },
      { id: 2, name: 'Priya Patel', progress: 65, status: 'on-track' },
      { id: 3, name: 'Rohit Singh', progress: 45, status: 'behind' },
      { id: 4, name: 'Sneha Reddy', progress: 82, status: 'ahead' },
      { id: 5, name: 'Vikram Gupta', progress: 58, status: 'on-track' }
    ],
    recentActivity: 'Module 8 completed, Quiz results published',
    lastUpdated: '2 hours ago'
  },
  {
    id: '2',
    name: 'Azure Fundamentals - Batch 7',
    code: 'AZ-900-7',
    courseId: 'course_azure_fund',
    courseTitle: 'Microsoft Azure Fundamentals',
    status: 'upcoming',
    startDate: 'Oct 5, 2025',
    endDate: 'Nov 20, 2025',
    timing: '2:00 PM - 4:00 PM',
    mode: 'Hybrid',
    studentsCount: 18,
    progress: 0,
    modules: 10,
    completedModules: 0,
    currentModule: 'Pre-course preparation',
    nextClass: 'Oct 5, 2025 at 2:00 PM',
    trainer: 'Priya Sharma',
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
    id: '3',
    name: 'GCP Associate Engineer - Batch 5',
    code: 'GCP-AE-5',
    courseId: 'course_gcp_ace',
    courseTitle: 'Google Cloud Associate Cloud Engineer',
    status: 'completed',
    startDate: 'Jun 1, 2025',
    endDate: 'Aug 15, 2025',
    timing: '9:00 AM - 11:00 AM',
    mode: 'Online',
    studentsCount: 22,
    progress: 100,
    modules: 14,
    completedModules: 14,
    currentModule: 'Course completed',
    nextClass: 'Course finished',
    trainer: 'Amit Verma',
    trainees: [
      { id: 11, name: 'Sarah Johnson', progress: 100, status: 'completed' },
      { id: 12, name: 'Mike Chen', progress: 95, status: 'completed' },
      { id: 13, name: 'Ravi Mehta', progress: 100, status: 'completed' },
      { id: 14, name: 'Nina Patel', progress: 90, status: 'completed' },
      { id: 15, name: 'Alex Turner', progress: 88, status: 'completed' }
    ],
    recentActivity: 'Certificates generated and sent',
    lastUpdated: '3 days ago'
  }
];

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showModulesModal, setShowModulesModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCreateModuleModal, setShowCreateModuleModal] = useState(false);
  const [showScheduleClassModal, setShowScheduleClassModal] = useState(false);
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  
  // Data states
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [batchAnalysis, setBatchAnalysis] = useState<BatchAnalysis | null>(null);
  const [batchStudents, setBatchStudents] = useState<Student[]>([]);
  const [batchModules, setBatchModules] = useState<Module[]>([]);
  const [batchSchedule, setBatchSchedule] = useState<Schedule[]>([]);
  
  // Form states
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    duration: '',
    topics: [] as string[],
    order: 1
  });
  
  const [scheduleForm, setScheduleForm] = useState({
    topic: '',
    description: '',
    dateTime: '',
    duration: 90,
    instructor: '',
    type: 'lecture',
    meetingLink: ''
  });
  
  const [createBatchForm, setCreateBatchForm] = useState({
    batchId: '',
    courseId: '',
    courseTitle: '',
    startDate: '',
    endDate: '',
    timing: '',
    mode: 'Online',
    maxStudents: '',
    instructor: '',
    status: 'upcoming'
  });

  // Event handlers
  const handleViewAnalysis = async (batch: Batch) => {
    setSelectedBatch(batch);
    setShowAnalysisModal(true);
    
    try {
      const response = await backendAPI.getBatchAnalysis(batch.id);
      const analysis = response.data?.analysis;
      if (analysis) {
        setBatchAnalysis(analysis);
      }
    } catch (error) {
      toast.error('Failed to load batch analysis');
    }
  };

  const handleViewStudents = async (batch: Batch) => {
    setSelectedBatch(batch);
    setShowStudentsModal(true);
    
    try {
      const response = await backendAPI.getBatchStudents(batch.id);
      const students = response.data?.students || [];
      setBatchStudents(students);
    } catch (error) {
      toast.error('Failed to load students');
    }
  };

  const handleViewModules = async (batch: Batch) => {
    setSelectedBatch(batch);
    setShowModulesModal(true);
    
    try {
      const response = await backendAPI.getBatchModules(batch.id);
      const modules = response.data?.modules || [];
      setBatchModules(modules);
    } catch (error) {
      toast.error('Failed to load modules');
    }
  };

  const handleViewSchedule = async (batch: Batch) => {
    setSelectedBatch(batch);
    setShowScheduleModal(true);
    
    try {
      const response = await backendAPI.getBatchSchedule(batch.id);
      const schedule = response.data?.schedule || [];
      setBatchSchedule(schedule);
    } catch (error) {
      toast.error('Failed to load schedule');
    }
  };

  const handleCreateModule = async () => {
    if (!selectedBatch) return;
    
    try {
      await backendAPI.createBatchModule(selectedBatch.id, moduleForm);
      toast.success('Module created successfully');
      setShowCreateModuleModal(false);
      setModuleForm({ title: '', description: '', duration: '', topics: [], order: 1 });
      // Refresh modules
      const response = await backendAPI.getBatchModules(selectedBatch.id);
      const modules = response.data?.modules || [];
      setBatchModules(modules);
    } catch (error) {
      toast.error('Failed to create module');
    }
  };

  const handleScheduleClass = async () => {
    if (!selectedBatch) return;
    
    try {
      await backendAPI.scheduleClass(selectedBatch.id, scheduleForm);
      toast.success('Class scheduled successfully');
      setShowScheduleClassModal(false);
      setScheduleForm({
        topic: '',
        description: '',
        dateTime: '',
        duration: 90,
        instructor: '',
        type: 'lecture',
        meetingLink: ''
      });
      // Refresh schedule
      const response = await backendAPI.getBatchSchedule(selectedBatch.id);
      const schedule = response.data?.schedule || [];
      setBatchSchedule(schedule);
    } catch (error) {
      toast.error('Failed to schedule class');
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    if (confirm('Are you sure you want to delete this batch?')) {
      try {
        await backendAPI.deleteBatch(batchId);
        toast.success('Batch deleted successfully');
        // Refresh batches list
        window.location.reload();
      } catch (error) {
        toast.error('Failed to delete batch');
      }
    }
  };

  const handleCreateBatch = async () => {
    try {
      const response = await backendAPI.createBatch(createBatchForm);
      if (response.status === 200) {
        toast.success('Batch created successfully');
        setShowCreateBatchModal(false);
        setCreateBatchForm({
          batchId: '',
          courseId: '',
          courseTitle: '',
          startDate: '',
          endDate: '',
          timing: '',
          mode: 'Online',
          maxStudents: '',
          instructor: '',
          status: 'upcoming'
        });
        // Refresh batches data
        const batchesResponse = await backendAPI.getAllBatches();
        if (batchesResponse.data?.batches) {
          setBatches(batchesResponse.data.batches);
        }
      }
    } catch (error) {
      toast.error('Failed to create batch');
    }
  };

  // Load available courses for batch creation
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load courses
        const coursesResponse = await backendAPI.getCourseAndBatchDetails();
        if (coursesResponse.data?.details) {
          setAvailableCourses(coursesResponse.data.details);
        }
        
        // Load batches
        const batchesResponse = await backendAPI.getAllBatches();
        if (batchesResponse.data?.batches) {
          setBatches(batchesResponse.data.batches);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load data');
        // Fallback to mock data if API fails
        setBatches(mockBatches);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter batches based on search and status
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const activeBatches = batches.filter(batch => batch.status === 'ongoing').length;
  const completedBatches = batches.filter(batch => batch.status === 'completed').length;
  const totalStudents = batches.reduce((total, batch) => total + (batch.studentsCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-16 w-40 h-40 bg-gradient-to-br from-green-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="p-8 space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Users className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black">Batch Management</h1>
                  <p className="text-blue-100 text-xl font-medium">Comprehensive batch oversight and control</p>
                </div>
              </div>
              
              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <GraduationCap className="h-6 w-6 text-blue-200" />
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="text-3xl font-black">{batches.length}</div>
                  <div className="text-blue-100 font-medium">Total Batches</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <PlayCircle className="h-6 w-6 text-green-300" />
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="text-3xl font-black">{activeBatches}</div>
                  <div className="text-blue-100 font-medium">Active Batches</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <CheckCircle className="h-6 w-6 text-yellow-300" />
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="text-3xl font-black">{completedBatches}</div>
                  <div className="text-blue-100 font-medium">Completed</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <Users className="h-6 w-6 text-purple-300" />
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="text-3xl font-black">{totalStudents}</div>
                  <div className="text-blue-100 font-medium">Total Students</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={() => setShowCreateBatchModal(true)}
                className="bg-white text-blue-600 hover:bg-gray-50 transition-all duration-300 hover:scale-105 font-semibold px-8"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Batch
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search batches by name, code, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter by Status
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('ongoing')}>
                      Active Batches
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('upcoming')}>
                      Upcoming Batches
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                      Completed Batches
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map((batch) => (
            <Card key={batch.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                      {batch.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {batch.code} • {batch.courseTitle}
                    </CardDescription>
                  </div>
                  <Badge className={`ml-2 ${
                    batch.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                    batch.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    batch.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {batch.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{batch.startDate} - {batch.endDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{batch.timing} • {batch.mode}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{batch.studentsCount} students enrolled</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <div className="w-full space-y-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Manage Batch
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => handleViewAnalysis(batch)}>
                        <PieChart className="h-4 w-4 mr-2" />
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewStudents(batch)}>
                        <Users className="h-4 w-4 mr-2" />
                        View Students
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewModules(batch)}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Manage Modules
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewSchedule(batch)}>
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Class Schedule
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDeleteBatch(batch.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Batch
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredBatches.length === 0 && (
          <Card className="text-center py-12 bg-white/90 backdrop-blur-sm">
            <CardContent>
              <GraduationCap className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No batches found</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first batch or adjust your search filters.</p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Batch
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analysis Modal */}
      <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Batch Analysis - {selectedBatch?.name}</DialogTitle>
            <DialogDescription>
              Comprehensive analytics and insights for this batch
            </DialogDescription>
          </DialogHeader>
          
          {batchAnalysis && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{batchAnalysis.statistics.totalStudents}</div>
                      <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">{batchAnalysis.statistics.activeStudents}</div>
                      <div className="text-sm text-gray-600">Active</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold">{batchAnalysis.statistics.completedStudents}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">₹{batchAnalysis.revenue.totalRevenue.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Progress and Attendance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Average Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate</span>
                      <span>{batchAnalysis.statistics.averageProgress}%</span>
                    </div>
                    <Progress value={batchAnalysis.statistics.averageProgress} className="h-2" />
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Attendance Rate</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Attendance</span>
                      <span>{batchAnalysis.statistics.attendanceRate}%</span>
                    </div>
                    <Progress value={batchAnalysis.statistics.attendanceRate} className="h-2" />
                  </div>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Students Modal */}
      <Dialog open={showStudentsModal} onOpenChange={setShowStudentsModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Students in {selectedBatch?.name}</DialogTitle>
            <DialogDescription>
              View and manage all students enrolled in this batch
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {batchStudents.length} students enrolled
              </div>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-2">Student</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Progress</th>
                    <th className="pb-2">Enrolled Date</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {batchStudents.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <div className="font-medium">{student.firstName} {student.lastName}</div>
                          <div className="text-sm text-gray-600">{student.email}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge className={
                          student.enrollmentStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                          student.enrollmentStatus === 'Certified' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {student.enrollmentStatus}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="w-20">
                          <Progress value={student.progress} className="h-2" />
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {new Date(student.enrolledDate).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modules Modal */}
      <Dialog open={showModulesModal} onOpenChange={setShowModulesModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modules for {selectedBatch?.name}</DialogTitle>
            <DialogDescription>
              Manage course modules and curriculum for this batch
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {batchModules.length} modules configured
              </div>
              <Button onClick={() => setShowCreateModuleModal(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Module
              </Button>
            </div>
            
            <div className="grid gap-4">
              {batchModules.map((module) => (
                <Card key={module.moduleId} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Duration: {module.duration}</span>
                        <span>Topics: {module.topics.length}</span>
                        <span>Order: {module.order}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Module
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Module
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Class Schedule for {selectedBatch?.name}</DialogTitle>
            <DialogDescription>
              View and manage upcoming classes and sessions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {batchSchedule.length} classes scheduled
              </div>
              <Button onClick={() => setShowScheduleClassModal(true)}>
                <CalendarDays className="h-4 w-4 mr-2" />
                Schedule Class
              </Button>
            </div>
            
            <div className="space-y-4">
              {batchSchedule.map((schedule) => (
                <Card key={schedule.scheduleId} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{schedule.topic}</h3>
                        <Badge className={
                          schedule.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          schedule.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {schedule.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{schedule.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{new Date(schedule.dateTime).toLocaleString()}</span>
                        <span>{schedule.duration} minutes</span>
                        <span>{schedule.type}</span>
                        <span>Instructor: {schedule.instructor}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Module Modal */}
      <Dialog open={showCreateModuleModal} onOpenChange={setShowCreateModuleModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
            <DialogDescription>
              Add a new module to the batch curriculum
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="moduleTitle">Module Title</Label>
              <Input
                id="moduleTitle"
                value={moduleForm.title}
                onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                placeholder="Enter module title"
              />
            </div>
            
            <div>
              <Label htmlFor="moduleDescription">Description</Label>
              <Textarea
                id="moduleDescription"
                value={moduleForm.description}
                onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                placeholder="Enter module description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="moduleDuration">Duration</Label>
                <Input
                  id="moduleDuration"
                  value={moduleForm.duration}
                  onChange={(e) => setModuleForm({...moduleForm, duration: e.target.value})}
                  placeholder="e.g., 2 weeks"
                />
              </div>
              <div>
                <Label htmlFor="moduleOrder">Order</Label>
                <Input
                  id="moduleOrder"
                  type="number"
                  value={moduleForm.order}
                  onChange={(e) => setModuleForm({...moduleForm, order: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
            </div>
            
            <div>
              <Label>Topics (one per line)</Label>
              <Textarea
                value={moduleForm.topics.join('\n')}
                onChange={(e) => setModuleForm({...moduleForm, topics: e.target.value.split('\n').filter(t => t.trim())})}
                placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateModuleModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateModule}>
                Create Module
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Class Modal */}
      <Dialog open={showScheduleClassModal} onOpenChange={setShowScheduleClassModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Class</DialogTitle>
            <DialogDescription>
              Schedule a new class session for the batch
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="classTopic">Class Topic</Label>
              <Input
                id="classTopic"
                value={scheduleForm.topic}
                onChange={(e) => setScheduleForm({...scheduleForm, topic: e.target.value})}
                placeholder="Enter class topic"
              />
            </div>
            
            <div>
              <Label htmlFor="classDescription">Description</Label>
              <Textarea
                id="classDescription"
                value={scheduleForm.description}
                onChange={(e) => setScheduleForm({...scheduleForm, description: e.target.value})}
                placeholder="Enter class description"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="classDateTime">Date & Time</Label>
                <Input
                  id="classDateTime"
                  type="datetime-local"
                  value={scheduleForm.dateTime}
                  onChange={(e) => setScheduleForm({...scheduleForm, dateTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="classDuration">Duration (minutes)</Label>
                <Input
                  id="classDuration"
                  type="number"
                  value={scheduleForm.duration}
                  onChange={(e) => setScheduleForm({...scheduleForm, duration: parseInt(e.target.value)})}
                  min="30"
                  step="15"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="classInstructor">Instructor</Label>
                <Input
                  id="classInstructor"
                  value={scheduleForm.instructor}
                  onChange={(e) => setScheduleForm({...scheduleForm, instructor: e.target.value})}
                  placeholder="Instructor name"
                />
              </div>
              <div>
                <Label htmlFor="classType">Class Type</Label>
                <Select value={scheduleForm.type} onValueChange={(value) => setScheduleForm({...scheduleForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="lab">Lab Session</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="discussion">Discussion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="meetingLink">Meeting Link (optional)</Label>
              <Input
                id="meetingLink"
                value={scheduleForm.meetingLink}
                onChange={(e) => setScheduleForm({...scheduleForm, meetingLink: e.target.value})}
                placeholder="https://meet.google.com/..."
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowScheduleClassModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleClass}>
                Schedule Class
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Batch Modal */}
      <Dialog open={showCreateBatchModal} onOpenChange={setShowCreateBatchModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="border-b border-gray-100 pb-6 bg-white">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Create New Batch
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Set up a new training batch with comprehensive configuration options
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 py-6 bg-white">
            {/* Basic Information Section */}
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="batchId" className="text-sm font-medium text-gray-700">
                    Batch ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="batchId"
                    value={createBatchForm.batchId}
                    onChange={(e) => setCreateBatchForm({...createBatchForm, batchId: e.target.value})}
                    placeholder="e.g., AWS-SA-15"
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500">Unique identifier for the batch</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="courseSelection" className="text-sm font-medium text-gray-700">
                    Course <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={createBatchForm.courseId} 
                    onValueChange={(value) => {
                      const selectedCourse = availableCourses.find(course => course.courseid === value);
                      setCreateBatchForm({
                        ...createBatchForm, 
                        courseId: value,
                        courseTitle: selectedCourse?.title || ''
                      });
                    }}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {availableCourses.map((course) => (
                        <SelectItem key={course.courseid} value={course.courseid}>
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-blue-500" />
                            <span>{course.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="space-y-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Schedule & Timing</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={createBatchForm.startDate}
                    onChange={(e) => setCreateBatchForm({...createBatchForm, startDate: e.target.value})}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={createBatchForm.endDate}
                    onChange={(e) => setCreateBatchForm({...createBatchForm, endDate: e.target.value})}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timing" className="text-sm font-medium text-gray-700">
                    Class Timing <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="timing"
                    value={createBatchForm.timing}
                    onChange={(e) => setCreateBatchForm({...createBatchForm, timing: e.target.value})}
                    placeholder="e.g., 10:00 AM - 12:00 PM"
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                  <p className="text-xs text-gray-500">Daily class schedule</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mode" className="text-sm font-medium text-gray-700">
                    Delivery Mode <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={createBatchForm.mode} 
                    onValueChange={(value) => setCreateBatchForm({...createBatchForm, mode: value})}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select delivery mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Online">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Online</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Offline">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Offline</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Hybrid">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Hybrid</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Additional Configuration */}
            <div className="space-y-6 bg-green-50 p-6 rounded-lg border border-green-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Batch Configuration</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxStudents" className="text-sm font-medium text-gray-700">
                    Maximum Students
                  </Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={createBatchForm.maxStudents || ''}
                    onChange={(e) => setCreateBatchForm({...createBatchForm, maxStudents: e.target.value})}
                    placeholder="25"
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructor" className="text-sm font-medium text-gray-700">
                    Lead Instructor
                  </Label>
                  <Input
                    id="instructor"
                    value={createBatchForm.instructor || ''}
                    onChange={(e) => setCreateBatchForm({...createBatchForm, instructor: e.target.value})}
                    placeholder="Instructor name"
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Initial Status
                  </Label>
                  <Select 
                    value={createBatchForm.status || 'upcoming'} 
                    onValueChange={(value) => setCreateBatchForm({...createBatchForm, status: value})}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 bg-white">
            <Button 
              variant="outline" 
              onClick={() => setShowCreateBatchModal(false)}
              className="px-6 py-2 border-gray-200 hover:bg-gray-50 bg-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateBatch}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Batch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}