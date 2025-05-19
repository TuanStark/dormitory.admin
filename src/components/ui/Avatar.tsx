import { ReactNode } from 'react';

type StatusType = 'online' | 'busy' | 'away' | 'offline' | null;

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: StatusType;
  initials?: string;
  icon?: ReactNode;
  shape?: 'circle' | 'square';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  status = null,
  initials,
  icon,
  shape = 'circle',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-md',
  };

  const getStatusClasses = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return '';
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-600 ${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
      >
        {src ? (
          <img src={src} alt={alt} className={`object-cover ${shapeClasses[shape]} w-full h-full`} />
        ) : initials ? (
          <span>{initials}</span>
        ) : icon ? (
          icon
        ) : (
          <svg
            className="w-1/2 h-1/2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${getStatusClasses()}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar; 