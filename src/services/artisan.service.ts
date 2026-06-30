import { apiClient } from './api/client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse, ArtisanProfile, PortfolioItem } from '@app-types/index';

export const artisanService = {
  getMyProfile: async () => {
    const { data } = await apiClient.get<ApiResponse<ArtisanProfile>>(
      API_ROUTES.ARTISANS.ME_PROFILE
    );
    return data.data;
  },

  updateMyProfile: async (payload: Partial<ArtisanProfile>) => {
    const { data } = await apiClient.patch<ApiResponse<ArtisanProfile>>(
      API_ROUTES.ARTISANS.ME_PROFILE,
      payload
    );
    return data.data;
  },

  uploadProfileImage: async (uri: string) => {
    const formData = new FormData();
    formData.append('image', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    const { data } = await apiClient.post<ApiResponse<ArtisanProfile>>(
      API_ROUTES.ARTISANS.ME_PROFILE_IMAGE,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data;
  },

  getPortfolio: async (artisanId: string) => {
    const { data } = await apiClient.get<
      ApiResponse<PortfolioItem[]>
    >(API_ROUTES.ARTISANS.PORTFOLIO(artisanId));
    return data.data;
  },

  addPortfolioItem: async (
    artisanId: string,
    imageUri: string,
    title: string,
    description?: string
  ) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    formData.append('title', title);
    if (description) {
      formData.append('description', description);
    }
    const { data } = await apiClient.post<ApiResponse<PortfolioItem>>(
      API_ROUTES.ARTISANS.ME_PORTFOLIO,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.data;
  },

  removePortfolioItem: async (artisanId: string, itemId: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      API_ROUTES.ARTISANS.PORTFOLIO_ITEM(artisanId, itemId)
    );
    return data.data;
  },
};
