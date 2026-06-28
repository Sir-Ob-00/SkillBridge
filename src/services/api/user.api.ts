import { apiClient } from './client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse, User } from '@app-types/index';

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export const userApi = {
  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>(
      API_ROUTES.USERS.ME
    );
    return data.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      API_ROUTES.USERS.UPDATE_PROFILE,
      payload
    );
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<User>>(
      API_ROUTES.USERS.BY_ID(id)
    );
    return data.data;
  },
};
