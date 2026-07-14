import { create } from 'zustand';
import { secureStorage } from '@services/storage/secureStorage';

const FAVORITES_KEY = 'skillbridge.favorites';

interface FavoritesState {
  favoriteIds: string[];
  isLoaded: boolean;
  hydrate: () => Promise<void>;
  toggleFavorite: (artisanId: string) => void;
  isFavorite: (artisanId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: [],
  isLoaded: false,

  hydrate: async () => {
    const stored = await secureStorage.getItem<string[]>(FAVORITES_KEY);
    set({ favoriteIds: stored ?? [], isLoaded: true });
  },

  toggleFavorite: (artisanId) => {
    const { favoriteIds } = get();
    const next = favoriteIds.includes(artisanId)
      ? favoriteIds.filter((id) => id !== artisanId)
      : [...favoriteIds, artisanId];
    set({ favoriteIds: next });
    void secureStorage.setItem(FAVORITES_KEY, next);
  },

  isFavorite: (artisanId) => get().favoriteIds.includes(artisanId),
}));
