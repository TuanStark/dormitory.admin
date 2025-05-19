import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'normal' | 'large';
  shadow?: 'none' | 'small' | 'normal' | 'large';
  title?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'normal', 
  shadow = 'normal',
  title
}) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    normal: 'p-5',
    large: 'p-8',
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    normal: 'shadow',
    large: 'shadow-lg',
  };

  return (
    <div className={`bg-white rounded-xl ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`}>
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card; 