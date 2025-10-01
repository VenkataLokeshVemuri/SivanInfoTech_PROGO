"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, PlusCircle, MoreHorizontal,
  Edit, Trash2, FileText, Eye, Download,
  CheckCircle, Clock, BarChart, Loader2, Award
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { backendAPI } from '@/lib/backend-api';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { useToast } from '@/hooks/use-toast';

// Mock quiz data
const mockQuizzes = [
  {
    id: 1,
    title: 'AWS Solutions Architect Associate Final Assessment',
    code: 'AWS-SAA-FIN',
    status: 'active',
    createdDate: 'Aug 20, 2025',
    questionCount: 65,
    duration: 120,
    passScore: 72,
    difficulty: 'advanced',
    course: 'AWS Solutions Architect',
    attempts: 234,
    avgScore: 76.8
  },
  {
    id: 2,
    title: 'Azure Fundamentals - Module 1 Quiz',
    code: 'AZ-FUND-M1',
    status: 'active',
    createdDate: 'Jul 15, 2025',
    questionCount: 25,
    duration: 30,
    passScore: 70,
    difficulty: 'beginner',
    course: 'Azure Fundamentals',
    attempts: 345,
    avgScore: 81.2
  },
  {
    id: 3,
    title: 'GCP Associate Cloud Engineer - Practice Test',
    code: 'GCP-ACE-PT',
    status: 'active',
    createdDate: 'Sep 05, 2025',
    questionCount: 50,
    duration: 90,
    passScore: 75,
    difficulty: 'intermediate',
    course: 'GCP Associate Cloud Engineer',
    attempts: 178,
    avgScore: 73.5
  },
  {
    id: 4,
    title: 'AWS Developer - CI/CD Pipeline Quiz',
    code: 'AWS-DEV-CICD',
    status: 'draft',
    createdDate: 'Sep 18, 2025',
    questionCount: 30,
    duration: 45,
    passScore: 70,
    difficulty: 'intermediate',
    course: 'AWS Developer',
    attempts: 0,
    avgScore: 0
  },
  {
    id: 5,
    title: 'Azure Security - Module 3 Assessment',
    code: 'AZ-SEC-M3',
    status: 'archived',
    createdDate: 'Jun 10, 2025',
    questionCount: 40,
    duration: 60,
    passScore: 75,
    difficulty: 'advanced',
    course: 'Azure Security',
    attempts: 156,
    avgScore: 68.4
  }
];

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
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

  // Load quizzes data
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadQuizzes();
    }
  }, [isAuthenticated, isAdmin]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await backendAPI.listQuizzes();
      if (response.success && response.data) {
        setQuizzes(response.data.quizzes || []);
      } else {
        // Fallback to mock data if API fails
        setQuizzes(mockQuizzes);
        toast({
          title: "Info",
          description: "Using mock data - backend not available",
          variant: "default",
        });
      }
    } catch (error) {
      // Fallback to mock data on error
      setQuizzes(mockQuizzes);
      toast({
        title: "Info", 
        description: "Using mock data - backend not available",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await backendAPI.deleteQuiz(quizId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Quiz deleted successfully",
        });
        loadQuizzes(); // Reload the list
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete quiz",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quiz",
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

  // Filter quizzes based on search and status
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.course?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quiz.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const activeQuizzes = quizzes.filter(quiz => quiz.status === 'active').length;
  const draftQuizzes = quizzes.filter(quiz => quiz.status === 'draft').length;
  const totalAttempts = quizzes.reduce((total, quiz) => total + (quiz.attempts || 0), 0);
  const avgScore = quizzes.length > 0 ? 
    (quizzes.reduce((total, quiz) => total + (quiz.avgScore || 0), 0) / quizzes.length).toFixed(1) : '0';

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'draft':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get badge color based on difficulty
  const getDifficultyBadge = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Advanced</Badge>;
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
                    <FileText className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Quiz Management</h1>
                    <p className="text-blue-100 text-lg">Create and manage assessments and quizzes</p>
                  </div>
                </div>
                
                {/* Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-200" />
                      <span className="text-sm font-medium text-blue-100">Total Quizzes</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{quizzes.length}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-200" />
                      <span className="text-sm font-medium text-blue-100">Active</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{activeQuizzes}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <BarChart className="h-5 w-5 text-yellow-200" />
                      <span className="text-sm font-medium text-blue-100">Attempts</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{totalAttempts}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-200" />
                      <span className="text-sm font-medium text-blue-100">Avg Score</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{avgScore}%</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link href="/admin/dashboard/quizzes/create">
                  <Button className="w-full lg:w-auto bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create New Quiz
                  </Button>
                </Link>
                <Button variant="outline" className="w-full lg:w-auto border-white/30 text-white hover:bg-white/10">
                  <BarChart className="h-4 w-4 mr-2" />
                  Quiz Analytics
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
                    placeholder="Search quizzes by title, code, or course..."
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
                    <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Active
                    </TabsTrigger>
                    <TabsTrigger value="draft" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Draft
                    </TabsTrigger>
                    <TabsTrigger value="archived" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Archived
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
            Quizzes Overview ({filteredQuizzes.length} quizzes)
          </CardTitle>
          <CardDescription className="text-gray-600">
            Manage quiz assessments, monitor performance, and track student progress
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b transition-colors">
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Quiz
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden md:table-cell">
                      Details
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden lg:table-cell">
                      Course
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden lg:table-cell">
                      Performance
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuizzes.map(quiz => (
                    <tr 
                      key={quiz.id} 
                      className="border-b transition-colors hover:bg-gray-50"
                    >
                      <td className="p-4 align-middle">
                        <div>
                          <div className="font-medium">{quiz.title}</div>
                          <div className="text-gray-500 text-xs">{quiz.code}</div>
                          <div className="text-gray-500 text-xs mt-1">
                            Created: {quiz.createdDate}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="space-y-1">
                          {getStatusBadge(quiz.status)}
                          <div className="mt-1">{getDifficultyBadge(quiz.difficulty)}</div>
                        </div>
                      </td>
                      <td className="p-4 align-middle hidden md:table-cell">
                        <div className="text-sm">
                          <div className="flex items-center">
                            <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>{quiz.questionCount} questions</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>{quiz.duration} mins</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>Pass: {quiz.passScore}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle hidden lg:table-cell">
                        {quiz.course}
                      </td>
                      <td className="p-4 align-middle hidden lg:table-cell">
                        {quiz.status !== 'draft' ? (
                          <div className="text-sm">
                            <div>{quiz.attempts} attempts</div>
                            <div className={`font-medium ${
                              quiz.avgScore >= quiz.passScore 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              Avg: {quiz.avgScore.toFixed(1)}%
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not published</span>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/dashboard/quizzes/${quiz.id}`}>
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
                                  <Eye className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">Preview Quiz</div>
                                  <div className="text-xs text-gray-500">View as student</div>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-purple-700 rounded-lg transition-all duration-200 group">
                                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors mr-3">
                                  <BarChart className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">View Analytics</div>
                                  <div className="text-xs text-gray-500">Performance insights</div>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 rounded-lg transition-all duration-200 group">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors mr-3">
                                  <Download className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">Export Results</div>
                                  <div className="text-xs text-gray-500">Download data</div>
                                </div>
                              </DropdownMenuItem>
                              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-2 my-2"></div>
                              <DropdownMenuItem 
                                className="cursor-pointer flex items-center px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group"
                                onClick={() => handleDeleteQuiz(quiz.id || quiz.quizId)}
                              >
                                <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors mr-3">
                                  <Trash2 className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">Delete Quiz</div>
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
            Showing <span className="font-medium">{filteredQuizzes.length}</span> of{" "}
            <span className="font-medium">{mockQuizzes.length}</span> quizzes
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