import { apiClient } from './client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse, PaginatedResponse } from '@app-types/index';
import { ReviewWithMeta } from '@features/reviews/reviews.types';

export interface GetArtisanReviewsParams {
  page?: number;
  pageSize?: number;
}

export const reviewsApi = {
  create: async (payload: { bookingId: string; rating: number; comment: string }) => {
    const { data } = await apiClient.post<ApiResponse<ReviewWithMeta>>(
      API_ROUTES.REVIEWS.CREATE,
      payload
    );
    return data.data;
  },

  getArtisanReviews: async (
    artisanId: string,
    params: GetArtisanReviewsParams = {}
  ) => {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<ReviewWithMeta>>
    >(API_ROUTES.REVIEWS.LIST(artisanId), { params });
    return data.data;
  },
};
