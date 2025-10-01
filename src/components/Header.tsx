import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Cloud, LogOut, User, Sparkles, ArrowRight, Settings, BookOpen, BarChart3, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useBackendAuth, User as AuthUser } from '@/hooks/useBackendAuth';
import CounselorModal from './CounselorModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useBackendAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Why SitCloud', href: '/why-us' },
    { name: 'View Schedule', href: '/view-schedule' },
    { name: 'Verify Certificate', href: '/verify' },
    { name: 'Contact', href: '/contact' },
  ];

  const profileItems = [
    { name: 'My Courses', href: '/my-courses', icon: BookOpen, description: 'Access your enrolled courses', badge: '3 Active' },
    { name: 'Progress', href: '/my-progress', icon: BarChart3, description: 'Track your learning journey', badge: '78%' },
    { name: 'Settings', href: '/settings', icon: Settings, description: 'Manage your preferences' },
  ];

  // Don't show header on auth pages and dashboard
  if (["/auth", "/dashboard"].includes(pathname || "")) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/95 via-blue-50/90 to-green-50/95 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-blue-500/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src="/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png" 
                alt="Sivan InfoTech Logo" 
                className="relative h-12 w-auto transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Sivan InfoTech
              </h1>
              <p className="text-xs text-slate-600 font-medium">Cloud Excellence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group"
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-300"></div>
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Profile Logo Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 border-2 border-transparent hover:border-blue-200 transition-all duration-300 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative h-10 w-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-0 border-0 shadow-xl bg-white rounded-2xl overflow-hidden" align="end" forceMount>
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">My Profile</h3>
                      <p className="text-blue-100 text-sm">Manage your learning journey</p>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="p-3">
                  {profileItems.map((item, index) => (
                    <DropdownMenuItem key={item.name} asChild className="cursor-pointer p-0 mb-2 last:mb-0">
                      <Link 
                        href={item.href}
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-700 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors mr-3">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                        {item.badge && (
                          <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                            {item.badge}
                          </div>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
                
                {/* Footer Action */}
                <div className="border-t border-gray-100 p-3">
                  <Link 
                    href="/profile-complete"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    View Complete Profile
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-slate-100">
                    <Avatar className="h-10 w-10 border-2 border-slate-200 hover:border-blue-400 transition-colors">
                      <AvatarImage src="" alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold text-sm">
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-0 border-0 shadow-xl bg-white rounded-2xl overflow-hidden" align="end" forceMount>
                  {/* Header Section with Gradient */}
                  <div className="bg-gradient-to-r from-green-600 via-blue-600 to-green-500 p-6 text-white">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 border-3 border-white shadow-lg">
                        <AvatarImage src="" alt={user?.name || 'User'} />
                        <AvatarFallback className="bg-white text-green-600 font-bold text-lg">
                          {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AU'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold leading-tight truncate">{user?.name || 'Admin User'}</p>
                        <p className="text-sm text-green-100 truncate">{user?.email || 'admin@sitcloud.in'}</p>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                            {user?.role === 'admin' ? 'Admin Account' : 'User Account'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="p-2">
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link 
                        href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} 
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-200 transition-colors mr-3">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Manage your workspace
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link 
                        href="/courses" 
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors mr-3">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">My Courses</div>
                          <div className="text-xs text-gray-500">
                            Access your enrolled courses
                          </div>
                        </div>
                        <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                          3 Active
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link 
                        href="/progress" 
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors mr-3">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Progress Tracking</div>
                          <div className="text-xs text-gray-500">
                            View your learning progress
                          </div>
                        </div>
                        <div className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                          78%
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link 
                        href="/profile" 
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:text-orange-700 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-200 transition-colors mr-3">
                          <Settings className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Settings</div>
                          <div className="text-xs text-gray-500">
                            Profile & preferences
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link 
                        href="/certificates" 
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-green-50 hover:text-yellow-700 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg group-hover:bg-yellow-200 transition-colors mr-3">
                          <Award className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Certificates</div>
                          <div className="text-xs text-gray-500">
                            View your achievements
                          </div>
                        </div>
                        <div className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-medium">
                          2 Earned
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4"></div>
                  
                  {/* Logout Section */}
                  <div className="p-2">
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="cursor-pointer flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-200 transition-colors mr-3">
                        <LogOut className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Logout</div>
                        <div className="text-xs text-gray-500">
                          Sign out of your account
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md">
                    Login
                  </Button>
                </Link>
                <CounselorModal>
                  <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Talk to Counselor
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CounselorModal>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 text-slate-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-300 backdrop-blur-sm hover:bg-blue-50"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'top-3'}`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden animate-slide-down">
            <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-xl shadow-blue-500/10">
              <nav className="container mx-auto px-4 py-6">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item, index) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="relative px-4 py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium rounded-xl group animate-scale-in"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="relative z-10 flex items-center">
                        {item.name}
                        <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  ))}
                  
                  {/* Mobile Profile Section */}
                  <div className="pt-4 mt-4 border-t border-slate-200/50">
                    <div className="flex items-center px-4 py-2 mb-2">
                      <div className="relative mr-3">
                        <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-md">
                          <User className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-600">My Profile</span>
                    </div>
                    {profileItems.map((item, index) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="relative px-4 py-3 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium rounded-xl group animate-scale-in"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ animationDelay: `${(navItems.length + index) * 50}ms` }}
                      >
                        <span className="relative z-10 flex items-center">
                          <item.icon className="h-4 w-4 mr-3 opacity-60" />
                          {item.name}
                          {item.badge && (
                            <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                              {item.badge}
                            </span>
                          )}
                          <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200/50 space-y-3">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200/50">
                        <Avatar className="h-12 w-12 border-3 border-white shadow-md">
                          <AvatarImage src="" alt={user?.name || 'User'} />
                          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white font-bold text-sm">
                            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'AU'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                          <p className="text-xs text-gray-600 truncate">{user?.email || 'admin@sitcloud.in'}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            {user?.role === 'admin' ? 'Admin Account' : 'User Account'}
                          </span>
                        </div>
                      </div>
                      <Link href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="block">
                        <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:border-green-400 transition-all duration-300 justify-start h-12">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-lg mr-3">
                            <User className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">{user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}</div>
                            <div className="text-xs text-gray-500">Manage your workspace</div>
                          </div>
                        </Button>
                      </Link>
                      
                      <Link href="/courses" className="block">
                        <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-400 transition-all duration-300 justify-start h-12">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg mr-3">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">My Courses</div>
                            <div className="text-xs text-gray-500">Access your enrolled courses</div>
                          </div>
                          <div className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                            3 Active
                          </div>
                        </Button>
                      </Link>
                      
                      <Link href="/progress" className="block">
                        <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:border-purple-400 transition-all duration-300 justify-start h-12">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-lg mr-3">
                            <BarChart3 className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">Progress Tracking</div>
                            <div className="text-xs text-gray-500">View your learning progress</div>
                          </div>
                          <div className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium">
                            78%
                          </div>
                        </Button>
                      </Link>
                      
                      <Link href="/profile" className="block">
                        <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:border-orange-400 transition-all duration-300 justify-start h-12">
                          <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-600 rounded-lg mr-3">
                            <Settings className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">Settings</div>
                            <div className="text-xs text-gray-500">Profile & preferences</div>
                          </div>
                        </Button>
                      </Link>
                      
                      <Link href="/certificates" className="block">
                        <Button variant="outline" className="w-full border-yellow-300 text-yellow-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-green-50 hover:border-yellow-400 transition-all duration-300 justify-start h-12">
                          <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg mr-3">
                            <Award className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-sm">Certificates</div>
                            <div className="text-xs text-gray-500">View your achievements</div>
                          </div>
                          <div className="ml-auto text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full font-medium">
                            2 Earned
                          </div>
                        </Button>
                      </Link>
                      <Button 
                        onClick={logout}
                        variant="outline" 
                        className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-300 justify-start h-12"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-lg mr-3">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">Logout</div>
                          <div className="text-xs text-gray-500">Sign out of your account</div>
                        </div>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth" className="block">
                        <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 justify-center">
                          Login
                        </Button>
                      </Link>
                      <CounselorModal>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 justify-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Talk to Counselor
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CounselorModal>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
