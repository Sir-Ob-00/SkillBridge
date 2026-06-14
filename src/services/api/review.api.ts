import { apiClient } from './client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse, PaginatedResponse, Review } from '@types/index';

export interface CreateReviewPayload {
  bookingId: string;
  artisanId: string;
  rating: number;
  comment: string;
}

export const reviewApi = {
  list: async (artisanId: string, page = 1, pageSize = 20) => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Review>>
    >(API_ROUTES.REVIEWS.LIST(artisanId), { params: { page, pageSize } });
    return data.data;
  },

  create: async (payload: CreateReviewPayload) => {
    const { data } = await apiClient.post<ApiResponse<Review>>(
      API_ROUTES.REVIEWS.CREATE,
      payload
    );
    return data.data;
  },
};
