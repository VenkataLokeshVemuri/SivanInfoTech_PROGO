"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, MoreHorizontal, FileText, 
  Download, Eye, Mail, Clock, CheckCircle, XCircle,
  Award, BarChart, Users, TrendingUp, Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock quiz attempts data
const mockAttempts = [
  {
    id: 1,
    student: {
      id: 101,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      avatar: null
    },
    quiz: {
      id: 1,
      title: 'AWS Solutions Architect Associate Final Assessment',
      code: 'AWS-SAA-FIN'
    },
    status: 'completed',
    score: 82,
    passScore: 72,
    timeSpent: 105,
    questionCount: 65,
    correctAnswers: 54,
    startTime: 'Sep 21, 2025 10:15 AM',
    endTime: 'Sep 21, 2025 12:00 PM',
    batch: 'AWS Solutions Architect - Batch 14'
  },
  {
    id: 2,
    student: {
      id: 102,
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      avatar: null
    },
    quiz: {
      id: 2,
      title: 'Azure Fundamentals - Module 1 Quiz',
      code: 'AZ-FUND-M1'
    },
    status: 'completed',
    score: 65,
    passScore: 70,
    timeSpent: 28,
    questionCount: 25,
    correctAnswers: 16,
    startTime: 'Sep 22, 2025 02:30 PM',
    endTime: 'Sep 22, 2025 02:58 PM',
    batch: 'Azure Administrator - Batch 7'
  },
  {
    id: 3,
    student: {
      id: 103,
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      avatar: null
    },
    quiz: {
      id: 3,
      title: 'GCP Associate Cloud Engineer - Practice Test',
      code: 'GCP-ACE-PT'
    },
    status: 'in-progress',
    score: null,
    passScore: 75,
    timeSpent: 45,
    questionCount: 50,
    correctAnswers: null,
    startTime: 'Sep 23, 2025 09:45 AM',
    endTime: null,
    batch: 'GCP Associate Engineer - Batch 5'
  },
  {
    id: 4,
    student: {
      id: 104,
      name: 'Sneha Gupta',
      email: 'sneha.gupta@example.com',
      avatar: null
    },
    quiz: {
      id: 1,
      title: 'AWS Solutions Architect Associate Final Assessment',
      code: 'AWS-SAA-FIN'
    },
    status: 'completed',
    score: 91,
    passScore: 72,
    timeSpent: 98,
    questionCount: 65,
    correctAnswers: 60,
    startTime: 'Sep 20, 2025 01:00 PM',
    endTime: 'Sep 20, 2025 02:38 PM',
    batch: 'AWS Solutions Architect - Batch 14'
  },
  {
    id: 5,
    student: {
      id: 105,
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      avatar: null
    },
    quiz: {
      id: 5,
      title: 'Azure Security - Module 3 Assessment',
      code: 'AZ-SEC-M3'
    },
    status: 'expired',
    score: 0,
    passScore: 75,
    timeSpent: 0,
    questionCount: 40,
    correctAnswers: 0,
    startTime: 'Sep 19, 2025 03:00 PM',
    endTime: null,
    batch: 'Azure Solutions Architect - Batch 3'
  }
];

