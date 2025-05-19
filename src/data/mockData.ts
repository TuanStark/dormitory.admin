// Enums
export const RoleTypes = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  USER: 'USER',
} as const;

export type RoleType = typeof RoleTypes[keyof typeof RoleTypes];

export const RoomStatus = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  RESERVED: 'reserved',
} as const;

export type RoomStatusType = typeof RoomStatus[keyof typeof RoomStatus];

export const BookingStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];

export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  PAYPAL: 'paypal',
} as const;

export type PaymentMethodType = typeof PaymentMethod[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export type PaymentStatusType = typeof PaymentStatus[keyof typeof PaymentStatus];

export const ReportStatus = {
  UNRESOLVED: 'unresolved',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
} as const;

export type ReportStatusType = typeof ReportStatus[keyof typeof ReportStatus];

export const ReportType = {
  MAINTENANCE: 'maintenance',
  COMPLAINT: 'complaint',
  REQUEST: 'request',
  FEEDBACK: 'feedback',
} as const;

export type ReportTypeType = typeof ReportType[keyof typeof ReportType];

export const ReviewStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ReviewStatusType = typeof ReviewStatus[keyof typeof ReviewStatus];

export const Gender = {
  MALE: 'male',
  FEMALE: 'female',
  ANY: 'any',
} as const;

export type GenderType = typeof Gender[keyof typeof Gender];

// Interface definitions
export interface Role {
  id: number;
  name: RoleType;
  description: string;
}

export interface University {
  id: number;
  name: string;
  shortName: string;
  location: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  roleId: number;
  universityId: number;
  phone: string;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: number;
  name: string;
  address: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  floors: number;
  averageRating: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: number;
  roomNumber: string;
  buildingId: number;
  floor: number;
  capacity: number;
  gender: GenderType;
  price: number;
  status: RoomStatusType;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

// Add new interfaces and data for reports and bookings
export interface Report {
  id: number;
  roomId: number;
  userId: number;
  content: string;
  reportDate: string;
  status: ReportStatusType;
  type: ReportTypeType;
  resolvedDate?: string;
  resolvedBy?: number;
}

export interface RoomBooking {
  id: number;
  roomId: number;
  userId: number;
  startDate: string;
  endDate: string;
  bookingDate: string;
  checkInDate: string;
  status: BookingStatusType;
  paymentStatus: PaymentStatusType;
  paymentMethod?: PaymentMethodType;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Add new interface for reviews
export interface Review {
  id: number;
  userId: number;
  roomId: number;
  rating: number;
  content: string;
  reviewDate: string;
  status: ReviewStatusType;
}

// Mock data
export const roles: Role[] = [
  { id: 1, name: RoleTypes.ADMIN, description: 'Administrator with full access' },
  { id: 2, name: RoleTypes.MANAGER, description: 'Building manager with limited access' },
  { id: 3, name: RoleTypes.USER, description: 'Regular user of the system' },
];

export const universities: University[] = [
  { id: 1, name: 'University of California, Berkeley', shortName: 'UC Berkeley', location: 'Berkeley, CA' },
  { id: 2, name: 'Stanford University', shortName: 'Stanford', location: 'Stanford, CA' },
  { id: 3, name: 'Massachusetts Institute of Technology', shortName: 'MIT', location: 'Cambridge, MA' },
  { id: 4, name: 'Harvard University', shortName: 'Harvard', location: 'Cambridge, MA' },
  { id: 5, name: 'California Institute of Technology', shortName: 'Caltech', location: 'Pasadena, CA' },
];

export const users: User[] = [
  {
    id: 1,
    fullName: 'John Admin',
    email: 'admin@example.com',
    password: 'password123',
    roleId: 1,
    universityId: 1,
    phone: '+1-555-123-4567',
    address: '123 Admin St, Berkeley, CA',
    status: 'active',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    fullName: 'Jane Manager',
    email: 'manager@example.com',
    password: 'password123',
    roleId: 2,
    universityId: 1,
    phone: '+1-555-765-4321',
    address: '456 Manager Ave, Berkeley, CA',
    status: 'active',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    fullName: 'Bob Smith',
    email: 'bob@example.com',
    password: 'password123',
    roleId: 3,
    universityId: 1,
    phone: '+1-555-987-6543',
    address: '789 User Blvd, Berkeley, CA',
    status: 'active',
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    roleId: 3,
    universityId: 2,
    phone: '+1-555-456-7890',
    address: '101 Student Dr, Stanford, CA',
    status: 'active',
    createdAt: '2023-01-04T00:00:00.000Z',
    updatedAt: '2023-01-04T00:00:00.000Z',
  },
  {
    id: 5,
    fullName: 'Charlie Brown',
    email: 'charlie@example.com',
    password: 'password123',
    roleId: 3,
    universityId: 3,
    phone: '+1-555-321-0987',
    address: '202 Resident St, Cambridge, MA',
    status: 'inactive',
    createdAt: '2023-01-05T00:00:00.000Z',
    updatedAt: '2023-01-05T00:00:00.000Z',
  },
];

export const buildings: Building[] = [
  {
    id: 1,
    name: 'Berkeley Heights',
    address: '1000 University Ave, Berkeley, CA 94720',
    description: 'Modern dormitory near the main campus with excellent amenities.',
    image: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664',
    latitude: 37.8719,
    longitude: -122.2585,
    floors: 5,
    averageRating: 4.2,
    fiveStar: 15,
    fourStar: 20,
    threeStar: 10,
    twoStar: 3,
    oneStar: 2,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Stanford Towers',
    address: '450 Serra Mall, Stanford, CA 94305',
    description: 'Luxury dormitory in the heart of Stanford with premium facilities.',
    image: 'https://images.unsplash.com/photo-1520277739336-7bf67edfa768',
    latitude: 37.4275,
    longitude: -122.1697,
    floors: 8,
    averageRating: 4.5,
    fiveStar: 25,
    fourStar: 15,
    threeStar: 5,
    twoStar: 2,
    oneStar: 1,
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'MIT Commons',
    address: '77 Massachusetts Ave, Cambridge, MA 02139',
    description: 'Contemporary dormitory designed for tech-savvy students.',
    image: 'https://images.unsplash.com/photo-1585129777188-9c543a592c8a',
    latitude: 42.3601,
    longitude: -71.0942,
    floors: 6,
    averageRating: 4.0,
    fiveStar: 12,
    fourStar: 18,
    threeStar: 10,
    twoStar: 5,
    oneStar: 3,
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z',
  },
  {
    id: 4,
    name: 'Harvard Square Residence',
    address: 'Harvard Square, Cambridge, MA 02138',
    description: 'Historic dormitory with modern renovations in Harvard Square.',
    image: 'https://images.unsplash.com/photo-1567068400333-5e90dcbbaef0',
    latitude: 42.3740,
    longitude: -71.1186,
    floors: 4,
    averageRating: 4.3,
    fiveStar: 18,
    fourStar: 15,
    threeStar: 7,
    twoStar: 2,
    oneStar: 1,
    createdAt: '2023-01-04T00:00:00.000Z',
    updatedAt: '2023-01-04T00:00:00.000Z',
  },
  {
    id: 5,
    name: 'Caltech Residences',
    address: '1200 E California Blvd, Pasadena, CA 91125',
    description: 'Eco-friendly dormitory with smart home features.',
    image: 'https://images.unsplash.com/photo-1486304873000-235643847519',
    latitude: 34.1377,
    longitude: -118.1253,
    floors: 3,
    averageRating: 4.1,
    fiveStar: 10,
    fourStar: 20,
    threeStar: 8,
    twoStar: 2,
    oneStar: 0,
    createdAt: '2023-01-05T00:00:00.000Z',
    updatedAt: '2023-01-05T00:00:00.000Z',
  },
];

export const rooms: Room[] = [
  {
    id: 1,
    roomNumber: '101',
    buildingId: 1,
    floor: 1,
    capacity: 2,
    gender: Gender.MALE,
    price: 1200,
    status: RoomStatus.AVAILABLE,
    description: 'Spacious double room with a view of the campus.',
    createdAt: '2023-01-01T00:00:00.000Z',
  }
];

// Add sample data for reports
export const reports: Report[] = [
  {
    id: 1,
    roomId: 1,
    userId: 3,
    content: "Leaking faucet in the bathroom",
    reportDate: "2023-05-10T08:30:00.000Z",
    status: ReportStatus.RESOLVED,
    type: ReportType.MAINTENANCE,
    resolvedDate: "2023-05-11T14:20:00.000Z",
    resolvedBy: 2
  },
  {
    id: 2,
    roomId: 3,
    userId: 4,
    content: "Air conditioning not working properly",
    reportDate: "2023-05-12T10:15:00.000Z",
    status: ReportStatus.IN_PROGRESS,
    type: ReportType.MAINTENANCE
  },
  {
    id: 3,
    roomId: 2,
    userId: 5,
    content: "Noise complaint from neighboring room",
    reportDate: "2023-05-13T22:45:00.000Z",
    status: ReportStatus.UNRESOLVED,
    type: ReportType.COMPLAINT
  },
  {
    id: 4,
    roomId: 4,
    userId: 3,
    content: "Request for additional furniture",
    reportDate: "2023-05-14T09:20:00.000Z",
    status: ReportStatus.UNRESOLVED,
    type: ReportType.REQUEST
  },
  {
    id: 5,
    roomId: 5,
    userId: 4,
    content: "Feedback on recent renovations",
    reportDate: "2023-05-15T16:30:00.000Z",
    status: ReportStatus.RESOLVED,
    type: ReportType.FEEDBACK,
    resolvedDate: "2023-05-16T11:10:00.000Z",
    resolvedBy: 1
  }
];

// Add sample data for room bookings
export const roomBookings: RoomBooking[] = [
  {
    id: 1,
    roomId: 1,
    userId: 3,
    startDate: "2023-06-01T00:00:00.000Z",
    endDate: "2023-12-31T00:00:00.000Z",
    bookingDate: "2023-05-15T10:30:00.000Z",
    checkInDate: "2023-06-01T00:00:00.000Z",
    status: BookingStatus.APPROVED,
    paymentStatus: PaymentStatus.COMPLETED,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    totalAmount: 7200,
    createdAt: "2023-05-15T10:30:00.000Z",
    updatedAt: "2023-05-15T14:20:00.000Z"
  },
  {
    id: 2,
    roomId: 2,
    userId: 4,
    startDate: "2023-06-15T00:00:00.000Z",
    endDate: "2023-12-15T00:00:00.000Z",
    bookingDate: "2023-05-20T09:15:00.000Z",
    checkInDate: "2023-06-15T00:00:00.000Z",
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    totalAmount: 9000,
    createdAt: "2023-05-20T09:15:00.000Z",
    updatedAt: "2023-05-20T09:15:00.000Z"
  },
  {
    id: 3,
    roomId: 3,
    userId: 5,
    startDate: "2023-07-01T00:00:00.000Z",
    endDate: "2024-01-31T00:00:00.000Z",
    bookingDate: "2023-05-25T14:45:00.000Z",
    checkInDate: "2023-07-01T00:00:00.000Z",
    status: BookingStatus.APPROVED,
    paymentStatus: PaymentStatus.COMPLETED,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    totalAmount: 6000,
    createdAt: "2023-05-25T14:45:00.000Z",
    updatedAt: "2023-05-26T10:30:00.000Z"
  },
  {
    id: 4,
    roomId: 4,
    userId: 3,
    startDate: "2023-08-01T00:00:00.000Z",
    endDate: "2024-02-29T00:00:00.000Z",
    bookingDate: "2023-05-30T11:20:00.000Z",
    checkInDate: "2023-08-01T00:00:00.000Z",
    status: BookingStatus.REJECTED,
    paymentStatus: PaymentStatus.FAILED,
    totalAmount: 10800,
    createdAt: "2023-05-30T11:20:00.000Z",
    updatedAt: "2023-05-31T09:10:00.000Z"
  },
  {
    id: 5,
    roomId: 5,
    userId: 4,
    startDate: "2023-09-01T00:00:00.000Z",
    endDate: "2024-03-31T00:00:00.000Z",
    bookingDate: "2023-06-05T16:30:00.000Z",
    checkInDate: "2023-09-01T00:00:00.000Z",
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.PENDING,
    totalAmount: 11400,
    createdAt: "2023-06-05T16:30:00.000Z",
    updatedAt: "2023-06-05T16:30:00.000Z"
  }
];

// Add sample data for reviews
export const reviews: Review[] = [
  {
    id: 1,
    userId: 3,
    roomId: 1,
    rating: 5,
    content: "Excellent room with a great view. Very spacious and clean.",
    reviewDate: "2023-04-15T14:30:00.000Z",
    status: ReviewStatus.APPROVED
  },
  {
    id: 2,
    userId: 4,
    roomId: 2,
    rating: 4,
    content: "Nice room, good amenities, but a bit noisy from the street.",
    reviewDate: "2023-04-20T09:45:00.000Z",
    status: ReviewStatus.APPROVED
  },
  {
    id: 3,
    userId: 5,
    roomId: 3,
    rating: 3,
    content: "Average room, could use some maintenance.",
    reviewDate: "2023-04-25T16:20:00.000Z",
    status: ReviewStatus.APPROVED
  },
  {
    id: 4,
    userId: 3,
    roomId: 4,
    rating: 5,
    content: "Fantastic room with modern amenities. Highly recommended!",
    reviewDate: "2023-05-01T11:10:00.000Z",
    status: ReviewStatus.APPROVED
  },
  {
    id: 5,
    userId: 4,
    roomId: 5,
    rating: 4,
    content: "Good room, comfortable and well-maintained.",
    reviewDate: "2023-05-05T13:40:00.000Z",
    status: ReviewStatus.APPROVED
  },
  {
    id: 6,
    userId: 5,
    roomId: 1,
    rating: 4,
    content: "Spacious and comfortable, but the bathroom could be cleaner.",
    reviewDate: "2023-05-10T10:30:00.000Z",
    status: ReviewStatus.PENDING
  },
  {
    id: 7,
    userId: 3,
    roomId: 2,
    rating: 2,
    content: "Too small for the price, and the neighbors are noisy.",
    reviewDate: "2023-05-15T15:20:00.000Z",
    status: ReviewStatus.REJECTED
  }
]; 