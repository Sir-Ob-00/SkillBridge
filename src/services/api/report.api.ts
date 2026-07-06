import { apiClient } from './client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse } from '@app-types/index';

export interface CreateReportPayload {
  targetUserId: string;
  reason: string;
  details?: string;
}

export const reportApi = {
  create: async (payload: CreateReportPayload) => {
    const { data } = await apiClient.post<ApiResponse<{ id: string }>>(
      API_ROUTES.REPORTS.CREATE,
      payload
    );
    return data.data;
  },
};
