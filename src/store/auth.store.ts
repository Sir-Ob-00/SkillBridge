import { create } from 'zustand';
import { User, UserRole } from '@types/index';
import { CONFIG } from '@constants/config';
import { secureStorage } from '@services/storage/secureStorage';
import { authApi, RefreshResponse } from '@features/auth/services/auth.api';
import { socketClient } from '@services/socket/socketClient';
import { setLogoutHandler as setAuthLogoutHandler } from '@features/auth/services/client';
import { setLogoutHandler as setApiLogoutHandler } from '@services/api/client';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role: UserRole; phone?: string }) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  isInitializing: true,
  error: null,

  initialize: async () => {
    set({ isInitializing: true });
    try {
      const [token, cachedUser] = await Promise.all([
        secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN),
        secureStorage.getItem<User>(CONFIG.STORAGE_KEYS.USER),
      ]);

      if (token && cachedUser) {
        set({ accessToken: token, user: cachedUser });
      }
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { user, accessToken, refreshToken } = await authApi.login(payload);

      await Promise.all([
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        secureStorage.setItem(CONFIG.STORAGE_KEYS.USER, user),
      ]);

      set({ user, accessToken, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Invalid email or password.' });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { user, accessToken, refreshToken } = await authApi.register(payload);

      await Promise.all([
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        secureStorage.setItem(CONFIG.STORAGE_KEYS.USER, user),
      ]);

      set({ user, accessToken, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Could not create account. Try again.' });
      throw err;
    }
  },

  refreshToken: async () => {
    set({ isLoading: true, error: null });
    try {
      const storedRefreshToken = await secureStorage.getSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const { accessToken, refreshToken } = await authApi.refreshToken(storedRefreshToken);

      await Promise.all([
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        secureStorage.setSecureItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);

      set({ accessToken, isLoading: false });
    } catch (err) {
      await useAuthStore.getState().logout();
      throw err;
    }
  },

  logout: async () => {
    const refreshToken = await secureStorage.getSecureItem(
      CONFIG.STORAGE_KEYS.REFRESH_TOKEN
    );

    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
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

    set({ user: null, accessToken: null });
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
