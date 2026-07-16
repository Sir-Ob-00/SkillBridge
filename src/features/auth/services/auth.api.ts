import { apiClient, normalizeError } from './client';
import { API_ROUTES } from '@constants/apiRoutes';
import { ApiResponse, AuthResponse, UserRole } from '@app-types/index';

export interface LoginPayload {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PasswordStrengthChecks {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  digit: boolean;
  symbol: boolean;
}

export interface PasswordStrengthResponse {
  score: number;
  strength: 'weak' | 'medium' | 'strong';
  checks: PasswordStrengthChecks;
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
    const { data } = await apiClient.post<ApiResponse<{ user: { email: string; id: string }; message: string }>>(
      API_ROUTES.AUTH.REGISTER,
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

  checkPasswordStrength: async (password: string) => {
    const { data } = await apiClient.post<ApiResponse<PasswordStrengthResponse>>(
      API_ROUTES.AUTH.PASSWORD_STRENGTH,
      { password }
    );
    return data.data;
  },
};

export { normalizeError };