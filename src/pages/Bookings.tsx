import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Pagination from '../components/ui/Pagination';
import { toast } from 'react-toastify';
import useQuery from '../hooks/useQuery';
import useFecthApi from '../hooks/useFecthApi';
import useUpdateApi from '../hooks/useUpdateApi';
import useDetailApi from '../hooks/useDetailApi';
import  formatCurrency  from '../utils/currentcy';

const Bookings = () => {
  // State cho search và filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [buildingFilter, setBuildingFilter] = useState('');
  
  // State cho cập nhật trạng thái
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  
  // State cho modal chi tiết booking
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Khởi tạo query và lấy dữ liệu
  const [query, updateQuery, resetQuery] = useQuery({
    page: 1,
    limit: 5,
    sortBy: 'createAt',
    sortOrder: 'desc',
    search: '',
    status: '',
    building: ''
  });

  // Lấy dữ liệu từ API
  const [bookings, meta, refetchBookings] = useFecthApi('room-booking/all', query, {});
  // console.log(bookings);
  
  // Hook cập nhật
  const { updateData, loading: updatingStatus, error: updateError, success: updateSuccess } = useUpdateApi();
  
  // Hook lấy chi tiết booking
  const { fetchData, data: bookingDetail, loading: loadingDetail, error: detailError } = useDetailApi();
  
  // State UI
  const [loading, setLoading] = useState(false);

  // Lấy danh sách tòa nhà từ bookings
  const uniqueBuildings = bookings && bookings.length > 0 
    ? [...new Map(
        bookings
          .filter((booking: any) => booking.room && booking.room.building)
          .map((booking: any) => [booking.room.building.id, booking.room.building])
      ).values()]
    : [];

  // Xử lý khi thay đổi trang
  const goToPage = (page: number) => {
    updateQuery({ page });
  };

  // Xử lý tìm kiếm
  const handleSearch = () => {
    updateQuery({
      page: 1,
      search: searchTerm,
      status: statusFilter,
      building: buildingFilter
    });
  };
  
  // Xử lý khi thay đổi trạng thái booking
  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      setUpdatingId(bookingId);
      const result = await updateData(`room-booking/${bookingId}/status`, { status: newStatus }, 'post');
      
      if (result) {
        toast.success(`Trạng thái booking #${bookingId} đã được cập nhật thành ${newStatus}`);
        
        // Refresh danh sách bookings bằng cách refetch
        refetchBookings();
        
        // Nếu đang xem chi tiết, cập nhật lại thông tin chi tiết sau một khoảng thời gian
        if (showBookingModal && selectedBookingId === bookingId) {
          // Đợi một chút để server cập nhật dữ liệu
          setTimeout(() => {
            fetchData(`room-booking/${selectedBookingId}`);
          }, 1000);
        }
      }
    } catch (error) {
      toast.error(`Không thể cập nhật trạng thái: ${updateError}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Hiển thị thông báo nếu có lỗi khi cập nhật
  useEffect(() => {
    if (updateError) {
      toast.error(`Lỗi: ${updateError}`);
    }
  }, [updateError]);

  // Hiển thị thông báo khi cập nhật thành công
  useEffect(() => {
    if (updateSuccess) {
      toast.success('Cập nhật trạng thái thành công');
    }
  }, [updateSuccess]);

  // Xử lý khi nhấn vào nút xem booking
  const handleViewBooking = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    // Chỉ fetch dữ liệu khi cần
    fetchData(`room-booking/${bookingId}`);
    setShowBookingModal(true);
  };
  
  // Đóng modal
  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedBookingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
      </div>
      
      {/* Search and filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder="Search bookings..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              updateQuery({
                ...query,
                page: 1,
                status: e.target.value
              });
            }}
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select 
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={buildingFilter}
            onChange={(e) => {
              setBuildingFilter(e.target.value);
              updateQuery({
                ...query,
                page: 1,
                building: e.target.value
              });
            }}
          >
            <option value="">All Buildings</option>
            {uniqueBuildings.map((building: any) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              icon="fas fa-calendar-alt"
              onClick={handleSearch}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Bookings Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings && bookings.length > 0 ? (
                    bookings.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                          #{booking.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-left">
                              {booking.user ? booking.user.fullName.charAt(0) : '?'}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 text-left">
                                {booking.user ? booking.user.fullName : 'Unknown User'}
                              </div>
                              <div className="text-xs text-gray-500 text-left">
                                {booking.user ? booking.user.email : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                          {booking.room ? `Room ${booking.room.roomNumber}` : 'N/A'}
                          {booking.room && booking.room.building && (
                            <div className="text-xs text-gray-400">{booking.room.building.name}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                          {formatDate(booking.bookingDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                          {formatCurrency(booking.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                          {formatDate(booking.checkInDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.stayDuration ? `${booking.stayDuration} ngày` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {updatingId === booking.id ? (
                            <div className="flex items-center">
                              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-primary-600 rounded-full"></div>
                              <span>Updating...</span>
                            </div>
                          ) : (
                            booking.status === 'pending' ? (
                              <select 
                                className="px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                value={booking.status}
                                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                style={{
                                  backgroundColor: '#FEF9C3', 
                                  color: '#854D0E'
                                }}
                              >
                                <option value="pending" style={{backgroundColor: '#FEF9C3', color: '#854D0E'}}>Pending</option>
                                <option value="approved" style={{backgroundColor: '#DCFCE7', color: '#166534'}}>Approved</option>
                                <option value="rejected" style={{backgroundColor: '#FEE2E2', color: '#991B1B'}}>Rejected</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                <i className={`mr-1 fas ${
                                  booking.status === 'approved' ? 'fa-check-circle' :
                                  booking.status === 'rejected' ? 'fa-times-circle' :
                                  'fa-info-circle'
                                }`}></i>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            )
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3" onClick={() => handleViewBooking(booking.id)}>
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        Không tìm thấy đặt phòng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {(!bookings || bookings.length === 0) && !loading && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <i className="fas fa-calendar-alt text-gray-300 text-5xl"></i>
                <p className="mt-4 text-gray-500 text-lg">No bookings found</p>
                <p className="text-gray-400">Try adjusting your filters</p>
              </div>
            )}
          </>
        )}
      </Card>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{bookings ? bookings.length : 0}</span> of <span className="font-medium">{meta?.total || 0}</span> bookings
        </div>
        
        <Pagination 
          totalItems={meta?.total || 0}
          currentPage={meta?.pageNumber || query.page}
          onPageChange={goToPage}
          itemsPerPage={meta?.limitNumber || query.limit}
        />
      </div>
      
      {/* Booking Detail Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-11/12 md:w-3/4 lg:w-3/5 max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="border-b px-6 py-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <span className="bg-primary-100 text-primary-700 p-2 rounded-full mr-3">
                  <i className="fas fa-calendar-check"></i>
                </span>
                Chi tiết đặt phòng #{selectedBookingId}
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-all"
                onClick={closeModal}
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <div className="px-6 py-4">
              {loadingDetail ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : detailError ? (
                <div className="text-center py-10 text-red-500 bg-red-50 rounded-lg border border-red-100">
                  <i className="fas fa-exclamation-circle text-3xl mb-2"></i>
                  <p>Có lỗi xảy ra khi tải thông tin: {detailError}</p>
                </div>
              ) : bookingDetail ? (
                <div className="space-y-6">
                  {/* Thông tin người đặt */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                      <h4 className="font-medium text-blue-700 flex items-center">
                        <i className="fas fa-user mr-2"></i>
                        Thông tin người đặt
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 mb-1">Họ tên</p>
                          <p className="font-medium text-gray-800 flex items-center justify-center">
                            <span className="text-center h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-2">
                              {bookingDetail.user?.fullName?.charAt(0) || '?'}
                            </span>
                            {bookingDetail.user?.fullName || 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <p className="font-medium text-gray-800">
                            <i className="fas fa-envelope text-gray-400 mr-2"></i>
                            {bookingDetail.user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Thông tin phòng */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-green-50 px-4 py-3 border-b border-green-100">
                      <h4 className="font-medium text-green-700 flex items-center">
                        <i className="fas fa-home mr-2"></i>
                        Thông tin phòng
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 mb-1">Số phòng</p>
                          <p className="font-medium text-gray-800">
                            <i className="fas fa-door-open text-gray-400 mr-2"></i>
                            {bookingDetail.room?.roomNumber || 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 mb-1">Tòa nhà</p>
                          <p className="font-medium text-gray-800">
                            <i className="fas fa-building text-gray-400 mr-2"></i>
                            {bookingDetail.room?.building?.name || 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 mb-1">Loại phòng</p>
                          <p className="font-medium text-gray-800">
                            <i className="fas fa-tag text-gray-400 mr-2"></i>
                            {bookingDetail.room?.roomType?.name || 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 mb-1">Giá</p>
                          <p className="font-medium text-gray-800">
                            <i className="fas fa-money-bill-wave text-gray-400 mr-2"></i>
                            {bookingDetail.room?.price ? `${formatCurrency(bookingDetail.room.price)}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Thông tin đặt phòng */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-100">
                      <h4 className="font-medium text-yellow-700 flex items-center">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        Thông tin đặt phòng
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 mb-1">Ngày đặt</p>
                          <p className="font-medium text-gray-800">
                            <i className="fas fa-calendar-day text-gray-400 mr-2"></i>
                            {formatDate(bookingDetail.bookingDate)}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 mb-1">Ngày check-in</p>
                          <p className="font-medium text-gray-800">
                            <i className="fas fa-calendar-check text-gray-400 mr-2"></i>
                            {formatDate(bookingDetail.checkInDate)}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-500 mb-1">Thời gian lưu trú</p>
                          <p className="font-medium text-gray-800">
                            <i className="fas fa-clock text-gray-400 mr-2"></i>
                            {bookingDetail.stayDuration ? `${bookingDetail.stayDuration} ngày` : 'N/A'}
                          </p>
                        </div>
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                          <p className={`font-medium items-center px-3 py-1 text-sm rounded-full w-[25%] flex justify-center ${
                            bookingDetail.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            bookingDetail.status === 'approved' ? 'bg-green-100 text-green-800' :
                            bookingDetail.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            <i className={`mr-1 fas ${
                              bookingDetail.status === 'pending' ? 'fa-clock' :
                              bookingDetail.status === 'approved' ? 'fa-check-circle' :
                              bookingDetail.status === 'rejected' ? 'fa-times-circle' : 'fa-info-circle'
                            }`}></i>
                            {bookingDetail.status && bookingDetail.status.charAt(0).toUpperCase() + bookingDetail.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ghi chú */}
                  {bookingDetail.note && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
                        <h4 className="font-medium text-purple-700 flex items-center">
                          <i className="fas fa-sticky-note mr-2"></i>
                          Ghi chú
                        </h4>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-700 italic">"{bookingDetail.note}"</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Cập nhật trạng thái - chỉ hiển thị cho booking ở trạng thái pending */}
                  {bookingDetail.status === 'pending' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100">
                        <h4 className="font-medium text-indigo-700 flex items-center">
                          <i className="fas fa-edit mr-2"></i>
                          Cập nhật trạng thái
                        </h4>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center space-x-4">
                          <select 
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 w-full md:w-1/3"
                            value={bookingDetail.status || ''}
                            onChange={(e) => {
                              document.getElementById('statusSelect')?.setAttribute('data-value', e.target.value);
                            }}
                            id="statusSelect"
                            data-value={bookingDetail.status || ''}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                          
                          {updatingId === selectedBookingId ? (
                            <div className="flex items-center bg-blue-50 px-4 py-2 rounded-md text-blue-700">
                              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
                              <span>Đang cập nhật...</span>
                            </div>
                          ) : (
                            <button 
                              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
                              onClick={() => {
                                if (selectedBookingId) {
                                  const newStatus = document.getElementById('statusSelect')?.getAttribute('data-value') || 'pending';
                                  handleStatusChange(selectedBookingId, newStatus);
                                }
                              }}
                            >
                              <i className="fas fa-save mr-2"></i>
                              Cập nhật trạng thái
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Thông báo nếu không phải trạng thái pending */}
                  {bookingDetail.status !== 'pending' && (
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
                      <i className="fas fa-lock text-gray-400 text-2xl mb-2"></i>
                      <p className="text-gray-600">Booking đã được {bookingDetail.status === 'approved' ? 'chấp nhận' : 'từ chối'} và không thể thay đổi trạng thái.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                  <i className="fas fa-search text-gray-300 text-5xl mb-4"></i>
                  <p className="text-gray-500 text-lg">Không tìm thấy thông tin đặt phòng</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors flex items-center"
                onClick={closeModal}
              >
                <i className="fas fa-times mr-2"></i>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings; 