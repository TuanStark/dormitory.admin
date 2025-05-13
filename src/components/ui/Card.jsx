import React from 'react';

const Card = ({ children, className = '', padding = 'normal', shadow = 'normal' }) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'small':
        return 'p-3';
      case 'normal':
        return 'p-5';
      case 'large':
        return 'p-6';
      default:
        return 'p-5';
    }
  };

  const getShadowClasses = () => {
    switch (shadow) {
      case 'none':
        return '';
      case 'small':
        return 'shadow-sm';
      case 'normal':
        return 'shadow';
      case 'large':
        return 'shadow-lg';
      default:
        return 'shadow';
    }
  };

  const baseClasses = 'bg-white rounded-lg border border-gray-200';
  const classes = `${baseClasses} ${getPaddingClasses()} ${getShadowClasses()} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card; 