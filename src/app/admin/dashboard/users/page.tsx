"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Search, Filter, UserPlus, MoreHorizontal,
  Edit, Trash2, Mail, CheckCircle, XCircle 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'student',
    status: 'active',
    dateJoined: 'Sep 15, 2025',
    batch: 'AWS Solutions Architect - Batch 14',
    verified: true
  },
  {
    id: 2,
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    role: 'student',
    status: 'active',
    dateJoined: 'Sep 10, 2025',
    batch: 'Azure Administrator - Batch 7',
    verified: true
  },
  {
    id: 3,
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    status: 'active',
    dateJoined: 'Aug 5, 2025',
    batch: null,
    verified: true
  },
  {
    id: 4,
    name: 'Lisa Wong',
    email: 'lisa.wong@example.com',
    role: 'student',
    status: 'inactive',
    dateJoined: 'Sep 5, 2025',
    batch: 'GCP Associate Engineer - Batch 5',
    verified: false
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'student',
    status: 'pending',
    dateJoined: 'Sep 20, 2025',
    batch: 'AWS Developer - Batch 9',
    verified: false
  }
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  
  // Filter users based on search term
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredUsers(mockUsers);
      return;
    }
    
    const filtered = mockUsers.filter(
      user => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        (user.batch && user.batch.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredUsers(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Users</h1>
          <p className="text-gray-500">Manage students and administrators</p>
        </div>
        <Link href="/admin/dashboard/users/create">
          <Button className="bg-[#80b742] hover:bg-[#80b742]/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
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
                  placeholder="Search users..."
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
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="admins">Admins</TabsTrigger>
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
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Role
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden md:table-cell">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500 hidden md:table-cell">
                      Date Joined
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr 
                      key={user.id} 
                      className="border-b transition-colors hover:bg-gray-50"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#084fa1] flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-gray-500 text-xs">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge className={
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                        }>
                          {user.role === 'admin' ? 'Admin' : 'Student'}
                        </Badge>
                        {!user.verified && (
                          <Badge variant="outline" className="ml-2 text-yellow-600 border-yellow-300">
                            Unverified
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 align-middle hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${
                            user.status === 'active' ? 'bg-green-500' : 
                            user.status === 'inactive' ? 'bg-gray-400' : 'bg-yellow-500'
                          }`}></div>
                          <span className="capitalize">{user.status}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle hidden md:table-cell">
                        {user.dateJoined}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/dashboard/users/${user.id}`}>
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
                                <Mail className="h-4 w-4 mr-2" />
                                <span>Send Email</span>
                              </DropdownMenuItem>
                              {!user.verified && (
                                <DropdownMenuItem>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  <span>Verify Account</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete User</span>
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
            Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
            <span className="font-medium">{mockUsers.length}</span> users
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