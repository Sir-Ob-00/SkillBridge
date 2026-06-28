import { create } from 'zustand';
import { User } from '@app-types/index';
import { userApi, UpdateProfilePayload } from '@services/api/user.api';
import { useAuthStore } from './auth.store';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userApi.getMe();
      set({ profile, isLoading: false });
      useAuthStore.getState().setUser(profile);
    } catch (err) {
      set({ isLoading: false, error: 'Failed to load profile.' });
    }
  },

  updateProfile: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userApi.updateProfile(payload);
      set({ profile, isLoading: false });
      useAuthStore.getState().setUser(profile);
    } catch (err) {
      set({ isLoading: false, error: 'Failed to update profile.' });
      throw err;
    }
  },

  reset: () => set({ profile: null, error: null }),
}));
