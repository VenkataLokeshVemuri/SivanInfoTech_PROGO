"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { backendAPI } from '@/lib/backend-api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'admin' | 'counselor';
}

interface BackendAuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyEmail: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const BackendAuthContext = createContext<BackendAuthContextType | undefined>(undefined);

export function BackendAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (backendAPI.isAuthenticated()) {
      try {
        const response = await backendAPI.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Invalid token, clear it
          backendAPI.logout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        backendAPI.logout();
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    console.log('Backend login attempt:', { email });
    
    try {
      const response = await backendAPI.login(email, password);
      
      if (response.success && response.data) {
        const userData = response.data.user;
        setUser(userData);
        toast({
          title: "Welcome Back!",
          description: "You have successfully signed in.",
        });
        return { success: true, user: userData };
      } else {
        toast({
          title: "Login Failed",
          description: response.error || "Invalid credentials",
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = "Login failed. Please try again.";
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    console.log('Backend registration attempt:', { email: userData.email, name: userData.name });
    
    try {
      const response = await backendAPI.register(userData);
      
      if (response.success) {
        toast({
          title: "Registration Successful!",
          description: "Please check your email for verification instructions.",
        });
        return { success: true };
      } else {
        toast({
          title: "Registration Failed",
          description: response.error || "Failed to create account",
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = "Registration failed. Please try again.";
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    try {
      const response = await backendAPI.verifyEmail(email, otp);
      
      if (response.success) {
        toast({
          title: "Email Verified!",
          description: "Your account has been verified. You can now sign in.",
        });
        return { success: true };
      } else {
        toast({
          title: "Verification Failed",
          description: response.error || "Invalid verification code",
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = "Verification failed. Please try again.";
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    backendAPI.logout();
    setUser(null);
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  const refreshProfile = async () => {
    if (backendAPI.isAuthenticated()) {
      try {
        const response = await backendAPI.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Profile refresh failed:', error);
      }
    }
  };

  const isAuthenticated = !!user && backendAPI.isAuthenticated();
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <BackendAuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      isAdmin,
      isStudent,
      login,
      register,
      logout,
      verifyEmail,
      refreshProfile
    }}>
      {children}
    </BackendAuthContext.Provider>
  );
}

export function useBackendAuth() {
  const context = useContext(BackendAuthContext);
  if (context === undefined) {
    throw new Error('useBackendAuth must be used within a BackendAuthProvider');
  }
  return context;
}