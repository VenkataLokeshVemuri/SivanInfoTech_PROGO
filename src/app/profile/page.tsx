"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, Mail, Phone, Calendar, MapPin, Building, GraduationCap,
  Edit3, Save, X, ArrowLeft, Settings, Shield, Bell, Eye,
  Camera, Upload, Check, AlertCircle, Info
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  verified: boolean;
  isFromCollege: boolean;
  collegeName?: string;
  enrollments: any[];
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    collegeName: '',
    bio: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get enrollments data and create mock profile data
        const enrollments = await apiService.getEnrollments();
        const mockUserData = {
          firstName: 'Test',
          lastName: 'Student', 
          email: localStorage.getItem('userEmail') || 'student@example.com',
          phone: '+1 (555) 123-4567',
          role: 'student',
          verified: true,
          isFromCollege: true,
          collegeName: 'Tech University',
          enrollments: enrollments || []
        };
        setUserData(mockUserData);
        setFormData({
          firstName: mockUserData.firstName,
          lastName: mockUserData.lastName,
          phone: mockUserData.phone,
          collegeName: mockUserData.collegeName,
          bio: '',
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(prev => prev ? {
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        collegeName: formData.collegeName,
      } : null);
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        collegeName: userData.collegeName || '',
        bio: '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="h-8 w-px bg-white/30"></div>
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <User className="h-8 w-8 mr-3 text-green-200" />
                  My Profile
                </h1>
                <p className="text-blue-100 mt-1">
                  Manage your account settings and personal information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {userData.verified && (
                <Badge className="bg-white/20 text-white border-white/30">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Account
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-4 ring-green-100">
                    {userData.firstName?.[0]}{userData.lastName?.[0]}
                  </div>
                  <Button 
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10 p-0 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <p className="text-gray-600 flex items-center justify-center mt-1">
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Student
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    {userData.email}
                  </div>
                  
                  {userData.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-3 text-gray-400" />
                      {userData.phone}
                    </div>
                  )}
                  
                  {userData.collegeName && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-4 w-4 mr-3 text-gray-400" />
                      {userData.collegeName}
                    </div>
                  )}
                </div>

                {/* Profile Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {userData.enrollments?.length || 0}
                      </div>
                      <div className="text-xs text-gray-500">Courses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {userData.enrollments?.filter(e => e.enrollmentStatus === 'Certified').length || 0}
                      </div>
                      <div className="text-xs text-gray-500">Certificates</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} disabled={isSaving} size="sm" className="bg-gradient-to-r from-green-500 to-blue-500">
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 py-2">{userData.firstName}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 py-2">{userData.lastName}</div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-900 py-2 flex-1">{userData.email}</div>
                    {userData.verified && (
                      <Badge variant="secondary" className="ml-2">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 py-2">{userData.phone || 'Not provided'}</div>
                  )}
                </div>

                {userData.isFromCollege && (
                  <div className="space-y-2">
                    <Label htmlFor="college">College/University</Label>
                    {isEditing ? (
                      <Input
                        id="college"
                        value={formData.collegeName}
                        onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
                        placeholder="Your college or university name"
                        className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 py-2">{userData.collegeName || 'Not provided'}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive updates about your courses</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Privacy Settings</div>
                      <div className="text-sm text-gray-600">Control who can see your profile</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Change Password</div>
                      <div className="text-sm text-gray-600">Update your account password</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;