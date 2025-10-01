"use client";

import { useState } from 'react';
import { 
  BarChart3, PieChart, LineChart, Calendar,
  Download, RefreshCcw, ArrowUpRight, ArrowDownRight,
  Users, BookOpen, CheckSquare, Award, Clock,
  TrendingUp, Activity, Target, Zap, ChevronDown,
  BarChart, Filter, CalendarDays
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('month');
  const [category, setCategory] = useState('all');

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
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-blue-100 text-lg">Performance insights and comprehensive statistics</p>
                  </div>
                </div>
                
                {/* Key Metrics Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-200" />
                      <span className="text-sm font-medium text-blue-100">Total Students</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">782</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-200" />
                      <span className="text-xs text-green-200">+12%</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-green-200" />
                      <span className="text-sm font-medium text-blue-100">Active Batches</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">24</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-200" />
                      <span className="text-xs text-green-200">+8%</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-yellow-200" />
                      <span className="text-sm font-medium text-blue-100">Completion</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">78.3%</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <ArrowDownRight className="h-3 w-3 text-red-200" />
                      <span className="text-xs text-red-200">-3%</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-200" />
                      <span className="text-sm font-medium text-blue-100">Certifications</span>
                    </div>
                    <p className="text-2xl font-bold mt-1">138</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-200" />
                      <span className="text-xs text-green-200">+24%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Enhanced Time Frame & Category Selectors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Premium Time Period Selector */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                    <Select defaultValue="month" value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger className="relative w-full h-14 bg-gradient-to-br from-white/20 to-white/10 border-white/30 text-white backdrop-blur-2xl rounded-2xl hover:from-white/30 hover:to-white/20 transition-all duration-500 shadow-xl hover:shadow-2xl group/trigger">
                        <div className="flex items-center space-x-4 w-full">
                          <div className="p-2.5 bg-gradient-to-br from-white/30 to-white/20 rounded-xl group-hover/trigger:from-white/40 group-hover/trigger:to-white/30 transition-all duration-300 shadow-lg">
                            <CalendarDays className="h-5 w-5 text-white drop-shadow-sm" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-xs text-blue-100 font-semibold tracking-wider uppercase">Time Period</div>
                            <SelectValue placeholder="Select timeframe" className="text-white font-bold text-sm" />
                          </div>
                          <div className="p-1 rounded-lg bg-white/20 group-hover/trigger:bg-white/30 transition-all duration-300">
                            <ChevronDown className="h-4 w-4 text-white/80 group-hover/trigger:text-white group-hover/trigger:rotate-180 transition-all duration-300" />
                          </div>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="w-[280px] bg-white/98 backdrop-blur-3xl border border-white/30 shadow-2xl rounded-2xl overflow-hidden p-1">
                        <div className="space-y-2">
                          <SelectItem 
                            value="week" 
                            className="rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 transition-all duration-300 cursor-pointer p-4 border-none group/item"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover/item:shadow-lg transition-all duration-300">
                                <Clock className="h-4 w-4 text-blue-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">Last 7 days</div>
                                <div className="text-sm text-gray-600 font-medium">Recent activity & trends</div>
                              </div>
                              <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            </div>
                          </SelectItem>
                          
                          <SelectItem 
                            value="month" 
                            className="rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100/50 transition-all duration-300 cursor-pointer p-4 border-none group/item"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2.5 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover/item:shadow-lg transition-all duration-300">
                                <BarChart className="h-4 w-4 text-green-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">Last 30 days</div>
                                <div className="text-sm text-gray-600 font-medium">Monthly performance overview</div>
                              </div>
                              <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            </div>
                          </SelectItem>
                          
                          <SelectItem 
                            value="quarter" 
                            className="rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 transition-all duration-300 cursor-pointer p-4 border-none group/item"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover/item:shadow-lg transition-all duration-300">
                                <TrendingUp className="h-4 w-4 text-purple-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">Last 90 days</div>
                                <div className="text-sm text-gray-600 font-medium">Quarterly business insights</div>
                              </div>
                              <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            </div>
                          </SelectItem>
                          
                          <SelectItem 
                            value="year" 
                            className="rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 transition-all duration-300 cursor-pointer p-4 border-none group/item"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2.5 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl group-hover/item:shadow-lg transition-all duration-300">
                                <Calendar className="h-4 w-4 text-orange-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">Last 12 months</div>
                                <div className="text-sm text-gray-600 font-medium">Annual strategic analysis</div>
                              </div>
                              <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-orange-600 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            </div>
                          </SelectItem>
                        </div>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Premium Category Filter */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 via-teal-400 to-green-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                    <Select defaultValue="all" value={category} onValueChange={setCategory}>
                      <SelectTrigger className="relative w-full h-14 bg-gradient-to-br from-white/20 to-white/10 border-white/30 text-white backdrop-blur-2xl rounded-2xl hover:from-white/30 hover:to-white/20 transition-all duration-500 shadow-xl hover:shadow-2xl group/trigger">
                        <div className="flex items-center space-x-4 w-full">
                          <div className="p-2.5 bg-gradient-to-br from-white/30 to-white/20 rounded-xl group-hover/trigger:from-white/40 group-hover/trigger:to-white/30 transition-all duration-300 shadow-lg">
                            <Filter className="h-5 w-5 text-white drop-shadow-sm" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-xs text-blue-100 font-semibold tracking-wider uppercase">Analytics Filter</div>
                            <SelectValue placeholder="Select category" className="text-white font-bold text-sm" />
                          </div>
                          <div className="p-1 rounded-lg bg-white/20 group-hover/trigger:bg-white/30 transition-all duration-300">
                            <ChevronDown className="h-4 w-4 text-white/80 group-hover/trigger:text-white group-hover/trigger:rotate-180 transition-all duration-300" />
                          </div>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="w-[280px] bg-white/98 backdrop-blur-3xl border border-white/30 shadow-2xl rounded-2xl overflow-hidden p-1">
                        <div className="space-y-2">
                          <SelectItem 
                            value="all" 
                            className="rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100/50 transition-all duration-300 cursor-pointer p-4 border-none group/item"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2.5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl group-hover/item:shadow-lg transition-all duration-300">
                                <BarChart3 className="h-4 w-4 text-gray-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">All Metrics</div>
                                <div className="text-sm text-gray-600 font-medium">Complete analytics overview</div>
                              </div>
                              <div className="w-2 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            </div>
                          </SelectItem>
                          
                          <SelectItem 
                            value="students" 
                            className="rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 transition-all duration-300 cursor-pointer p-4 border-none group/item"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover/item:shadow-lg transition-all duration-300">
                                <Users className="h-4 w-4 text-blue-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">Students</div>
                                <div className="text-sm text-gray-600 font-medium">Enrollment & user activity</div>
                              </div>
                              <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            </div>
                          </SelectItem>
                          
                          <SelectItem 
                            value="courses" 
                            className="rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100/50 transition-all duration-300 cursor-pointer p-4 border-none group/item"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2.5 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover/item:shadow-lg transition-all duration-300">
                                <BookOpen className="h-4 w-4 text-green-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">Courses</div>
                                <div className="text-sm text-gray-600 font-medium">Progress & completion rates</div>
                              </div>
                              <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            </div>
                          </SelectItem>
                          
                          <SelectItem 
                            value="assessments" 
                            className="rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100/50 transition-all duration-300 cursor-pointer p-4 border-none group/item"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2.5 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover/item:shadow-lg transition-all duration-300">
                                <CheckSquare className="h-4 w-4 text-purple-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">Assessments</div>
                                <div className="text-sm text-gray-600 font-medium">Quiz & test performance</div>
                              </div>
                              <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            </div>
                          </SelectItem>

                          <SelectItem 
                            value="certifications" 
                            className="rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100/50 transition-all duration-300 cursor-pointer p-4 border-none group/item"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2.5 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl group-hover/item:shadow-lg transition-all duration-300">
                                <Award className="h-4 w-4 text-yellow-700" />
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-gray-900">Certifications</div>
                                <div className="text-sm text-gray-600 font-medium">Awards & achievements</div>
                              </div>
                              <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full opacity-0 group-hover/item:opacity-100 transition-all duration-300"></div>
                            </div>
                          </SelectItem>
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative group flex-1">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-2xl blur opacity-40 group-hover:opacity-80 transition duration-500"></div>
                    <Button className="relative w-full bg-gradient-to-r from-white/25 to-white/15 text-white border border-white/40 hover:from-white/35 hover:to-white/25 backdrop-blur-2xl transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl rounded-2xl px-8 py-4 h-14 group/btn">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-xl group-hover/btn:bg-white/30 group-hover/btn:scale-110 transition-all duration-300">
                          <Download className="h-5 w-5 group-hover/btn:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-sm">Export Data</div>
                          <div className="text-xs text-blue-100 font-medium">Download analytics report</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-2xl blur opacity-40 group-hover:opacity-80 transition duration-500"></div>
                    <Button className="relative bg-gradient-to-r from-white to-blue-50 text-blue-700 hover:from-blue-50 hover:to-white transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl rounded-2xl px-6 py-4 h-14 border-0 group/btn">
                      <div className="p-2 bg-blue-100 rounded-xl group-hover/btn:bg-blue-200 group-hover/btn:scale-110 transition-all duration-300">
                        <RefreshCcw className="h-5 w-5 group-hover/btn:rotate-180 transition-transform duration-500" />
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Enhanced Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="text-sm font-medium text-gray-700">Total Students</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">782</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <span className="text-green-600 font-medium inline-flex items-center bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12%
              </span>
              <span className="ml-2">vs previous period</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="text-sm font-medium text-gray-700">Active Batches</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">24</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <span className="text-green-600 font-medium inline-flex items-center bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8%
              </span>
              <span className="ml-2">vs previous period</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardTitle className="text-sm font-medium text-gray-700">Quiz Completion</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <CheckSquare className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">78.3%</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <span className="text-red-600 font-medium inline-flex items-center bg-red-50 px-2 py-1 rounded-full">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                3%
              </span>
              <span className="ml-2">vs previous period</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="text-sm font-medium text-gray-700">Certifications</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-900">138</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <span className="text-green-600 font-medium inline-flex items-center bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                24%
              </span>
              <span className="ml-2">vs previous period</span>
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
    </div>
  );
}