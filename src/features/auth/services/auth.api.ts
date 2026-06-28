import { apiClient, normalizeError } from './client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse, User, UserRole } from '@app-types/index';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.AUTH.LOGIN,
      payload
    );
    return data.data;
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.AUTH.REGISTER,
      payload
    );
    return data.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      payload
    );
    return data.data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      API_ROUTES.AUTH.RESET_PASSWORD,
      payload
    );
    return data.data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await apiClient.post<ApiResponse<RefreshResponse>>(
      API_ROUTES.AUTH.REFRESH,
      { refreshToken }
    );
    return data.data;
  },

  logout: async (refreshToken: string) => {
    const { data } = await apiClient.post<ApiResponse<null>>(
      API_ROUTES.AUTH.LOGOUT,
      { refreshToken }
    );
    return data.data;
  },
};

export { normalizeError };
