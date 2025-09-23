"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, LogOut, LayoutDashboard, Users, BookOpen, 
  ClipboardList, BarChart2, Settings, Menu, X, 
  ChevronDown, Bell, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useBackendAuth();
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Format time
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  // Navigation items based on the requirements in CONTEXT.md
  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: LayoutDashboard,
      active: pathname === '/admin/dashboard'
    },
    { 
      name: 'Users', 
      href: '/admin/dashboard/users', 
      icon: Users,
      active: pathname?.includes('/admin/dashboard/users')
    },
    { 
      name: 'Batches', 
      href: '/admin/dashboard/batches', 
      icon: BookOpen,
      active: pathname?.includes('/admin/dashboard/batches')
    },
    { 
      name: 'Quizzes', 
      href: '/admin/dashboard/quizzes', 
      icon: ClipboardList,
      active: pathname?.includes('/admin/dashboard/quizzes'),
      badge: 3
    },
    { 
      name: 'Attempts', 
      href: '/admin/dashboard/attempts', 
      icon: ClipboardList,
      active: pathname?.includes('/admin/dashboard/attempts')
    },
    { 
      name: 'Analytics', 
      href: '/admin/dashboard/analytics', 
      icon: BarChart2,
      active: pathname?.includes('/admin/dashboard/analytics')
    },
    { 
      name: 'Settings', 
      href: '/admin/dashboard/settings', 
      icon: Settings,
      active: pathname?.includes('/admin/dashboard/settings')
    }
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg text-gray-800`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Link href="/admin/dashboard" className={`flex items-center ${sidebarOpen ? 'space-x-2' : 'justify-center'}`}>
            <div className="bg-gradient-to-r from-[#084fa1] to-[#80b742] p-1.5 rounded">
              <img 
                src="/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png" 
                alt="Sivan InfoTech Logo" 
                className="h-6 w-auto"
              />
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#084fa1] to-[#80b742]">
                SIT Admin
              </span>
            )}
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="py-4 overflow-y-auto h-[calc(100%-4rem)]">
          {sidebarOpen && (
            <div className="px-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#084fa1] to-[#80b742] flex items-center justify-center text-white">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'admin@sivancloud.com'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {sidebarOpen && (
            <div className="px-4 mb-4">
              <div className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Main Navigation
              </div>
            </div>
          )}
          
          <nav className={`${sidebarOpen ? 'px-2' : 'px-1'} space-y-1.5`}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center ${sidebarOpen ? 'px-3 py-2.5' : 'p-2 justify-center'} text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.active
                    ? 'bg-gradient-to-r from-[#084fa1]/10 to-[#80b742]/10 text-[#084fa1]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-[#084fa1]'
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5 ${
                  item.active 
                    ? 'text-[#80b742]' 
                    : 'text-gray-500 group-hover:text-[#80b742]'
                }`} />
                {sidebarOpen && <span>{item.name}</span>}
                {sidebarOpen && item.badge && (
                  <Badge className="ml-auto bg-[#80b742] hover:bg-[#80b742]/90 text-white">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
          
          {sidebarOpen && (
            <>
              <div className="px-4 mt-8 mb-4">
                <div className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                  System
                </div>
              </div>
              
              <div className="px-4">
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      {formattedDate}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {formattedTime}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className={`absolute bottom-0 w-full border-t border-gray-200 p-4 ${!sidebarOpen && 'flex justify-center'}`}>
          <Button
            onClick={logout}
            variant="outline"
            className={`${sidebarOpen ? 'w-full' : 'w-10 h-10 p-0'} border-red-300 text-red-700 hover:bg-red-50`}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut className={`h-4 w-4 ${sidebarOpen && 'mr-2'}`} />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${!sidebarOpen ? 'lg:ml-20' : ''}`}>
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 z-10 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center">
              <button
                className="text-gray-500 lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <button
                className="hidden lg:flex items-center justify-center text-gray-500 mr-4 hover:bg-gray-100 h-8 w-8 rounded-md transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                {sidebarOpen ? (
                  <ChevronDown className="h-5 w-5 rotate-90" />
                ) : (
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                )}
              </button>
              
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 h-9 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="relative"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
                  <div className="p-2 text-xs font-medium bg-gray-50 border-b border-gray-200">Notifications</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="py-2 hover:bg-gray-50">
                    <div className="flex flex-col">
                      <span className="font-medium">New quiz submission</span>
                      <span className="text-xs text-gray-500">5 mins ago</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-2 hover:bg-gray-50">
                    <div className="flex flex-col">
                      <span className="font-medium">User account verified</span>
                      <span className="text-xs text-gray-500">1 hour ago</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link href="/" className="text-gray-600 hover:text-[#084fa1]">
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}