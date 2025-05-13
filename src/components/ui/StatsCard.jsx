const StatsCard = ({ title, value, subtitle, icon, iconBgColor, borderColor }) => {
  return (
    <div className={`card bg-white rounded-lg shadow-md p-6 border-l-4 ${borderColor || 'border-primary-500'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value}
            {subtitle && <span className="text-sm font-normal text-gray-500 ml-1">{subtitle}</span>}
          </p>
        </div>
        {icon && (
          <div className={`rounded-full p-3 ${iconBgColor || 'bg-primary-100'}`}>
            <i className={`${icon} text-xl ${iconBgColor ? '' : 'text-primary-500'}`}></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard; 