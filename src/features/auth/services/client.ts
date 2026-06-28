import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { secureStorage } from '@services/storage/secureStorage';
import { CONFIG } from '@constants/config';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse } from '@types/index';
import { logger } from '@utils/logger';

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

type RequestInterceptorConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

export const subscribeTokenRefresh = (callback: () => void) => {
  pendingRequests.push(callback);
};

export const unsubscribeTokenRefresh = () => {
  pendingRequests = [];
};

const processQueue = (error: AxiosError | null) => {
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
};

let logoutHandler: (() => Promise<void>) | null = null;

export const setLogoutHandler = (handler: () => Promise<void>) => {
  logoutHandler = handler;
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

async function attachAuthToken(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const accessToken = await secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return attachAuthToken(config);
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    return response;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as RequestInterceptorConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(async () => {
            try {
              const accessToken = await secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
              if (accessToken && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              const response = await apiClient(originalRequest);
              resolve(response);
            } catch (err) {
              reject(err);
            }
          });
        }) as Promise<AxiosResponse<ApiResponse<unknown>>>;
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          await forceLogout();
          return Promise.reject(error);
        }

        const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${CONFIG.API_BASE_URL}${API_ROUTES.AUTH.REFRESH}`,
          { refreshToken }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        await Promise.all([
          secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, newAccessToken),
          secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken),
        ]);

        processQueue(null);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        await forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

async function forceLogout(): Promise<void> {
  try {
    const refreshToken = await secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      await apiClient.post(API_ROUTES.AUTH.LOGOUT, { refreshToken });
    }
  } catch {
    // Ignore logout API errors during forced logout
  }

  await Promise.all([
    secureStorage.removeSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN),
    secureStorage.removeSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN),
    secureStorage.removeItem(CONFIG.STORAGE_KEYS.USER),
  ]);

  if (logoutHandler) {
    await logoutHandler();
  }
}

export function normalizeError(error: AxiosError<ApiResponse<unknown>>): ApiError {
  if (error.response?.data?.data) {
    const data = error.response.data.data as { message?: string };
    return {
      message: data.message || 'Something went wrong',
      statusCode: error.response.status,
      errors: error.response.data.data as Record<string, string[]> | undefined,
    };
  }

  if (error.response?.data?.message) {
    return {
      message: error.response.data.message,
      statusCode: error.response.status,
    };
  }

  if (error.message === 'Network Error') {
    return {
      message: 'Network error. Please check your connection.',
      statusCode: 0,
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
    statusCode: error.response?.status || 500,
  };
}

export { normalizeError as errorHandler };
