"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  BarChart2,
  Menu,
  ChevronDown,
  Bell,
  Home,
  ChevronRight,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBackendAuth, User as AuthUser } from "@/hooks/useBackendAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format date
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Navigation items
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin/dashboard",
      description: "Overview & analytics",
    },
    {
      name: "Users",
      href: "/admin/dashboard/users",
      icon: Users,
      active: pathname?.includes("/admin/dashboard/users"),
      description: "Manage users",
    },
    {
      name: "Batches",
      href: "/admin/dashboard/batches",
      icon: BookOpen,
      active: pathname?.includes("/admin/dashboard/batches"),
      description: "Course batches",
    },
    {
      name: "Quizzes",
      href: "/admin/dashboard/quizzes",
      icon: ClipboardList,
      active: pathname?.includes("/admin/dashboard/quizzes"),
      description: "Assessments",
    },
    {
      name: "Analytics",
      href: "/admin/dashboard/analytics",
      icon: BarChart2,
      active: pathname?.includes("/admin/dashboard/analytics"),
      description: "Performance metrics",
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarOpen ? "w-64" : "w-20"} bg-white shadow-lg text-gray-800`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <button
            className={`flex items-center ${
              sidebarOpen ? "space-x-2" : "justify-center"
            } hover:opacity-80 transition-opacity`}
          >
            {sidebarOpen && (
              <div className="bg-gradient-to-r from-[#084fa1] to-[#80b742] p-1.5 rounded">
                <img
                  src="/lovable-uploads/32af9e28-6339-45f7-99d6-e869903ed166.png"
                  alt="Sivan InfoTech Logo"
                  className="h-6 w-auto"
                />
              </div>
            )}
            {sidebarOpen && (
              <span className="font-bold text-lg bg-gradient-to-r from-[#084fa1] to-[#80b742] bg-clip-text text-transparent">
                SivanInfoTech
              </span>
            )}
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center ${
                  sidebarOpen ? "px-3 py-2.5" : "p-2 justify-center"
                } text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-[#084fa1]/10 to-[#80b742]/10 text-[#084fa1]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#084fa1]"
                }`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon
                  className={`${
                    sidebarOpen ? "mr-3" : ""
                  } h-5 w-5 flex-shrink-0`}
                />
                {sidebarOpen && (
                  <div className="flex-1">
                    <div>{item.name}</div>
                    <div className="text-xs opacity-60">{item.description}</div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User profile section at bottom */}
        {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-gradient-to-r from-[#084fa1] to-[#80b742] text-white">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || "Admin User"}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  Administrator
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left Section - Mobile menu + Breadcrumb */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600">
                <Home className="h-4 w-4" />
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-gray-900">Admin Panel</span>
              </div>
            </div>

            {/* Center Section - Navigation Menu */}
            <div className="hidden lg:flex items-center">
              <nav className="flex items-center space-x-1">
                <Link
                  href="/"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === "/" ? "text-blue-600" : ""
                  }`}
                >
                  <span className="relative z-10">Home</span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                      pathname === "/"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                      pathname === "/"
                        ? "w-3/4 left-1/8"
                        : "w-0 group-hover:w-3/4 group-hover:left-1/8"
                    }`}
                  ></div>
                </Link>
                <Link
                  href="/why-us"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === "/why-us" ? "text-blue-600" : ""
                  }`}
                >
                  <span className="relative z-10">Why SitCloud</span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                      pathname === "/why-us"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                      pathname === "/why-us"
                        ? "w-3/4 left-1/8"
                        : "w-0 group-hover:w-3/4 group-hover:left-1/8"
                    }`}
                  ></div>
                </Link>
                <Link
                  href="/courses"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === "/courses" ? "text-blue-600" : ""
                  }`}
                >
                  <span className="relative z-10">Courses</span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                      pathname === "/courses"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                      pathname === "/courses"
                        ? "w-3/4 left-1/8"
                        : "w-0 group-hover:w-3/4 group-hover:left-1/8"
                    }`}
                  ></div>
                </Link>
                <Link
                  href="/verify"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === "/verify" ? "text-blue-600" : ""
                  }`}
                >
                  <span className="relative z-10">Verify Certificate</span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                      pathname === "/verify"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                      pathname === "/verify"
                        ? "w-3/4 left-1/8"
                        : "w-0 group-hover:w-3/4 group-hover:left-1/8"
                    }`}
                  ></div>
                </Link>
                <Link
                  href="/contact"
                  className={`relative px-4 py-2 text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm rounded-lg group ${
                    pathname === "/contact" ? "text-blue-600" : ""
                  }`}
                >
                  <span className="relative z-10">Contact</span>
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-lg transition-opacity duration-300 ${
                      pathname === "/contact"
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ${
                      pathname === "/contact"
                        ? "w-3/4 left-1/8"
                        : "w-0 group-hover:w-3/4 group-hover:left-1/8"
                    }`}
                  ></div>
                </Link>
              </nav>
            </div>

            {/* Right Section - Notifications & Profile Only */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-gray-100 rounded-xl h-10 w-10"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 p-0 border-0 shadow-xl bg-white rounded-2xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                        3 new
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <DropdownMenuItem className="py-2 hover:bg-gray-50">
                      <div className="flex flex-col">
                        <span className="font-medium">New quiz submission</span>
                        <span className="text-xs text-gray-500">
                          5 mins ago
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 hover:bg-gray-50">
                      <div className="flex flex-col">
                        <span className="font-medium">User registration</span>
                        <span className="text-xs text-gray-500">
                          15 mins ago
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 hover:bg-gray-50">
                      <div className="flex flex-col">
                        <span className="font-medium">Batch completion</span>
                        <span className="text-xs text-gray-500">
                          1 hour ago
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-gradient-to-r from-[#084fa1] to-[#80b742] text-white">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name || "Admin User"}
                      </div>
                      <div className="text-xs text-gray-500">Administrator</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 p-0 border-0 shadow-xl bg-white rounded-2xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 text-white">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm bg-white/20">
                          {user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user?.name || "Admin User"}
                        </div>
                        <div className="text-sm opacity-90">
                          {user?.email || "admin@example.com"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <DropdownMenuItem className="py-2 hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Profile</div>
                          <div className="text-xs text-gray-500">
                            Manage your account
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2 hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <Settings className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Settings</div>
                          <div className="text-xs text-gray-500">
                            Admin preferences
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="py-2 hover:bg-red-50 text-red-600"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Logout</div>
                          <div className="text-xs text-gray-500">
                            Sign out of account
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area with modern styling */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
