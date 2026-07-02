import { BookingStatus } from '@app-types/index';

export type BookingStackParamList = {
  BookingHistory: undefined;
  BookingDetails: { bookingId: string };
  BookingStatus: { bookingId: string };
};

export interface BookingStatusConfig {
  label: string;
  bg: string;
  text: string;
}

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, BookingStatusConfig> = {
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-700' },
  accepted: { label: 'Accepted', bg: 'bg-green-100', text: 'text-green-700' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-100', text: 'text-blue-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-700' },
  completed: { label: 'Completed', bg: 'bg-gray-100', text: 'text-gray-600' },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100', text: 'text-gray-600' },
};
