import React, { useEffect } from 'react';
import { socketClient } from '@services/socket/socketClient';
import { useAuthStore, selectIsAuthenticated } from '@store/auth.store';

interface SocketProviderProps {
  children: React.ReactNode;
}

/**
 * Manages the lifecycle of the persistent Socket.IO connection based on
 * authentication state. Connects on login, disconnects on logout.
 * Handles auth errors by refreshing the token and reconnecting.
 */
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    socketClient.onAuthErrorHandler(async () => {
      try {
        await useAuthStore.getState().refreshToken();
        void socketClient.connect();
      } catch {
        // refreshToken already called logout() on failure
      }
    });

    if (isAuthenticated) {
      void socketClient.connect();
    } else {
      socketClient.disconnect();
    }

    return () => {
      socketClient.onAuthErrorHandler(async () => {});
      socketClient.disconnect();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
};
