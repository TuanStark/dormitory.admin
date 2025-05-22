export interface BuildingImage {
  id: number;
  url: string;
  description: string;
  roomId?: number;
  uploadedAt?: string;
  createAt?: string;
  updateAt?: string;
}

export interface Amenity {
  id: number;
  amenityName: string;
  description: string;
  roomId?: number;
  createAt?: string;
  updateAt?: string;
  name?: string;
}

export interface Room {
  id: number;
  buildingId: number;
  roomNumber: string;
  floor: number;
  description: string;
  capacity: number;
  currentOccupants: number;
  gender: string;
  price: string;
  status: string;
  amenities: Amenity[];
  images: BuildingImage[];
  createAt?: string;
  updateAt?: string;
}

export interface Building {
  id: number;
  name: string;
  image: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  floors: number;
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  createAt?: string;
  updateAt?: string;
  rooms: Room[];
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationData;
  statusCode: number;
  message: string;
} 

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  roleId: number;
  universityId: number;
  status: boolean;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  bookingDate: string;
  status: string;
  checkInDate: string;
  stayDuration: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}