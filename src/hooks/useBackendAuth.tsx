"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { backendAPI } from "@/lib/backend-api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "student" | "admin" | "counselor";
}

interface BackendAuthContextType {
  user: User | null;
  // legacy/alternate name: some components use `isLoading`
  loading: boolean;
  isLoading: boolean;
  error?: string | null;
  clearError: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  // Accepts either (email, password) or a single object { email, password }
  login: (
    emailOrPayload: string | { email: string; password: string },
    passwordArg?: string
  ) => Promise<{
    success: boolean;
    error?: string;
    user?: User;
    message?: string;
  }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  verifyEmail: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; error?: string }>;
  verifyEmailToken?: (
    token: string
  ) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const BackendAuthContext = createContext<BackendAuthContextType | undefined>(
  undefined
);

export function BackendAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        console.error("Auth check failed:", error);
        backendAPI.logout();
      }
    }
    setLoading(false);
  };

  const login = async (
    emailOrPayload: string | { email: string; password: string },
    passwordArg?: string
  ) => {
    const email =
      typeof emailOrPayload === "string"
        ? emailOrPayload
        : emailOrPayload.email;
    const password =
      typeof emailOrPayload === "string"
        ? passwordArg
        : emailOrPayload.password;

    console.log("Backend login attempt:", { email });

    try {
      const response = await backendAPI.login(email, password || "");
      console.log("backendAPI.login raw response:", response);

      if (response.success && response.data) {
        const userData = response.data.user;
        setUser(userData);
        setError(null);
        toast({
          title: "Welcome Back!",
          description: "You have successfully signed in.",
        });
        return { success: true, user: userData };
      } else {
        const err = response.error || "Invalid credentials";
        setError(err);
        toast({
          title: "Login Failed",
          description: err,
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = "Login failed. Please try again.";
      setError(errorMessage);
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
    console.log("Backend registration attempt:", {
      email: userData.email,
      name: userData.name,
    });

    try {
      const response = await backendAPI.register(userData);

      if (response.success) {
        toast({
          title: "Registration Successful!",
          description: "Please check your email for verification instructions.",
        });
        setError(null);
        return { success: true };
      } else {
        const err = response.error || "Failed to create account";
        setError(err);
        toast({
          title: "Registration Failed",
          description: err,
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = "Registration failed. Please try again.";
      setError(errorMessage);
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
      const response = await backendAPI.verifyEmail({ email, otp });

      if (response.success) {
        toast({
          title: "Email Verified!",
          description: "Your account has been verified. You can now sign in.",
        });
        setError(null);
        return { success: true };
      } else {
        const err = response.error || "Invalid verification code";
        setError(err);
        toast({
          title: "Verification Failed",
          description: err,
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = "Verification failed. Please try again.";
      setError(errorMessage);
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    }
  };

  const verifyEmailToken = async (token: string) => {
    try {
      const response = await backendAPI.verifyEmailToken(token);

      if (response.success) {
        toast({
          title: "Email Verified!",
          description: "Your account has been verified. You can now sign in.",
        });
        setError(null);
        return { success: true };
      } else {
        const err = response.error || "Invalid or expired token";
        setError(err);
        toast({
          title: "Verification Failed",
          description: err,
          variant: "destructive",
        });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = "Verification failed. Please try again.";
      setError(errorMessage);
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
        console.error("Profile refresh failed:", error);
      }
    }
  };

  const clearError = () => setError(null);

  const isAuthenticated = !!user && backendAPI.isAuthenticated();
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  return (
    <BackendAuthContext.Provider
      value={{
        user,
        loading,
        isLoading: loading,
        error,
        clearError,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        verifyEmail,
        verifyEmailToken,
        refreshProfile,
      }}
    >
      {children}
    </BackendAuthContext.Provider>
  );
}

export function useBackendAuth() {
  const context = useContext(BackendAuthContext);
  if (context === undefined) {
    throw new Error("useBackendAuth must be used within a BackendAuthProvider");
  }
  return context;
}
