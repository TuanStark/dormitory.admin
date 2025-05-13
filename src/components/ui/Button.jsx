// Button variants
export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
  OUTLINE: 'outline',
  GHOST: 'ghost',
};

// Button sizes
export const BUTTON_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
};

const Button = ({
  variant = BUTTON_VARIANTS.PRIMARY,
  size = BUTTON_SIZES.MD,
  type = 'button',
  className = '',
  icon = null,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onClick,
  children,
  ...rest
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded focus:outline-none transition-colors';
  
  // Variant classes
  const getVariantClasses = () => {
    switch (variant) {
      case BUTTON_VARIANTS.PRIMARY:
        return 'bg-primary-600 hover:bg-primary-700 text-white';
      case BUTTON_VARIANTS.SECONDARY:
        return 'bg-secondary-600 hover:bg-secondary-700 text-white';
      case BUTTON_VARIANTS.SUCCESS:
        return 'bg-green-600 hover:bg-green-700 text-white';
      case BUTTON_VARIANTS.DANGER:
        return 'bg-red-600 hover:bg-red-700 text-white';
      case BUTTON_VARIANTS.WARNING:
        return 'bg-yellow-500 hover:bg-yellow-600 text-gray-900';
      case BUTTON_VARIANTS.INFO:
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case BUTTON_VARIANTS.OUTLINE:
        return 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700';
      case BUTTON_VARIANTS.GHOST:
        return 'hover:bg-gray-100 text-gray-700';
      default:
        return 'bg-primary-600 hover:bg-primary-700 text-white';
    }
  };
  
  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case BUTTON_SIZES.SM:
        return 'px-2 py-1 text-xs';
      case BUTTON_SIZES.MD:
        return 'px-4 py-2 text-sm';
      case BUTTON_SIZES.LG:
        return 'px-5 py-2.5 text-base';
      case BUTTON_SIZES.XL:
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  };
  
  // State classes
  const getStateClasses = () => {
    if (disabled || loading) {
      return 'opacity-50 cursor-not-allowed';
    }
    return '';
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${getStateClasses()} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <span className={`mr-2 inline-block ${iconPosition === 'right' ? 'order-last ml-2' : ''}`}>
          <i className="fas fa-spinner fa-spin"></i>
        </span>
      )}
      
      {icon && !loading && (
        <span className={`${iconPosition === 'right' ? 'order-last ml-2' : 'mr-2'}`}>
          <i className={icon}></i>
        </span>
      )}
      
      {children}
    </button>
  );
};

export default Button; 