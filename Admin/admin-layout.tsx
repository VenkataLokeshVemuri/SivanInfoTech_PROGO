
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  BookOpen, 
  Settings, 
  Menu, 
  X,
  BarChart3,
  MessageSquare,
  Calendar,
  FileText
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home, current: true },
    { name: 'Users', href: '/admin/users', icon: Users, current: false },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen, current: false },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare, current: false },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: false },
    { name: 'Schedule', href: '/admin/schedule', icon: Calendar, current: false },
    { name: 'Reports', href: '/admin/reports', icon: FileText, current: false },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: false },
  ];

  return (
    <div className="min-h-screen bg-neutral-light-grey">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-dark-grey transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 bg-neutral-dark-grey border-b border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-primary-green text-xl font-bold">SivanInfoTech</span>
            </div>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'bg-primary-green text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200`}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-green lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
              <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green">
                  <span className="sr-only">View notifications</span>
                  <div className="h-8 w-8 rounded-full bg-primary-green flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;


