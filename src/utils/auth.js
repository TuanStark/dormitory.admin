import { users, RoleTypes } from '../data/mockData';

// Simulated authentication functions for demo purposes
// In a real application, this would use a proper auth service

// Check if user is logged in
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

// Login function
export const login = (email, password) => {
  // Find user with matching credentials
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    // Store user info in localStorage for demo purposes
    // In a real app, we would use JWT tokens or another secure method
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: users.find(u => u.id === user.id)?.roleId,
      status: user.status
    }));
    
    return { success: true, user };
  }

  return { success: false, message: 'Invalid email or password' };
};

// Logout function
export const logout = () => {
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('currentUser');
};

// Get current user
export const getCurrentUser = () => {
  if (!isAuthenticated()) {
    return null;
  }
  
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch (e) {
    logout();
    return null;
  }
};

// Check if user has specific role
export const hasRole = (role) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const userRole = users.find(u => u.id === currentUser.id)?.roleId;
  const matchedRole = userRole === role;
  
  return matchedRole;
};

// Check if user is admin
export const isAdmin = () => {
  return hasRole(1); // Admin role ID is 1
};

// Check if user has permission for specific action
export const hasPermission = (permission) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  // Admin has all permissions
  if (isAdmin()) return true;
  
  // Add more granular permissions as needed
  // For now, simplified version where managers have specific permissions
  const userRole = users.find(u => u.id === currentUser.id)?.roleId;
  
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