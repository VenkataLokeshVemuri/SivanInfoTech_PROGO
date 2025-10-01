import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Cloud, LogOut, User, Sparkles, ArrowRight, Settings } from 'lucide-react';
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
import { useBackendAuth } from '@/hooks/useBackendAuth';
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
    { name: 'Contact', href: '#contact' },
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
                <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">{user?.role} Account</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
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
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200/50 space-y-3">
                  {user ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <Avatar className="h-10 w-10 border-2 border-slate-200">
                          <AvatarImage src="" alt={user?.name || 'User'} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white font-semibold text-sm">
                            {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user?.role} Account</p>
                        </div>
                      </div>
                      <Link href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="block">
                        <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 justify-start">
                          <User className="h-4 w-4 mr-2" />
                          {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                        </Button>
                      </Link>
                      <Link href="/profile" className="block">
                        <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all duration-300 justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Profile Settings
                        </Button>
                      </Link>
                      <Button 
                        onClick={logout}
                        variant="outline" 
                        className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-300 justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
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
