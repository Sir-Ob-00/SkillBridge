import React, { useEffect, useRef } from 'react';
import { socketClient } from '@services/socket/socketClient';
import { useAuthStore, selectIsAuthenticated } from '@store/auth.store';
import { useBookingSocket } from '@features/booking/hooks/useBookingSocket';
import { useChatSocket } from '@features/chat/hooks/useChatSocket';
import { setupNotificationSocketListeners } from '@modules/notifications/notifications.socket';
import { SOCKET_EVENTS } from '@services/socket/events';

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
  const wasAuthenticated = useRef(isAuthenticated);

  useBookingSocket();
  useChatSocket();

  useEffect(() => {
    socketClient.onAuthErrorHandler(async () => {
      try {
        await useAuthStore.getState().refreshAccessToken();
        void socketClient.connect();
      } catch {
        // refreshToken already called logout() on failure
      }
    });

    if (isAuthenticated) {
      void socketClient.connect();
    } else if (wasAuthenticated.current) {
      // Only disconnect when transitioning from authenticated to unauthenticated
      socketClient.disconnect();
    }
    wasAuthenticated.current = isAuthenticated;

    const socket = socketClient.getSocket();
    let cleanupNotifications: (() => void) | null = null;
    if (socket) {
      cleanupNotifications = setupNotificationSocketListeners(socket);

      const handleArtisanVerified = (payload: { id: string; applicationStatus: string }) => {
        const user = useAuthStore.getState().user;
        if (user && payload.id === user.id) {
          useAuthStore.getState().setUser({ ...user, onboardingStatus: payload.applicationStatus as any });
        }
      };

      socket.on(SOCKET_EVENTS.ARTISAN_VERIFIED, handleArtisanVerified);

      const origOff = socket.off.bind(socket);
      const cleanup = () => {
        origOff(SOCKET_EVENTS.ARTISAN_VERIFIED, handleArtisanVerified);
      };

      const origCleanup = cleanupNotifications;
      cleanupNotifications = () => {
        if (origCleanup) origCleanup();
        cleanup();
      };
    }

    return () => {
      socketClient.onAuthErrorHandler(async () => {});
      socketClient.disconnect();
      if (cleanupNotifications) cleanupNotifications();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
};
