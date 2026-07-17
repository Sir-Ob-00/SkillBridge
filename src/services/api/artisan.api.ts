import { apiClient } from './client';
import { API_ROUTES } from '@constants/apiRoutes';
import {
  ApiResponse,
  ArtisanProfile,
  PaginatedResponse,
  PortfolioItem,
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

  getMyRevenue: async () => {
    const { data } = await apiClient.get<
      ApiResponse<{ artisanId: string; totalEarned: number; completedBookings: number }>
    >(API_ROUTES.ARTISANS.REVENUE);
    return data.data;
  },

  getArtisanRevenue: async (id: string) => {
    const { data } = await apiClient.get<
      ApiResponse<{ artisanId: string; totalEarned: number; completedBookings: number }>
    >(API_ROUTES.ARTISANS.REVENUE_BY_ID(id));
    return data.data;
  },

  getPortfolio: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<PortfolioItem[]>>(
      API_ROUTES.ARTISANS.PORTFOLIO(id)
    );
    return data.data;
  },

  addPortfolioItem: async (id: string, payload: FormData) => {
    const { data } = await apiClient.post<ApiResponse<PortfolioItem>>(
      API_ROUTES.ARTISANS.PORTFOLIO(id),
      payload,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data;
  },

  removePortfolioItem: async (id: string, itemId: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      API_ROUTES.ARTISANS.PORTFOLIO_ITEM(id, itemId)
    );
    return data.data;
  },
};
