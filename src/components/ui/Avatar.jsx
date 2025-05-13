import React from 'react';

const Avatar = ({ 
  src, 
  alt = '', 
  name = '', 
  size = 'md', 
  status = null, 
  className = '' 
}) => {
  // Determine size class
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'w-6 h-6 text-xs';
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'md':
        return 'w-10 h-10 text-base';
      case 'lg':
        return 'w-12 h-12 text-lg';
      case 'xl':
        return 'w-16 h-16 text-xl';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  // Generate initials from name
  const getInitials = () => {
    if (!name) return '';
    const nameParts = name.split(' ');
    
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    
    return nameParts[0][0].toUpperCase();
  };

  // Status indicator colors
  const getStatusClasses = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return '';
    }
  };

  const sizeClasses = getSizeClasses();
  const baseClasses = 'rounded-full flex items-center justify-center text-white font-medium';
  const statusClasses = status ? `${getStatusClasses()} absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4 border-2 border-white rounded-full` : '';
  const statusSize = size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt || name} 
          className={`${sizeClasses} ${baseClasses} object-cover`}
        />
      ) : (
        <div 
          className={`${sizeClasses} ${baseClasses} bg-primary-600`}
          title={name}
        >
          {getInitials()}
        </div>
      )}
      
      {status && (
        <span className={`${statusClasses} ${statusSize}`}></span>
      )}
    </div>
  );
};

export default Avatar; 