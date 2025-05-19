import React from 'react';

// Badge variants
export const BADGE_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
  INFO: 'info',
} as const;

export type BadgeVariant = typeof BADGE_VARIANTS[keyof typeof BADGE_VARIANTS] | string;

// Badge sizes
export const BADGE_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
} as const;

export type BadgeSize = typeof BADGE_SIZES[keyof typeof BADGE_SIZES];

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = BADGE_VARIANTS.PRIMARY, 
  size = BADGE_SIZES.MD, 
  className = '' 
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case BADGE_VARIANTS.PRIMARY:
        return 'bg-primary-100 text-primary-800';
      case BADGE_VARIANTS.SECONDARY:
        return 'bg-gray-100 text-gray-800';
      case BADGE_VARIANTS.SUCCESS:
        return 'bg-green-100 text-green-800';
      case BADGE_VARIANTS.DANGER:
        return 'bg-red-100 text-red-800';
      case BADGE_VARIANTS.WARNING:
        return 'bg-yellow-100 text-yellow-800';
      case BADGE_VARIANTS.INFO:
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'secondary':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-primary-100 text-primary-800';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case BADGE_SIZES.SM:
        return 'px-2 py-0.5 text-xs';
      case BADGE_SIZES.MD:
        return 'px-2.5 py-0.5 text-sm';
      case BADGE_SIZES.LG:
        return 'px-3 py-1 text-base';
      default:
        return 'px-2.5 py-0.5 text-sm';
    }
  };

  const classes = `inline-flex items-center justify-center font-medium rounded-full ${getVariantClasses()} ${getSizeClasses()} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default Badge; 