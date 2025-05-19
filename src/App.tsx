import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Buildings from './pages/Buildings.jsx';
import BuildingDetail from './pages/BuildingDetail.jsx';
import Rooms from './pages/Rooms';
import Users from './pages/Users.jsx';
import Settings from './pages/Settings.jsx';
import Bookings from './pages/Bookings.jsx';
import Reports from './pages/Reports.jsx';
import Reviews from './pages/Reviews.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Import Font Awesome for icons (add the CDN link to index.html)
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/buildings" element={<Buildings />} />
            <Route path="/buildings/:id" element={<BuildingDetail />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        
        {/* Catch all - 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App; 