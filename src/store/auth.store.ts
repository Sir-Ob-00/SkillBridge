import { create } from 'zustand';
import { User, UserRole } from '@app-types/index';
import { CONFIG } from '@constants/config';
import { secureStorage } from '@services/storage/secureStorage';
import { authApi } from '@features/auth/services/auth.api';
import { socketClient } from '@services/socket/socketClient';
import { setLogoutHandler as setAuthLogoutHandler } from '@features/auth/services/client';
import { setLogoutHandler as setApiLogoutHandler } from '@services/api/client';

export interface RegisterResult {
  user: { email: string; id: string };
  message: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (payload: { email: string; password: string; role?: UserRole }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role: UserRole; phone?: string }) => Promise<RegisterResult>;
  refreshAccessToken: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  initialize: async () => {
    set({ isInitializing: true });
    try {
      const [token, storedRefreshToken, cachedUser] = await Promise.all([
        secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN),
        secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN),
        secureStorage.getItem<User>(CONFIG.STORAGE_KEYS.USER),
      ]);

      if (storedRefreshToken) {
        try {
          const { accessToken, refreshToken } = await authApi.refreshToken(storedRefreshToken);
          await Promise.all([
            secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken),
            secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
          ]);
          set({ accessToken, refreshToken, user: cachedUser, isAuthenticated: true });
          return;
        } catch {
          await get().logout();
          return;
        }
      }

      if (token && cachedUser) {
        set({ accessToken: token, refreshToken: storedRefreshToken, user: cachedUser, isAuthenticated: true });
      }
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async (payload: { email: string; password: string; role?: UserRole }) => {
    set({ isLoading: true, error: null });
    try {
      const { user, accessToken, refreshToken } = await authApi.login(payload);

      if (payload.role && user.role !== payload.role) {
        throw { statusCode: 401, message: `This account is registered as a ${user.role}, not a ${payload.role}. Please sign in with the correct role.` };
      }

      await Promise.all([
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        secureStorage.setItem(CONFIG.STORAGE_KEYS.USER, user),
      ]);

      set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Invalid email or password.' });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.register(payload);
      set({ isLoading: false });
      return result;
    } catch (err) {
      set({ isLoading: false, error: 'Could not create account. Try again.' });
      throw err;
    }
  },

  refreshAccessToken: async () => {
    set({ isLoading: true, error: null });
    try {
      const storedRefreshToken = get().refreshToken || await secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const { accessToken, refreshToken } = await authApi.refreshToken(storedRefreshToken);

      await Promise.all([
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);

      set({ accessToken, refreshToken, isAuthenticated: true, isLoading: false });
    } catch (err) {
      await get().logout();
      throw err;
    }
  },

  logout: async () => {
    const storeRefreshToken = get().refreshToken;
    const storageRefreshToken = await secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    const tokenToInvalidate = storeRefreshToken || storageRefreshToken;

    try {
      if (tokenToInvalidate) {
        await authApi.logout(tokenToInvalidate);
      }
    } catch {
      // ignore network errors on logout
    }

    socketClient.disconnect();

    await Promise.all([
      secureStorage.removeSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN),
      secureStorage.removeSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN),
      secureStorage.removeItem(CONFIG.STORAGE_KEYS.USER),
    ]);

    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },

  setUser: (user) => {
    set({ user });
    if (user) {
      void secureStorage.setItem(CONFIG.STORAGE_KEYS.USER, user);
    }
  },

  clearError: () => set({ error: null }),
}));

/** Derived selector — use as `useAuthStore(selectIsAuthenticated)` */
export const selectIsAuthenticated = (state: AuthState): boolean =>
  !!state.accessToken;

setAuthLogoutHandler(() => useAuthStore.getState().logout());
setApiLogoutHandler(() => useAuthStore.getState().logout());