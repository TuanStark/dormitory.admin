import DashboardOverview from '../components/dashboard/DashboardOverview.tsx';
import RecentBookings from '../components/dashboard/RecentBookings.tsx';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardOverview />
      <RecentBookings />
    </div>
  );
};

export default Dashboard; 