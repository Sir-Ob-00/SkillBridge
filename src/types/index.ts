export type UserRole = 'student' | 'artisan';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface ArtisanProfile {
  id: string;
  userId: string;
  businessName: string;
  category: string;
  bio: string;
  rating: number;
  reviewCount: number;
  priceFrom: number;
  location: string;
  yearsOfExperience?: number;
  avatarUrl?: string;
  profileImageUrl?: string;
  services: Service[];
  isVerified: boolean;
  isAvailable?: boolean;
}

export interface Service {
  id: string;
  artisanId: string;
  title: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
}

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  studentId: string;
  artisanId: string;
  serviceId?: string;
  serviceTitle?: string;
  price?: number;
  status: BookingStatus;
  scheduledTime: string;
  createdAt: string;
  notes?: string;
  student?: { id: string; name: string; avatarUrl?: string };
  artisan?: { id: string; businessName: string; avatarUrl?: string };
  service?: { id: string; title: string; price: number; durationMinutes?: number };
}

export interface Review {
  id: string;
  bookingId: string;
  studentId: string;
  artisanId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface PortfolioItem {
  id: string;
  artisanId: string;
  imageUrl: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}
