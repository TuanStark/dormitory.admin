import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Navigation links configuration
const navItems = [
  { name: 'Dashboard', path: '/', icon: 'home' },
  { name: 'Buildings', path: '/buildings', icon: 'building' },
  { name: 'Rooms', path: '/rooms', icon: 'door-open' },
  { name: 'Bookings', path: '/bookings', icon: 'calendar-alt' },
  { name: 'Users', path: '/users', icon: 'users' },
  { name: 'Reports', path: '/reports', icon: 'clipboard-list' },
  { name: 'Reviews', path: '/reviews', icon: 'star' },
  { name: 'Settings', path: '/settings', icon: 'cog' },
];

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  // Set active item based on current route
  useEffect(() => {
    const path = location.pathname;
    const currentItem = navItems.find((item) => 
      path === item.path || 
      (item.path !== '/' && path.startsWith(item.path))
    );
    
    setActiveItem(currentItem?.name || 'Dashboard');
  }, [location.pathname]);

  return (
    <div 
      className={`bg-white h-full border-r border-gray-100 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } shadow-sm z-30`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center px-4">
        {isOpen ? (
          <div className="flex items-center">
            <div className="h-9 w-9 rounded-lg bg-primary-600 flex items-center justify-center text-white mr-2">
              <i className="fas fa-building text-lg"></i>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              DormManager
            </h1>
          </div>
        ) : (
          <div className="h-9 w-9 rounded-lg bg-primary-600 flex items-center justify-center text-white">
            <i className="fas fa-building"></i>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-3 py-4">
        <div className={isOpen ? "mb-2 px-3 text-xs font-medium text-gray-400 uppercase" : "mb-2 text-center text-xs font-medium text-gray-400 uppercase"}>
          Menu
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-menu-item ${activeItem === item.name ? 'active' : ''}`}
            >
              <i className={`fas fa-${item.icon} ${activeItem === item.name ? 'text-primary-600' : 'text-gray-500'}`}></i>
              {isOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 