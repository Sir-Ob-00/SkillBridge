import React, { useEffect } from 'react';
import { socketClient } from '@services/socket/socketClient';
import { useAuthStore, selectIsAuthenticated } from '@store/auth.store';

interface SocketProviderProps {
  children: React.ReactNode;
}

/**
 * Manages the lifecycle of the persistent Socket.IO connection based on
 * authentication state. Connects on login, disconnects on logout.
 */
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      void socketClient.connect();
    } else {
      socketClient.disconnect();
    }

    return () => {
      socketClient.disconnect();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
};
