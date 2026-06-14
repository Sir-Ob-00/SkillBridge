import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { CONFIG } from '@constants/config';
import { secureStorage } from '@services/storage/secureStorage';
import { API_ROUTES } from '@constants/apiRoutes';
import { logger } from '@utils/logger';

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await secureStorage.getSecureItem(
    CONFIG.STORAGE_KEYS.ACCESS_TOKEN
  );
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const refreshToken = await secureStorage.getSecureItem(
        CONFIG.STORAGE_KEYS.REFRESH_TOKEN
      );

      if (!refreshToken) {
        await secureStorage.removeSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        await secureStorage.removeSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest._retry = true;
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${CONFIG.API_BASE_URL}${API_ROUTES.AUTH.REFRESH}`,
          { refreshToken }
        );

        const newAccessToken: string = data.data.accessToken;
        const newRefreshToken: string | undefined = data.data.refreshToken;

        await secureStorage.setSecureItem(
          CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
          newAccessToken
        );
        if (newRefreshToken) {
          await secureStorage.setSecureItem(
            CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
            newRefreshToken
          );
        }

        onRefreshed(newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        logger.error('Token refresh failed', refreshError);
        await secureStorage.removeSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
        await secureStorage.removeSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
