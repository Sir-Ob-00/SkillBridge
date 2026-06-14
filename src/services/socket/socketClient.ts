import { io, Socket } from 'socket.io-client';
import { CONFIG } from '@constants/config';
import { secureStorage } from '@services/storage/secureStorage';
import { logger } from '@utils/logger';
import { SOCKET_EVENTS } from './events';

class SocketClient {
  private socket: Socket | null = null;

  async connect(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = await secureStorage.getSecureItem(
      CONFIG.STORAGE_KEYS.ACCESS_TOKEN
    );

    this.socket = io(CONFIG.SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      logger.info('Socket connected', this.socket?.id);
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      logger.warn('Socket disconnected', reason);
    });

    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
      logger.error('Socket connect error', err.message);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketClient = new SocketClient();
