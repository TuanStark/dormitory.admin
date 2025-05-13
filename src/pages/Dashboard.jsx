import DashboardOverview from '../components/dashboard/DashboardOverview';
import RecentBookings from '../components/dashboard/RecentBookings';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardOverview />
      <RecentBookings />
    </div>
  );
};

export default Dashboard; 