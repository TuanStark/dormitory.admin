import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { buildings, rooms, reviews, RoomStatus } from '../data/mockData';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [building, setBuilding] = useState(null);
  const [buildingRooms, setBuildingRooms] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const foundBuilding = buildings.find(b => b.id === parseInt(id));
      
      if (foundBuilding) {
        setBuilding(foundBuilding);
        
        // Get rooms for this building
        const foundRooms = rooms.filter(room => room.buildingId === parseInt(id));
        setBuildingRooms(foundRooms);
      }
      
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleGoBack = () => {
    navigate('/buildings');
  };

  // Get room status counts
  const getRoomStatusCounts = () => {
    const counts = {
      available: 0,
      occupied: 0,
      maintenance: 0,
      reserved: 0
    };
    
    buildingRooms.forEach(room => {
      counts[room.status.toLowerCase()]++;
    });
    
    return counts;
  };
  
  const statusCounts = getRoomStatusCounts();

  // Get room status badge variant
  const getRoomStatusBadgeVariant = (status) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return 'success';
      case RoomStatus.OCCUPIED:
        return 'info';
      case RoomStatus.MAINTENANCE:
        return 'warning';
      case RoomStatus.RESERVED:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-3xl text-primary-500"></i>
          <p className="mt-2 text-gray-600">Loading building details...</p>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
        <i className="fas fa-exclamation-circle text-4xl text-gray-400"></i>
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Building Not Found</h2>
        <p className="mt-2 text-gray-500">The building you're looking for doesn't exist.</p>
        <Button 
          variant="primary" 
          className="mt-4"
          onClick={handleGoBack}
        >
          Go Back to Buildings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleGoBack}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <i className="fas fa-arrow-left text-gray-500"></i>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{building.name}</h1>
      </div>
      
      {/* Building info card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 h-64 md:h-auto relative">
            <img 
              src={building.image} 
              alt={building.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-medium flex items-center">
              <i className="fas fa-star text-yellow-400 mr-1"></i>
              {building.averageRating.toFixed(1)}
            </div>
          </div>
          
          <div className="p-6 md:w-2/3">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{building.name}</h2>
                <p className="text-gray-600 mt-1 flex items-center">
                  <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                  {building.address}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  icon="fas fa-edit"
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  icon="fas fa-trash-alt"
                >
                  Delete
                </Button>
              </div>
            </div>
            
            <p className="mt-4 text-gray-700">{building.description}</p>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Floors</div>
                <div className="text-xl font-semibold text-gray-900 flex items-center mt-1">
                  <i className="fas fa-building text-gray-400 mr-2"></i>
                  {building.floors}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Rooms</div>
                <div className="text-xl font-semibold text-gray-900 flex items-center mt-1">
                  <i className="fas fa-door-open text-gray-400 mr-2"></i>
                  {buildingRooms.length}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Available</div>
                <div className="text-xl font-semibold text-green-600 flex items-center mt-1">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  {statusCounts.available}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Occupied</div>
                <div className="text-xl font-semibold text-blue-600 flex items-center mt-1">
                  <i className="fas fa-user text-blue-500 mr-2"></i>
                  {statusCounts.occupied}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-2">
              <a href={`https://maps.google.com/?q=${building.latitude},${building.longitude}`} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
              >
                <i className="fas fa-map-marked-alt mr-1"></i>
                View on Map
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'rooms'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('rooms')}
            >
              Rooms ({buildingRooms.length})
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Building Overview</h3>
              <div className="prose max-w-none">
                <p>{building.description}</p>
                <h4 className="font-semibold mt-4">Location</h4>
                <p>Located at {building.address}, this building offers convenient access to university facilities and amenities.</p>
                <h4 className="font-semibold mt-4">Facilities</h4>
                <ul className="list-disc pl-4">
                  <li>WiFi throughout the building</li>
                  <li>Laundry facilities</li>
                  <li>Study rooms on each floor</li>
                  <li>Community kitchens</li>
                  <li>24/7 security</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Rooms</h3>
                <Button 
                  variant="primary" 
                  size="sm"
                  icon="fas fa-plus"
                >
                  Add Room
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {buildingRooms.map(room => (
                      <tr key={room.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">Room {room.roomNumber}</div>
                          <div className="text-xs text-gray-500">{room.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.floor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.capacity} {room.capacity > 1 ? 'persons' : 'person'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${room.price}/month
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getRoomStatusBadgeVariant(room.status)}>
                            {room.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/rooms/${room.id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                            View
                          </Link>
                          <button className="text-gray-500 hover:text-gray-700 mr-2">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {buildingRooms.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <i className="fas fa-door-open text-gray-300 text-5xl"></i>
                  <p className="mt-4 text-gray-500 text-lg">No rooms found</p>
                  <Button 
                    variant="primary" 
                    className="mt-4"
                    icon="fas fa-plus"
                  >
                    Add Room
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
              </div>
              
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{building.averageRating.toFixed(1)}</div>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                          key={star}
                          className={`fas fa-star ${
                            star <= Math.round(building.averageRating) 
                              ? 'text-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Based on {building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar} reviews
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="text-xs w-12">5 stars</div>
                      <div className="w-36 h-2 bg-gray-200 rounded-full mx-2">
                        <div 
                          className="h-2 bg-yellow-400 rounded-full" 
                          style={{ width: `${(building.fiveStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{building.fiveStar}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs w-12">4 stars</div>
                      <div className="w-36 h-2 bg-gray-200 rounded-full mx-2">
                        <div 
                          className="h-2 bg-yellow-400 rounded-full" 
                          style={{ width: `${(building.fourStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{building.fourStar}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs w-12">3 stars</div>
                      <div className="w-36 h-2 bg-gray-200 rounded-full mx-2">
                        <div 
                          className="h-2 bg-yellow-400 rounded-full" 
                          style={{ width: `${(building.threeStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{building.threeStar}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs w-12">2 stars</div>
                      <div className="w-36 h-2 bg-gray-200 rounded-full mx-2">
                        <div 
                          className="h-2 bg-yellow-400 rounded-full" 
                          style={{ width: `${(building.twoStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{building.twoStar}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs w-12">1 star</div>
                      <div className="w-36 h-2 bg-gray-200 rounded-full mx-2">
                        <div 
                          className="h-2 bg-yellow-400 rounded-full" 
                          style={{ width: `${(building.oneStar / (building.fiveStar + building.fourStar + building.threeStar + building.twoStar + building.oneStar)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{building.oneStar}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Individual reviews would go here */}
              <div className="space-y-4">
                {reviews
                  .filter(review => {
                    const room = rooms.find(r => r.id === review.roomId);
                    return room && room.buildingId === building.id;
                  })
                  .map(review => (
                    <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                            U
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">User</div>
                            <div className="text-xs text-gray-500">{new Date(review.reviewDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i 
                              key={star}
                              className={`fas fa-star text-xs ${
                                star <= review.rating 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-700">{review.content}</p>
                      </div>
                    </div>
                  ))}
              </div>
              
              {reviews.filter(review => {
                const room = rooms.find(r => r.id === review.roomId);
                return room && room.buildingId === building.id;
              }).length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <i className="fas fa-star text-gray-300 text-5xl"></i>
                  <p className="mt-4 text-gray-500 text-lg">No reviews yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildingDetail; 