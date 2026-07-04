import { create } from 'zustand';
import { Booking, BookingStatus } from '@app-types/index';
import {
  bookingApi,
  BookingListParams,
  CreateBookingPayload,
} from '@services/api/booking.api';
import { logger } from '@utils/logger';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalItems: number;
  currentFilter: BookingListParams;

  fetchBookings: (params?: BookingListParams, append?: boolean) => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (payload: CreateBookingPayload) => Promise<Booking>;
  updateStatus: (id: string, status: BookingStatus) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  page: 1,
  totalPages: 1,
  totalItems: 0,
  currentFilter: {},

  fetchBookings: async (params = {}, append = false) => {
    const merged = append ? { ...get().currentFilter, ...params } : params;
    set({ isLoading: !append, isLoadingMore: append, error: null, currentFilter: merged });
    try {
      const result = await bookingApi.list(merged);
      set((state) => ({
        bookings: append ? [...state.bookings, ...result.items] : result.items,
        page: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        isLoading: false,
        isLoadingMore: false,
      }));
    } catch (err) {
      logger.error('fetchBookings failed', err);
      set({ isLoading: false, isLoadingMore: false, error: 'Failed to load bookings.' });
    }
  },

  fetchBookingById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingApi.getById(id);
      set({ selectedBooking: booking, isLoading: false });
    } catch (err) {
      logger.error('fetchBookingById failed', err);
      set({ isLoading: false, error: 'Failed to load booking.' });
    }
  },

  createBooking: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await bookingApi.create(payload);
      await get().fetchBookings({}, false);
      return booking;
    } catch (err) {
      logger.error('createBooking failed', err);
      const message = (err as { message?: string })?.message || 'Failed to create booking.';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  updateStatus: async (id, status) => {
    try {
      const updated = await bookingApi.updateStatus(id, status);
      set({ selectedBooking: get().selectedBooking?.id === id ? updated : get().selectedBooking });
      await get().fetchBookings({}, false);
    } catch (err) {
      logger.error('updateStatus failed', err);
      set({ error: 'Failed to update booking status.' });
      throw new Error('Failed to update booking status.');
    }
  },

  loadMore: async () => {
    const { page, totalPages, isLoading, isLoadingMore } = get();
    if (isLoading || isLoadingMore || page >= totalPages) return;
    const nextPage = page + 1;
    await get().fetchBookings({ ...get().currentFilter, page: nextPage }, true);
  },

  reset: () =>
    set({
      bookings: [],
      selectedBooking: null,
      error: null,
      page: 1,
      totalPages: 1,
      totalItems: 0,
      isLoading: false,
      isLoadingMore: false,
      currentFilter: {},
    }),
}));
