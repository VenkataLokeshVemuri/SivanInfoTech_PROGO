import { useState, useEffect, useCallback } from 'react';
import { backendAPI } from '@/lib/backend-api';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'STUDENT';
  verified: boolean;
  phone?: string;
  isFromCollege?: boolean;
  collegeName?: string;
  enrollments?: any[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  isfromcollege: boolean;
  collagename?: string;
}

export function useBackendAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Decode JWT token manually (simple base64 decode)
  const decodeToken = useCallback((token: string): User | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      
      if (decoded && typeof decoded === 'object') {
        return {
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          role: decoded.role,
          verified: decoded.verified,
        };
      }
      return null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }, []);

  // Check if token is expired
  const isTokenExpired = useCallback((token: string): boolean => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;
      
      const payload = parts[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      
      if (decoded && decoded.exp) {
        return Date.now() >= decoded.exp * 1000;
      }
      return true;
    } catch {
      return true;
    }
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken && !isTokenExpired(storedToken)) {
          const user = decodeToken(storedToken);
          if (user) {
            backendAPI.setToken(storedToken);
            
            // Try to refresh token to ensure it's still valid
            const refreshResponse = await backendAPI.refreshToken();
            if (refreshResponse.success && refreshResponse.data?.token) {
              const newToken = refreshResponse.data.token;
              const refreshedUser = decodeToken(newToken);
              
              setAuthState({
                user: refreshedUser,
                token: newToken,
                isLoading: false,
                isAuthenticated: true,
                error: null,
              });
            } else {
              // Token refresh failed, clear auth
              localStorage.removeItem('authToken');
              setAuthState({
                user: null,
                token: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,
              });
            }
          } else {
            setAuthState({
              user: null,
              token: null,
              isLoading: false,
              isAuthenticated: false,
              error: null,
            });
          }
        } else {
          // No valid token found
          if (storedToken) {
            localStorage.removeItem('authToken');
          }
          setAuthState({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
          error: 'Failed to initialize authentication',
        });
      }
    };

    initializeAuth();
  }, [decodeToken, isTokenExpired]);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendAPI.login(credentials.email, credentials.password);
      
      if (response.success && response.data?.token) {
        const user = decodeToken(response.data.token);
        
        if (user) {
          setAuthState({
            user,
            token: response.data.token,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
          
          return { success: true, message: response.message };
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Invalid token received',
          }));
          return { success: false, error: 'Invalid token received' };
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Login failed',
        }));
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      const errorMessage = 'Network error occurred';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [decodeToken]);

  // Register function
  const register = useCallback(async (userData: RegisterData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await backendAPI.register(userData);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      if (response.success) {
        return { 
          success: true, 
          message: response.message || 'Registration successful. Please check your email for verification.' 
        };
      } else {
        setAuthState(prev => ({
          ...prev,
          error: response.error || 'Registration failed',
        }));
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      const errorMessage = 'Network error occurred';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      await backendAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    if (!authState.token) return false;

    try {
      const response = await backendAPI.refreshToken();
      
      if (response.success && response.data?.token) {
        const user = decodeToken(response.data.token);
        
        if (user) {
          setAuthState(prev => ({
            ...prev,
            user,
            token: response.data?.token || '',
          }));
          return true;
        }
      }
      
      // Token refresh failed, logout user
      await logout();
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      return false;
    }
  }, [authState.token, decodeToken, logout]);

  // Verify email function
  const verifyEmail = useCallback(async (token: string) => {
    try {
      const response = await backendAPI.verifyEmail(token);
      return {
        success: response.success,
        message: response.message || (response.success ? 'Email verified successfully' : 'Email verification failed'),
        error: response.error,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred',
      };
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!authState.token || !authState.isAuthenticated) return;

    const checkTokenExpiry = () => {
      if (isTokenExpired(authState.token!)) {
        refreshToken();
      }
    };

    // Check token expiry every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authState.token, authState.isAuthenticated, isTokenExpired, refreshToken]);

  return {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    verifyEmail,
    clearError,
    isAdmin: authState.user?.role === 'ADMIN',
    isStudent: authState.user?.role === 'STUDENT',
  };
}