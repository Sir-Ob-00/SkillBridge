import { useEffect } from 'react';
import { useFavoritesStore } from '../store/favorites.store';

export const useFavorites = () => {
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const isLoaded = useFavoritesStore((s) => s.isLoaded);
  const hydrate = useFavoritesStore((s) => s.hydrate);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);

  useEffect(() => {
    if (!isLoaded) {
      void hydrate();
    }
  }, [isLoaded, hydrate]);

  return { favoriteIds, isFavorite, toggleFavorite, isLoaded };
};
