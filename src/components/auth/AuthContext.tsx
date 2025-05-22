import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated, getCurrentUser, decodeToken, fetchUserData } from '../../utils/auth';
import { User } from '../../data/mockData';
import { toast } from 'react-toastify';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
  setUserData: (userData: any) => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState(false);
  // Use useRef instead of useState to avoid re-renders
  const initializedRef = useRef(false);

  // Function to load user data from token
  const loadUserFromToken = async () => {
    if (initializedRef.current) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState(false);
        setLoading(false);
        initializedRef.current = true;
        return;
      }
      
      const decoded = decodeToken();
      if (decoded && decoded.userId) {
        try {
          // Fetch user data from API using the userId from token
          const userData = await fetchUserData(decoded.userId);
          if (userData) {
            setUser(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            setAuthState(true);
          } else {
            // If we couldn't fetch user data, fall back to stored user data
            const storedUser = getCurrentUser();
            if (storedUser) {
              setUser(storedUser);
              setAuthState(true);
            } else {
              console.warn('No user data found in localStorage, logging out');
              authLogout();
              setAuthState(false);
            }
          }
        } catch (fetchError) {
          console.error('Error fetching user data:', fetchError);
          // If API call fails, try getting from localStorage
          const storedUser = getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
            setAuthState(true);
          } else {
            console.warn('API fetch failed and no local user data, logging out');
            authLogout();
            setAuthState(false);
          }
        }
      } else {
        // No valid token or no userId in token
        console.warn('Invalid token or no userId in token, logging out');
        authLogout();
        setAuthState(false);
      }
    } catch (error) {
      console.error('Error loading user from token:', error);
      authLogout();
      setAuthState(false);
    } finally {
      setLoading(false);
      initializedRef.current = true;
    }
  };

  useEffect(() => {
    // Check if user is authenticated on mount
    if (isAuthenticated()) {
      loadUserFromToken();
    } else {
      setLoading(false);
      initializedRef.current = true;
    }
    // Empty dependency array ensures this only runs once on mount
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authLogin(email, password);
      
      if (response.success) {
        // If we have user data in the response, set it
        if (response.user) {
          setUser(response.user);
          setAuthState(true);
        } else {
          // Otherwise, try to load user data from token
          const decoded = decodeToken();
          if (decoded && decoded.userId) {
            try {
              const userData = await fetchUserData(decoded.userId);
              if (userData) {
                setUser(userData);
                setAuthState(true);
              }
            } catch (error) {
              console.error('Error fetching user data after login:', error);
              toast.error('Đăng nhập thành công nhưng không thể lấy thông tin người dùng');
            }
          }
        }
        return { success: true };
      }
      
      return { success: false, message: response.message || 'Đăng nhập thất bại' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Đã xảy ra lỗi khi đăng nhập' };
    }
  };

  const logout = () => {
    authLogout();
    setAuthState(false);
    setUser(null);
  };

  const setUserData = (userData: any) => {
    if (userData) {
      setUser(userData);
      setAuthState(true);
      // Store user data in localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(userData));
    }
  };

  // Function to refresh user data from API
  const refreshUserData = async () => {
    const decoded = decodeToken();
    if (decoded && decoded.userId) {
      try {
        const userData = await fetchUserData(decoded.userId);
        if (userData) {
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
  };

  const value = {
    isAuthenticated: authState,
    user,
    login,
    logout,
    loading,
    setUserData,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 