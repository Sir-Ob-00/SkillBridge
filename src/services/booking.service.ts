import { bookingApi } from './api/booking.api';
import { CreateBookingPayload, BookingListParams } from './api/booking.api';
import { Booking, BookingStatus } from '@app-types/index';

export const bookingService = {
  create: (payload: CreateBookingPayload) => bookingApi.create(payload),

  list: (params: BookingListParams = {}) => bookingApi.list(params),

  getById: (id: string) => bookingApi.getById(id),

  updateStatus: (id: string, status: BookingStatus) =>
    bookingApi.updateStatus(id, status),
};
