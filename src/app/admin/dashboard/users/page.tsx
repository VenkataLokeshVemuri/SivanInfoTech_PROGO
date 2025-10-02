'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Calendar,
  Award,
  Eye,
  GraduationCap,
  Clock,
  Download,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  UserPlus,
  Users,
  TrendingUp,
  Trophy,
  BarChart2,
  X,
  Save,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { backendAPI } from '@/lib/backend-api';

interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: string;
  course?: string;
  status: string;
  joinDate: string;
  progress: number;
  avatar: string;
  lastActivity: string;
  certificates: number;
}

interface Certificate {
  type: string;
  course: string;
  date: string;
  grade?: string;
}

const UsersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCertificatesModal, setShowCertificatesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    role: 'student',
    course: ''
  });

  // Mock data for initial display
  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 9876543210',
      course: 'AWS Certification',
      status: 'active',
      joinDate: '2025-01-15',
      progress: 75,
      avatar: 'RS',
      lastActivity: '2 hours ago',
      certificates: 3,
      role: 'student'
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 9876543211',
      course: 'Azure DevOps',
      status: 'active',
      joinDate: '2025-01-10',
      progress: 60,
      avatar: 'PP',
      lastActivity: '1 day ago',
      certificates: 2,
      role: 'student'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      phone: '+91 9876543212',
      course: 'Google Cloud Platform',
      status: 'inactive',
      joinDate: '2025-01-05',
      progress: 30,
      avatar: 'AK',
      lastActivity: '5 days ago',
      certificates: 1,
      role: 'student'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 9876543213',
      course: 'DevOps Engineering',
      status: 'active',
      joinDate: '2025-01-20',
      progress: 90,
      avatar: 'SR',
      lastActivity: '30 minutes ago',
      certificates: 4,
      role: 'student'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      phone: '+91 9876543214',
      course: 'Kubernetes Administration',
      status: 'completed',
      joinDate: '2024-12-15',
      progress: 100,
      avatar: 'VS',
      lastActivity: '1 week ago',
      certificates: 5,
      role: 'student'
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
  }, []);

  // User management functions
  const handleExportUsers = async () => {
    try {
      setLoading(true);
      const result = await backendAPI.exportUsers();
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      setError('Failed to export users');
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      setLoading(true);
      const result = await backendAPI.createUser(formData);
      
      if (result.success) {
        // Add to local state
        const fullName = `${formData.firstName} ${formData.lastName}`;
        const newUser: User = {
          id: Date.now(),
          email: formData.email,
          name: fullName,
          phone: formData.phone,
          role: formData.role,
          course: formData.course,
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0],
          progress: 0,
          avatar: `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase(),
          lastActivity: 'Just now',
          certificates: 0
        };
        setUsers([...users, newUser]);
        setShowAddModal(false);
        resetForm();
      } else {
        setError(result.error || 'Failed to create user');
      }
    } catch (error) {
      setError('Failed to create user');
      console.error('Create user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const result = await backendAPI.updateUser(selectedUser.email, formData);
      
      if (result.success) {
        // Update local state
        const fullName = `${formData.firstName} ${formData.lastName}`;
        setUsers(users.map(user => 
          user.email === selectedUser.email 
            ? { ...user, 
                name: fullName,
                phone: formData.phone,
                role: formData.role,
                course: formData.course,
                avatar: `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase() 
              }
            : user
        ));
        setShowEditModal(false);
        setSelectedUser(null);
        resetForm();
      } else {
        setError(result.error || 'Failed to update user');
      }
    } catch (error) {
      setError('Failed to update user');
      console.error('Update user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const result = await backendAPI.deleteUser(selectedUser.email);
      
      if (result.success) {
        setUsers(users.filter(user => user.email !== selectedUser.email));
        setShowDeleteModal(false);
        setSelectedUser(null);
      } else {
        setError(result.error || 'Failed to delete user');
      }
    } catch (error) {
      setError('Failed to delete user');
      console.error('Delete user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCertificates = async (user: User) => {
    try {
      setLoading(true);
      setSelectedUser(user);
      const result = await backendAPI.getUserCertificates(user.email);
      
      if (result.success) {
        setCertificates(result.data?.certificates || []);
      } else {
        setCertificates([]);
        setError(result.error || 'Failed to load certificates');
      }
      setShowCertificatesModal(true);
    } catch (error) {
      setCertificates([]);
      setError('Failed to load certificates');
      console.error('Certificates error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    const nameParts = user.name.split(' ');
    setFormData({
      email: user.email,
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      phone: user.phone || '',
      password: '',
      role: user.role,
      course: user.course || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      role: 'student',
      course: ''
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.course && user.course.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactive</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-emerald-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Ensure proper CSS loading */}
      <style jsx>{`
        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          border: 1px solid;
          background-color: transparent;
          padding: 0.5rem;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .action-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-16 w-40 h-40 bg-gradient-to-br from-green-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="p-8 space-y-8 relative z-10">
        {/* Enhanced Header with Glassmorphism */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm shadow-lg">
                  <Users className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black">User Management</h1>
                  <p className="text-blue-100 text-xl font-medium">Monitor and manage student accounts</p>
                </div>
              </div>
              
              {/* Enhanced Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <Users className="h-6 w-6 text-blue-200" />
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="text-3xl font-black">{users.length}</div>
                  <div className="text-blue-100 font-medium">Total Users</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="text-3xl font-black">{users.filter(u => u.status === 'active').length}</div>
                  <div className="text-blue-100 font-medium">Active Users</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <Trophy className="h-6 w-6 text-yellow-300" />
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="text-3xl font-black">{users.filter(u => u.status === 'completed').length}</div>
                  <div className="text-blue-100 font-medium">Completed</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <BarChart2 className="h-6 w-6 text-purple-300" />
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                  <div className="text-3xl font-black">{Math.round(users.reduce((sum, u) => sum + u.progress, 0) / users.length)}%</div>
                  <div className="text-blue-100 font-medium">Avg Progress</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button 
                onClick={handleExportUsers}
                disabled={loading}
                className="bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 font-medium"
              >
                <Download className="h-5 w-5 mr-2" />
                Export Data
              </Button>
              <Button 
                onClick={() => {
                  resetForm();
                  setError(null);
                  setShowAddModal(true);
                }}
                className="bg-white text-blue-600 hover:bg-gray-50 transition-all duration-300 hover:scale-105 font-semibold px-8"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add New User
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name, email, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    autoComplete="off"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filter by Status
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                      Active Users
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                      Inactive Users
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                      Completed Users
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="outline" 
                  className="border-gray-200 hover:bg-gray-50"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Enhanced Users Table */}
        <Card className="shadow-xl border-0 bg-white backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Users Overview ({filteredUsers.length} users)
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage student accounts, track progress, and monitor activity
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Course</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Progress</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Activity</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-blue-50/50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                    >
                      <td className="py-6 px-6">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-6 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{user.course}</p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            Joined {user.joinDate}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Award className="h-3 w-3 mr-1" />
                            {user.certificates} certificates
                          </p>
                        </div>
                      </td>
                      
                      <td className="py-6 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">{user.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(user.progress)}`}
                              style={{ width: `${user.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            {user.progress === 100 ? 'Course completed' : 'In progress'}
                          </p>
                        </div>
                      </td>
                      
                      <td className="py-6 px-6">
                        {getStatusBadge(user.status)}
                      </td>
                      
                      <td className="py-6 px-6">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{user.lastActivity}</span>
                        </div>
                      </td>
                      
                      <td className="py-6 px-6 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 w-9 p-0 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 rounded-lg shadow-sm"
                            onClick={() => handleViewCertificates(user)}
                            disabled={loading}
                            title="View Certificates"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 w-9 p-0 border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300 transition-all duration-200 rounded-lg shadow-sm"
                            onClick={() => openEditModal(user)}
                            disabled={loading}
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 w-9 p-0 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all duration-200 rounded-lg shadow-sm"
                            onClick={() => openDeleteModal(user)}
                            disabled={loading}
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">Try adjusting your search criteria or add a new user.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <Card className="shadow-lg border-0 bg-white backdrop-blur-sm">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium">{users.length}</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled className="border-gray-200">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-600 text-white border-blue-600">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled className="border-gray-200">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-xl z-50 max-w-md">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)} 
              className="text-white hover:bg-red-600 h-6 w-6 p-0 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={(open) => {
        if (!open) {
          resetForm();
          setError(null);
        }
        setShowAddModal(open);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. Fill in all required information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }} autoComplete="off">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  autoComplete="new-email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  placeholder="AWS Certification"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information. Leave password empty to keep current password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input
                  id="editFirstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input
                  id="editLastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john.doe@example.com"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPhone">Phone Number</Label>
              <Input
                id="editPhone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editPassword">New Password (optional)</Label>
              <Input
                id="editPassword"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave empty to keep current"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editRole">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editCourse">Course</Label>
              <Input
                id="editCourse"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="AWS Certification"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={loading}>
              {loading ? 'Updating...' : 'Update User'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selectedUser.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certificates Modal */}
      <Dialog open={showCertificatesModal} onOpenChange={setShowCertificatesModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>User Certificates</DialogTitle>
            <DialogDescription>
              View all certificates earned by {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.map((cert, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Award className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{cert.type}</h4>
                          <p className="text-sm text-gray-600">{cert.course}</p>
                          <p className="text-xs text-gray-500">{cert.date}</p>
                        </div>
                      </div>
                      {cert.grade && (
                        <Badge className="bg-green-100 text-green-800">
                          {cert.grade}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
                <p className="text-gray-500">This user hasn't earned any certificates yet.</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowCertificatesModal(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;