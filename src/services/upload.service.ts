import { apiClient } from './api/client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse } from '@app-types/index';

type UploadFolder = 'skillbridge/profile' | 'skillbridge/verification' | 'skillbridge/portfolio';

export const uploadService = {
  uploadImage: async (uri: string, folder: UploadFolder = 'skillbridge/profile'): Promise<string> => {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'upload.jpg';
    const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    formData.append('image', {
      uri,
      type: mimeType,
      name: filename,
    } as any);

    const { data } = await apiClient.post<ApiResponse<{ url: string }>>(
      API_ROUTES.UPLOADS.IMAGE(folder),
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return data.data.url;
  },
};