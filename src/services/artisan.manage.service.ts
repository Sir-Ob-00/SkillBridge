import { apiClient } from './api/client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse, Service } from '@app-types/index';

export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export const artisanManageService = {
  createService: async (
    artisanId: string,
    payload: Omit<Service, 'id' | 'artisanId'>
  ) => {
    const { data } = await apiClient.post<ApiResponse<Service>>(
      API_ROUTES.ARTISANS.SERVICES(artisanId),
      payload
    );
    return data.data;
  },

  updateService: async (
    artisanId: string,
    serviceId: string,
    payload: Partial<Omit<Service, 'id' | 'artisanId'>>
  ) => {
    const { data } = await apiClient.patch<ApiResponse<Service>>(
      API_ROUTES.ARTISANS.SERVICE_ITEM(artisanId, serviceId),
      payload
    );
    return data.data;
  },

  deleteService: async (artisanId: string, serviceId: string) => {
    const { data } = await apiClient.delete<ApiResponse<void>>(
      API_ROUTES.ARTISANS.SERVICE_ITEM(artisanId, serviceId)
    );
    return data.data;
  },

  updateAvailability: async (
    artisanId: string,
    slots: AvailabilitySlot[]
  ) => {
    const { data } = await apiClient.put<
      ApiResponse<AvailabilitySlot[]>
    >(
      API_ROUTES.ARTISANS.AVAILABILITY(artisanId),
      { slots }
    );
    return data.data;
  },
};
