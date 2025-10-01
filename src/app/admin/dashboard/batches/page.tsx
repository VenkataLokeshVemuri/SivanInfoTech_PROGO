"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, PlusCircle, MoreHorizontal,
  Edit, Trash2, Users, Calendar, BookOpen,
  CheckCircle, XCircle, Clock, Loader2
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

// Mock batch data
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
    completedModules: 8
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
    completedModules: 0
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
    completedModules: 7
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
    completedModules: 14
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
    completedModules: 0
  }
];

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
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
        setBatches(mockBatches);
        toast({
          title: "Info",
          description: "Using mock data - backend not available",
          variant: "default",
        });
      }
    } catch (error) {
      // Fallback to mock data on error
      setBatches(mockBatches);
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Batches</h1>
          <p className="text-gray-500">Manage course batches and schedules</p>
        </div>
        <Link href="/admin/dashboard/batches/create">
          <Button className="bg-[#80b742] hover:bg-[#80b742]/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Batch
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
                  placeholder="Search batches..."
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
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
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
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">{batch.completedModules}/{batch.modules} modules</span>
                            <span className="font-medium">{batch.progress}%</span>
                          </div>
                          <Progress value={batch.progress} className="h-2" />
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
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" />
                                <span>View Students</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BookOpen className="h-4 w-4 mr-2" />
                                <span>Manage Modules</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Clock className="h-4 w-4 mr-2" />
                                <span>Schedule Classes</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteBatch(batch.code)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete Batch</span>
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
  );
}