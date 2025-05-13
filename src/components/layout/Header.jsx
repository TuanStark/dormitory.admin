import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../../utils/auth';

const Header = ({ toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get current user on component mount
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for the avatar
  const getInitials = () => {
    if (!currentUser?.fullName) return 'U';
    
    const names = currentUser.fullName.split(' ');
    if (names.length === 1) return names[0].charAt(0);
    
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`;
  };

  // Get page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    
    // Extract the main route without params
    const mainRoute = path.split('/')[1];
    
    // Convert to title case
    if (mainRoute) {
      return mainRoute.charAt(0).toUpperCase() + mainRoute.slice(1);
    }
    
    return 'Dashboard';
  };

  return (
    <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left side - Toggle button and page title */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors p-2 rounded-lg hover:bg-gray-100 mr-4"
        >
          <i className="fas fa-bars"></i>
        </button>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800">{getPageTitle()}</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
      
      {/* Right side - Search, actions, notifications, user profile */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 form-input py-2 pl-10 pr-4 rounded-lg text-sm border-gray-200 bg-gray-50 focus:bg-white"
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <i className="fas fa-search"></i>
          </span>
        </div>
        
        {/* Quick Actions */}
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none transition-colors">
          <i className="fas fa-plus"></i>
        </button>
        
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none transition-colors relative"
          >
            <i className="fas fa-bell"></i>
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-800">Notifications</p>
                <button className="text-xs text-primary-600 font-medium hover:text-primary-800">
                  Mark all as read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto p-1">
                <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors mb-1">
                  <div className="flex items-start">
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">New booking request</p>
                      <p className="text-xs text-gray-500">Alice Johnson requested Room 102</p>
                      <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                    </div>
                  </div>
                </a>
                <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors mb-1">
                  <div className="flex items-start">
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Maintenance completed</p>
                      <p className="text-xs text-gray-500">Room 102 maintenance request resolved</p>
                      <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                    </div>
                  </div>
                </a>
                <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-start">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Payment received</p>
                      <p className="text-xs text-gray-500">Payment received for booking #1234</p>
                      <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                    </div>
                  </div>
                </a>
              </div>
              <div className="px-4 py-2 border-t border-gray-100 text-center">
                <a href="#" className="text-sm text-primary-600 font-medium hover:text-primary-800">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 focus:outline-none p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-600 to-secondary-500 flex items-center justify-center text-white font-medium">
              {getInitials()}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {currentUser?.fullName || 'Administrator'}
            </span>
            <i className="fas fa-chevron-down text-xs text-gray-500 hidden md:block"></i>
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{currentUser?.fullName || 'Administrator'}</p>
                <p className="text-xs text-gray-500">{currentUser?.email || 'admin@example.com'}</p>
              </div>
              <div className="py-1">
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <i className="fas fa-user-circle w-4 mr-3 text-gray-500"></i>
                  My Profile
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <i className="fas fa-cog w-4 mr-3 text-gray-500"></i>
                  Account Settings
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <i className="fas fa-question-circle w-4 mr-3 text-gray-500"></i>
                  Help &amp; Support
                </a>
              </div>
              <div className="py-1 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <i className="fas fa-sign-out-alt w-4 mr-3"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 