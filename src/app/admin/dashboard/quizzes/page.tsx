"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, PlusCircle, MoreHorizontal,
  Edit, Trash2, FileText, Eye, Download,
  CheckCircle, Clock, BarChart, Loader2
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Quizzes</h1>
          <p className="text-gray-500">Manage quizzes and assessments</p>
        </div>
        <Link href="/admin/dashboard/quizzes/create">
          <Button className="bg-[#80b742] hover:bg-[#80b742]/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Quiz
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center w-full max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search quizzes..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="ml-2 shrink-0">
                <Filter className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList className="grid w-full sm:w-auto grid-cols-3 h-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
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
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                <span>Preview Quiz</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart className="h-4 w-4 mr-2" />
                                <span>View Analytics</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                <span>Export Results</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteQuiz(quiz.id || quiz.quizId)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete Quiz</span>
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
  );
}