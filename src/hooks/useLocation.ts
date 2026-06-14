import { useCallback, useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { logger } from '@utils/logger';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  errorMsg: string | null;
  isLoading: boolean;
}

export const useLocation = (autoRequest: boolean = false) => {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    errorMsg: null,
    isLoading: false,
  });

  const requestLocation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, errorMsg: null }));

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          errorMsg: 'Location permission denied.',
        }));
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        errorMsg: null,
        isLoading: false,
      });
    } catch (error) {
      logger.error('useLocation error', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        errorMsg: 'Unable to determine location.',
      }));
    }
  }, []);

  useEffect(() => {
    if (autoRequest) {
      void requestLocation();
    }
  }, [autoRequest, requestLocation]);

  return { ...state, requestLocation };
};
