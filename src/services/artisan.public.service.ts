import { apiClient } from './api/client';
import { API_ROUTES } from '@constants/apiRoutes';
import {
  ApiResponse,
  ArtisanProfile,
  PaginatedResponse,
  PortfolioItem,
  Review,
  Service,
} from '@app-types/index';

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ArtisanSearchParams {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export const artisanPublicService = {
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

  getAvailability: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<AvailabilitySlot[]>>(
      API_ROUTES.ARTISANS.AVAILABILITY(id)
    );
    return data.data;
  },

  getReviews: async (id: string, page = 1, pageSize = 20) => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Review>>
    >(API_ROUTES.REVIEWS.LIST(id), { params: { page, pageSize } });
    return data.data;
  },

  getPortfolio: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<PortfolioItem[]>>(
      API_ROUTES.ARTISANS.PORTFOLIO(id)
    );
    return data.data;
  },
};