export default function AttemptsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAttempts, setFilteredAttempts] = useState(mockAttempts);
  
  // Calculate statistics
  const totalAttempts = mockAttempts.length;
  const completedAttempts = mockAttempts.filter(attempt => attempt.status === 'completed').length;
  const passedAttempts = mockAttempts.filter(attempt => 
    attempt.status === 'completed' && attempt.score !== null && attempt.score >= attempt.passScore
  ).length;
  const avgScore = mockAttempts
    .filter(attempt => attempt.score !== null)
    .reduce((total, attempt) => total + (attempt.score || 0), 0) / 
    mockAttempts.filter(attempt => attempt.score !== null).length || 0;
  
  // Filter attempts based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredAttempts(mockAttempts);
      return;
    }
    
    const filtered = mockAttempts.filter(
      attempt => 
        attempt.student.name.toLowerCase().includes(term.toLowerCase()) ||
        attempt.student.email.toLowerCase().includes(term.toLowerCase()) ||
        attempt.quiz.title.toLowerCase().includes(term.toLowerCase()) ||
        attempt.quiz.code.toLowerCase().includes(term.toLowerCase()) ||
        attempt.batch.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredAttempts(filtered);
  };

  // Get badge for status
  const getStatusBadge = (status: string, score: number | null, passScore: number) => {
    switch(status) {
      case 'completed':
        if (score !== null) {
          return score >= passScore 
            ? <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Passed</Badge>
            : <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
        }
        return <Badge variant="outline">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Expired</Badge>;
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
                    <Activity className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Quiz Attempts</h1>
                    <p className="text-blue-100 text-lg">Monitor student quiz attempts and performance</p>
                  </div>
                </div>
                
                {/* Statistics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-200" />
                      <span className="text-sm font-medium text-blue-100">Total Attempts</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{totalAttempts}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-200" />
                      <span className="text-sm font-medium text-blue-100">Completed</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{completedAttempts}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-yellow-200" />
                      <span className="text-sm font-medium text-blue-100">Passed</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{passedAttempts}</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-200" />
                      <span className="text-sm font-medium text-blue-100">Avg Score</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">{avgScore.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full lg:w-auto bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full lg:w-auto border-white/30 text-white hover:bg-white/10">
                  <BarChart className="h-4 w-4 mr-2" />
                  Performance Analytics
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
                    placeholder="Search attempts by student, quiz, or batch..."
                    value={searchTerm}
                    onChange={handleSearch}
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
                    <TabsTrigger value="passed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Passed
                    </TabsTrigger>
                    <TabsTrigger value="failed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Failed
                    </TabsTrigger>
                    <TabsTrigger value="progress" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      In Progress
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
            Quiz Attempts Overview ({filteredAttempts.length} attempts)
          </CardTitle>
          <CardDescription className="text-gray-600">
            Track student quiz performance, review scores, and monitor progress
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b transition-colors">
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Student
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Quiz
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden md:table-cell">
                      Score
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden lg:table-cell">
                      Time
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.map(attempt => (
                    <tr 
                      key={attempt.id} 
                      className="border-b transition-colors hover:bg-gray-50"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#084fa1] flex items-center justify-center text-white font-medium">
                            {attempt.student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{attempt.student.name}</div>
                            <div className="text-gray-500 text-xs">{attempt.student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div>
                          <div className="font-medium">{attempt.quiz.title}</div>
                          <div className="text-gray-500 text-xs">{attempt.quiz.code}</div>
                          <div className="text-gray-500 text-xs mt-1">{attempt.batch}</div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {getStatusBadge(attempt.status, attempt.score, attempt.passScore)}
                      </td>
                      <td className="p-4 align-middle hidden md:table-cell">
                        {attempt.status === 'completed' ? (
                          <div>
                            <div className={`font-medium ${
                              attempt.score !== null && attempt.score >= attempt.passScore
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {attempt.score !== null ? `${attempt.score}%` : 'N/A'}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {attempt.correctAnswers !== null 
                                ? `${attempt.correctAnswers}/${attempt.questionCount} correct` 
                                : 'Not available'}
                            </div>
                          </div>
                        ) : attempt.status === 'in-progress' ? (
                          <span className="text-blue-600">In progress</span>
                        ) : (
                          <span className="text-gray-500">Not available</span>
                        )}
                      </td>
                      <td className="p-4 align-middle hidden lg:table-cell">
                        <div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>{attempt.timeSpent > 0 ? `${attempt.timeSpent} mins` : 'N/A'}</span>
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {attempt.startTime && 
                              <div>Started: {attempt.startTime}</div>
                            }
                            {attempt.endTime && 
                              <div>Ended: {attempt.endTime}</div>
                            }
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/dashboard/attempts/${attempt.id}`}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
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
                              <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 rounded-lg transition-all duration-200 group">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors mr-3">
                                  <Download className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">Download Report</div>
                                  <div className="text-xs text-gray-500">Get detailed results</div>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-700 rounded-lg transition-all duration-200 group">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors mr-3">
                                  <Mail className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">Email Results</div>
                                  <div className="text-xs text-gray-500">Send to student</div>
                                </div>
                              </DropdownMenuItem>
                              {attempt.status === 'completed' && attempt.score !== null && attempt.score < attempt.passScore && (
                                <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2.5 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-green-50 hover:text-purple-700 rounded-lg transition-all duration-200 group">
                                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors mr-3">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">Allow Retake</div>
                                    <div className="text-xs text-gray-500">Give another chance</div>
                                  </div>
                                </DropdownMenuItem>
                              )}
                              {attempt.status === 'in-progress' && (
                                <>
                                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-2 my-2"></div>
                                  <DropdownMenuItem className="cursor-pointer flex items-center px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group">
                                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors mr-3">
                                      <XCircle className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">Force End Attempt</div>
                                      <div className="text-xs text-gray-500">Stop current attempt</div>
                                    </div>
                                  </DropdownMenuItem>
                                </>
                              )}
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
            Showing <span className="font-medium">{filteredAttempts.length}</span> of{" "}
            <span className="font-medium">{mockAttempts.length}</span> attempts
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