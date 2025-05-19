import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="mt-2 text-base text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="mt-8">
          <i className="fas fa-map-signs text-7xl text-gray-300"></i>
        </div>
        
        <div className="mt-8 space-y-4">
          <p className="text-base text-gray-500">
            The page might have been moved, deleted, or never existed.
          </p>
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
            <Button
              as={Link}
              to="/"
              variant="primary"
              icon="fas fa-home"
            >
              Back to Home
            </Button>
            
            <Button
              as={Link}
              to="/buildings"
              variant="outline"
              icon="fas fa-building"
            >
              View Buildings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 