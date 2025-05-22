import { User } from '../data/mockData.ts';
import { jwtDecode } from 'jwt-decode';

// Define types
export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  token?: string;
}

interface DecodedToken {
  sub: string;
  userId: number;
  email: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

// Check if token is expired
export const isTokenExpired = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return true;
    
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return true;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't check, assume it's expired
  }
};

// Check if user is logged in
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null && !isTokenExpired();
};

// Login function - now uses fetch API
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Store the JWT token
      localStorage.setItem('token', data.token);
      
      // Store user data if available
      if (data.user) {
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }
      
      return { 
        success: true, 
        user: data.user,
        token: data.token
      };
    } else {
      return { 
        success: false, 
        message: data.message || 'Invalid email or password'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: 'Network error. Please try again.'
    };
  }
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

// Decode JWT token
export const decodeToken = (): DecodedToken | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Fetch user data from API using userId
export const fetchUserData = async (userId: number): Promise<User | null> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await fetch(`http://localhost:8000/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (!isAuthenticated()) {
    return null;
  }
  
  try {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    logout();
    return null;
  }
};

// Check if user has specific role
export const hasRole = (role: number): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const userRole = currentUser.roleId;
  return userRole === role;
};

// Check if user is admin
export const isAdmin = (): boolean => {
  return hasRole(1); // Admin role ID is 1
};

// Check if user has permission for specific action
export const hasPermission = (permission: string): boolean => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  // Admin has all permissions
  if (isAdmin()) return true;
  
  const userRole = currentUser.roleId;
  
  if (userRole === 2) { // Manager role ID is 2
    const managerPermissions = [
      'view_buildings',
      'view_rooms',
      'manage_rooms',
      'view_bookings',
      'manage_bookings',
      'view_reports',
      'manage_reports'
    ];
    
    return managerPermissions.includes(permission);
  }
  
  // Regular users have very limited permissions
  if (userRole === 3) { // User role ID is 3
    const userPermissions = [
      'view_buildings',
      'view_rooms',
      'create_booking',
      'view_own_bookings',
      'create_report',
      'view_own_reports'
    ];
    
    return userPermissions.includes(permission);
  }
  
  return false;
}; 