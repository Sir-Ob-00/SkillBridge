import { apiClient } from './client';
import { API_ROUTES } from '@constants/apiRoutes';
import {
  ApiResponse,
  Booking,
  BookingStatus,
  PaginatedResponse,
} from '@app-types/index';

export interface CreateBookingPayload {
  artisanId: string;
  serviceId: string;
  scheduledTime: string;
  notes?: string;
}

export interface BookingListParams {
  status?: BookingStatus;
  page?: number;
  pageSize?: number;
}

export const bookingApi = {
  list: async (params: BookingListParams = {}) => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Booking>>
    >(API_ROUTES.BOOKINGS.LIST, { params });
    return data.data;
  },

  create: async (payload: CreateBookingPayload) => {
    const { data } = await apiClient.post<ApiResponse<Booking>>(
      API_ROUTES.BOOKINGS.CREATE,
      payload
    );
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Booking>>(
      API_ROUTES.BOOKINGS.BY_ID(id)
    );
    return data.data;
  },

  updateStatus: async (id: string, status: BookingStatus) => {
    const { data } = await apiClient.patch<ApiResponse<Booking>>(
      API_ROUTES.BOOKINGS.UPDATE_STATUS(id),
      { status }
    );
    return data.data;
  },
};
