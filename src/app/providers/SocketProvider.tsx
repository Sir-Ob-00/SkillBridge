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
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const accessToken = useAuthStore((state) => state.accessToken);
  const wasAuthenticated = useRef(isAuthenticated);
  const prevTokenRef = useRef(accessToken);

  useBookingSocket();
  useChatSocket();

  useEffect(() => {
    if (isInitializing) return;

    socketClient.onAuthErrorHandler(async () => {
      try {
        await useAuthStore.getState().refreshAccessToken();
      } catch {
        // refreshAccessToken already called logout() on failure
      }
    });

    if (isAuthenticated) {
      console.log('[SocketProvider] Authenticated, connecting socket...');
      void socketClient.connect().catch((err: Error) => {
        console.log('[SocketProvider] Initial connection failed:', err.message);
      });
    } else if (wasAuthenticated.current) {
      console.log('[SocketProvider] Logged out, disconnecting socket...');
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
  }, [isAuthenticated, isInitializing]);

  useEffect(() => {
    if (!isAuthenticated || isInitializing) return;

    if (prevTokenRef.current && prevTokenRef.current !== accessToken) {
      console.log('[SocketProvider] Token refreshed, reconnecting socket...');
      void socketClient.reconnect().catch((err: Error) => {
        console.log('[SocketProvider] Reconnect failed:', err.message);
      });
    }
    prevTokenRef.current = accessToken;
  }, [accessToken, isAuthenticated, isInitializing]);

  return <>{children}</>;
};
