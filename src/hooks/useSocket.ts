import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socketClient } from '@services/socket/socketClient';
import { useAuthStore, selectIsAuthenticated } from '@store/auth.store';

export const useSocket = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!isAuthenticated) {
      socketClient.disconnect();
      setIsConnected(false);
      return;
    }

    const connect = async () => {
      const socket = await socketClient.connect();
      if (cancelled) return;

      socketRef.current = socket;
      setIsConnected(socket.connected);

      socket.on('connect', () => setIsConnected(true));
      socket.on('disconnect', () => setIsConnected(false));
    };

    void connect();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  return { socket: socketRef.current, isConnected };
};
