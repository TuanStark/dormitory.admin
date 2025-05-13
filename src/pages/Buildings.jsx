import { useState } from 'react';
import { buildings } from '../data/mockData';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const Buildings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter buildings based on search term
  const filteredBuildings = buildings.filter(building => 
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Buildings</h1>
        <Button 
          variant="primary"
          icon="fas fa-plus"
        >
          Add Building
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search buildings..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <i className="fas fa-search text-gray-400"></i>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
            <option value="">Sort by</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="rooms">Rooms</option>
          </select>
        </div>
      </div>
      
      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuildings.map(building => (
          <div key={building.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={building.image} 
                alt={building.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium flex items-center">
                <i className="fas fa-star text-yellow-400 mr-1"></i>
                {building.averageRating.toFixed(1)}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{building.name}</h3>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <i className="fas fa-map-marker-alt text-gray-400 mr-1"></i>
                {building.address}
              </p>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{building.floors}</span> Floors
                </div>
                <Link 
                  to={`/buildings/${building.id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Details
                </Link>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-xs text-gray-500">Ratings</div>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                          key={star}
                          className={`fas fa-star text-xs ${
                            star <= Math.round(building.averageRating) 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="text-gray-500 hover:text-gray-700">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-700 ml-3">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredBuildings.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="fas fa-building text-gray-300 text-5xl"></i>
          <p className="mt-4 text-gray-500 text-lg">No buildings found</p>
          <p className="text-gray-400">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default Buildings; 