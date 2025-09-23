"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, MoreHorizontal, FileText, 
  Download, Eye, Mail, Clock, CheckCircle, XCircle
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Quiz Attempts</h1>
          <p className="text-gray-500">View and manage student quiz attempts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center w-full max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search attempts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
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
                <TabsTrigger value="passed">Passed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
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
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                <span>Download Report</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                <span>Email Results</span>
                              </DropdownMenuItem>
                              {attempt.status === 'completed' && attempt.score !== null && attempt.score < attempt.passScore && (
                                <DropdownMenuItem>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  <span>Allow Retake</span>
                                </DropdownMenuItem>
                              )}
                              {attempt.status === 'in-progress' && (
                                <DropdownMenuItem className="text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  <span>Force End Attempt</span>
                                </DropdownMenuItem>
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
  );
}