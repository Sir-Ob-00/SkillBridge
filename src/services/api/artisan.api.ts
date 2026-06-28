import { apiClient } from './client';
import { API_ROUTES } from '@constants/apiRoutes';
import {
  ApiResponse,
  ArtisanProfile,
  PaginatedResponse,
  Service,
} from '@app-types/index';

export interface ArtisanSearchParams {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface AvailabilitySlot {
  day: string; // e.g. "monday"
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export const artisanApi = {
  list: async (params: ArtisanSearchParams = {}) => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<ArtisanProfile>>
    >(API_ROUTES.ARTISANS.LIST, { params });
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<ArtisanProfile>>(
      API_ROUTES.ARTISANS.BY_ID(id)
    );
    return data.data;
  },

  getServices: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Service[]>>(
      API_ROUTES.ARTISANS.SERVICES(id)
    );
    return data.data;
  },

  createService: async (id: string, payload: Omit<Service, 'id' | 'artisanId'>) => {
    const { data } = await apiClient.post<ApiResponse<Service>>(
      API_ROUTES.ARTISANS.SERVICES(id),
      payload
    );
    return data.data;
  },

  getAvailability: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<AvailabilitySlot[]>>(
      API_ROUTES.ARTISANS.AVAILABILITY(id)
    );
    return data.data;
  },

  updateAvailability: async (id: string, slots: AvailabilitySlot[]) => {
    const { data } = await apiClient.put<ApiResponse<AvailabilitySlot[]>>(
      API_ROUTES.ARTISANS.AVAILABILITY(id),
      { slots }
    );
    return data.data;
  },

  getEarnings: async () => {
    const { data } = await apiClient.get<
      ApiResponse<{ total: number; thisMonth: number; pending: number }>
    >(API_ROUTES.ARTISANS.EARNINGS);
    return data.data;
  },
};
