import { useState } from 'react';
import { reviews, users, rooms, buildings } from '../data/mockData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Reviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Filter reviews based on search term and filters
  const filteredReviews = reviews.filter(review => {
    const user = users.find(u => u.id === review.userId);
    const room = rooms.find(r => r.id === review.roomId);
    const building = room ? buildings.find(b => b.id === room.buildingId) : null;
    
    // Search filter
    const matchesSearch = 
      (review.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (building && building.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Rating filter
    const matchesRating = ratingFilter === '' || review.rating.toString() === ratingFilter;
    
    // Building filter
    const matchesBuilding = buildingFilter === '' || 
      (room && building && building.id.toString() === buildingFilter);
    
    return matchesSearch && matchesRating && matchesBuilding;
  });
  
  // Sort reviews based on selected order
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.reviewDate) - new Date(a.reviewDate);
    } else if (sortOrder === 'oldest') {
      return new Date(a.reviewDate) - new Date(b.reviewDate);
    } else if (sortOrder === 'highest') {
      return b.rating - a.rating;
    } else if (sortOrder === 'lowest') {
      return a.rating - b.rating;
    }
    return 0;
  });

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };
  
  // Count ratings by star level
  const getRatingCounts = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    return counts;
  };
  
  const ratingCounts = getRatingCounts();
  const totalReviews = reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reviews & Feedback</h1>
        <Button 
          variant="primary"
          icon="fas fa-plus"
        >
          Add Review
        </Button>
      </div>
      
      {/* Ratings overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="text-center py-6">
            <div className="text-5xl font-bold text-gray-900">{calculateAverageRating()}</div>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <i 
                  key={star}
                  className={`fas fa-star ${
                    star <= Math.round(calculateAverageRating()) 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                ></i>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-2">Based on {totalReviews} reviews</div>
          </div>
        </Card>
        
        <Card className="lg:col-span-2">
          <div className="p-4">
            <div className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</div>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="w-24 flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">{rating}</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i 
                        key={star}
                        className={`fas fa-star text-xs ${
                          star <= rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      ></i>
                    ))}
                  </div>
                  <div className="flex-grow h-2 bg-gray-200 rounded-full mx-2">
                    <div 
                      className="h-2 bg-yellow-400 rounded-full" 
                      style={{ width: totalReviews > 0 ? `${(ratingCounts[rating] / totalReviews) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <div className="w-10 text-xs text-gray-500">{ratingCounts[rating] || 0}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Search and filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
          >
            <option value="">All Buildings</option>
            {buildings.map(building => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </Card>
      
      {/* Reviews list */}
      <div className="space-y-4">
        {sortedReviews.map((review) => {
          const user = users.find(u => u.id === review.userId);
          const room = rooms.find(r => r.id === review.roomId);
          const building = room ? buildings.find(b => b.id === room.buildingId) : null;
          
          return (
            <Card key={review.id} className="relative">
              <div className="flex justify-between">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {user && user.fullName.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{user ? user.fullName : 'Anonymous'}</div>
                    <div className="text-xs text-gray-500">
                      {building ? building.name : 'Unknown Building'} 
                      {room && ` - Room ${room.roomNumber}`}
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(review.reviewDate)}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex mr-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i 
                        key={star}
                        className={`fas fa-star text-sm ${
                          star <= review.rating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      ></i>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-gray-700">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700">{review.content}</p>
              </div>
              
              {review.response && (
                <div className="mt-4 ml-8 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                      A
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">Admin Response</div>
                      <div className="text-xs text-gray-500">{formatDate(review.responseDate)}</div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{review.response}</p>
                </div>
              )}
              
              {!review.response && (
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    <i className="fas fa-reply mr-1"></i>
                    Reply
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      
      {sortedReviews.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <i className="fas fa-star text-gray-300 text-5xl"></i>
          <p className="mt-4 text-gray-500 text-lg">No reviews found</p>
          <p className="text-gray-400">Try adjusting your filters</p>
        </div>
      )}
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{sortedReviews.length}</span> of <span className="font-medium">{reviews.length}</span> reviews
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews; 