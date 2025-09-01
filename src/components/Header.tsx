import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Cloud, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBackendAuth } from '@/hooks/useBackendAuth';
import CounselorModal from './CounselorModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useBackendAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: 'Why SitCloud', href: '#why-sitcloud' },
    { name: 'Batch Schedule', href: '#batch-schedule' },
    { name: 'Verify Certificate', href: '/verify' },
    { name: 'Contact', href: '#contact' },
  ];

  // Don't show header on auth pages and dashboard
  if (["/auth", "/dashboard"].includes(pathname || "")) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png" 
              alt="Sivan InfoTech Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-700 hover:text-blue-600 transition-colors duration-200 font-medium text-sm"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex space-x-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name || 'Dashboard'}
                  </Button>
                </Link>
                <Button 
                  onClick={logout}
                  variant="outline" 
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    Login
                  </Button>
                </Link>
                <CounselorModal>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Talk to Counselor
                  </Button>
                </CounselorModal>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-white">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium px-4 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-2 space-y-2">
                {user ? (
                  <>
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" className="w-full border-slate-300 text-slate-700">
                        <User className="h-4 w-4 mr-2" />
                        {user?.name || 'Dashboard'}
                      </Button>
                    </Link>
                    <Button 
                      onClick={logout}
                      variant="outline" 
                      className="w-full border-red-300 text-red-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth" className="block">
                      <Button variant="outline" className="w-full border-slate-300 text-slate-700">
                        Login
                      </Button>
                    </Link>
                    <CounselorModal>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                        Talk to Counselor
                      </Button>
                    </CounselorModal>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
