import { create } from 'zustand';
import { Booking, BookingStatus } from '@types/index';
import {
  bookingApi,
  BookingListParams,
  CreateBookingPayload,
} from '@services/api/booking.api';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;

  fetchBookings: (params?: BookingListParams) => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (payload: CreateBookingPayload) => Promise<Booking>;
  updateStatus: (id: string, status: BookingStatus) => Promise<void>;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  page: 1,
  totalPages: 1,

  fetchBookings: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await bookingApi.list(params);
      set({
        bookings: result.items,
        page: result.page,
        totalPages: result.totalPages,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load bookings.' });
    }
  },

  fetchBookingById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingApi.getById(id);
      set({ selectedBooking: booking, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load booking.' });
    }
  },

  createBooking: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingApi.create(payload);
      set((state) => ({
        bookings: [booking, ...state.bookings],
        isLoading: false,
      }));
      return booking;
    } catch (err) {
      set({ isLoading: false, error: 'Failed to create booking.' });
      throw err;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const updated = await bookingApi.updateStatus(id, status);
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? updated : b)),
        selectedBooking:
          get().selectedBooking?.id === id ? updated : get().selectedBooking,
      }));
    } catch (err) {
      set({ error: 'Failed to update booking status.' });
      throw err;
    }
  },

  reset: () =>
    set({ bookings: [], selectedBooking: null, error: null, page: 1, totalPages: 1 }),
}));
