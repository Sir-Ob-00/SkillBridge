import { apiClient } from './api/client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse, User } from '@app-types/index';

export const userService = {
  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>(
      API_ROUTES.USERS.ME
    );
    return data.data;
  },

  updateProfile: async (payload: Partial<Pick<User, 'name' | 'phone'>>) => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      API_ROUTES.USERS.UPDATE_PROFILE,
      payload
    );
    return data.data;
  },

  uploadAvatar: async (uri: string) => {
    console.log('[userService] uploadAvatar called', { uri });
    const formData = new FormData();
    formData.append('avatar', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    console.log('[userService] FormData prepared', {
      uri,
      field: 'avatar',
      type: 'image/jpeg',
      name: 'upload.jpg',
      route: API_ROUTES.USERS.AVATAR,
    });
    const { data } = await apiClient.post<ApiResponse<User>>(
      API_ROUTES.USERS.AVATAR,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    console.log('[userService] uploadAvatar success', data);
    return data.data;
  },
};
