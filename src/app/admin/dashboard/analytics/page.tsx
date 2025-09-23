"use client";

import { useState } from 'react';
import { 
  BarChart3, PieChart, LineChart, Calendar,
  Download, RefreshCcw, ArrowUpRight, ArrowDownRight,
  Users, BookOpen, CheckSquare, Award, Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Analytics</h1>
          <p className="text-gray-500">Performance insights and statistics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" className="bg-white w-10 p-0">
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">782</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12%
              </span>{" "}
              vs previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8%
              </span>{" "}
              vs previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Completion</CardTitle>
            <CheckSquare className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.3%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-red-600 font-medium inline-flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                3%
              </span>{" "}
              vs previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">138</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium inline-flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                24%
              </span>{" "}
              vs previous period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Student Enrollment</CardTitle>
            <CardDescription>
              New students registered over time
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">Student enrollment chart would render here</p>
                <p className="text-xs text-gray-400 mt-1">Showing data for the last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
            <CardDescription>
              Students enrolled per course
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px] w-full flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-500">Course distribution chart would render here</p>
                <p className="text-xs text-gray-400 mt-1">AWS (45%), Azure (30%), GCP (15%), Others (10%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance by Course</CardTitle>
              <CardDescription>
                Average scores across different courses
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[400px] w-full flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Quiz performance chart would render here</p>
                  <p className="text-xs text-gray-400 mt-1">Showing average scores by course and difficulty level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Engagement Metrics</CardTitle>
              <CardDescription>
                Activity levels and participation rates
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[400px] w-full flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Engagement metrics would render here</p>
                  <p className="text-xs text-gray-400 mt-1">Showing login frequency, content access, and quiz attempt rates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Attendance Rates</CardTitle>
              <CardDescription>
                Attendance tracking by batch and date
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[400px] w-full flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Attendance calendar would render here</p>
                  <p className="text-xs text-gray-400 mt-1">Showing attendance patterns across batches and days of week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Time Spent Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Time Spent Analysis</CardTitle>
            <CardDescription>
              Average time spent by students on different activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Video Lectures</span>
                  </div>
                  <span className="text-sm font-medium">4.2 hrs/week</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#084fa1] rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Practice Labs</span>
                  </div>
                  <span className="text-sm font-medium">5.8 hrs/week</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#80b742] rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Quiz Attempts</span>
                  </div>
                  <span className="text-sm font-medium">2.1 hrs/week</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-medium">Reading Materials</span>
                  </div>
                  <span className="text-sm font-medium">3.5 hrs/week</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}