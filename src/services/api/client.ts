import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { CONFIG } from '@constants/config';
import { secureStorage } from '@services/storage/secureStorage';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse } from '@app-types/index';
import { logger } from '@utils/logger';

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

export const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

export const unsubscribeTokenRefresh = () => {
  refreshSubscribers = [];
};

const processQueue = (error: AxiosError | null) => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
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
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(async () => {
            try {
              const accessToken = await secureStorage.getSecureItem(
                CONFIG.STORAGE_KEYS.ACCESS_TOKEN
              );
              if (accessToken && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }
              resolve(apiClient(originalRequest));
            } catch (err) {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await secureStorage.getSecureItem(
          CONFIG.STORAGE_KEYS.REFRESH_TOKEN
        );

        if (!refreshToken) {
          await forceLogout();
          return Promise.reject(error);
        }

        const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string }>>(
          `${CONFIG.API_BASE_URL}${API_ROUTES.AUTH.REFRESH}`,
          { refreshToken }
        );

        const newAccessToken: string = data.data.accessToken;
        const newRefreshToken: string | undefined = data.data.refreshToken;

        await Promise.all([
          secureStorage.setSecureItem(
            CONFIG.STORAGE_KEYS.ACCESS_TOKEN,
            newAccessToken
          ),
          ...(newRefreshToken
            ? [
                secureStorage.setSecureItem(
                  CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
                  newRefreshToken
                ),
              ]
            : []),
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
    const refreshToken = await secureStorage.getSecureItem(
      CONFIG.STORAGE_KEYS.REFRESH_TOKEN
    );
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

export function normalizeError(error: AxiosError): ApiError {
  const responseData = error.response?.data as Record<string, unknown> | undefined;

  if (responseData?.data && typeof responseData.data === 'object') {
    return {
      message:
        (responseData.data as { message?: string }).message || 'Something went wrong',
      statusCode: error.response?.status || 500,
      errors: responseData.data as Record<string, string[]>,
    };
  }

  if (typeof responseData?.message === 'string') {
    return {
      message: responseData.message as string,
      statusCode: error.response?.status || 500,
    };
  }

  if (typeof responseData?.code === 'string') {
    return {
      message: responseData.code as string,
      statusCode: error.response?.status || 500,
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
