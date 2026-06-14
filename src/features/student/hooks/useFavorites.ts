import { useCallback, useEffect, useState } from 'react';
import { secureStorage } from '@services/storage/secureStorage';

const FAVORITES_KEY = 'skillbridge.favorites';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    secureStorage.getItem<string[]>(FAVORITES_KEY).then((stored) => {
      setFavoriteIds(stored ?? []);
      setIsLoaded(true);
    });
  }, []);

  const toggleFavorite = useCallback((artisanId: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(artisanId)
        ? prev.filter((id) => id !== artisanId)
        : [...prev, artisanId];
      void secureStorage.setItem(FAVORITES_KEY, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (artisanId: string) => favoriteIds.includes(artisanId),
    [favoriteIds]
  );

  return { favoriteIds, isFavorite, toggleFavorite, isLoaded };
};
