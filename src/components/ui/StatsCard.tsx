import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  iconBgColor?: string;
  borderColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconBgColor = 'bg-primary-100', 
  borderColor = 'border-primary-500' 
}) => {
  return (
    <div className={`card stats-card relative overflow-hidden border-t-4 ${borderColor}`}>
      <div className="flex items-center">
        {icon && (
          <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
            {icon}
          </div>
        )}
        <div className={icon ? 'ml-4' : ''}>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {subtitle && (
              <span className="ml-2 text-sm text-gray-500">{subtitle}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 