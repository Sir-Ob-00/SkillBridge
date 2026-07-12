import { io, Socket } from 'socket.io-client';
import { CONFIG } from '@constants/config';
import { secureStorage } from '@services/storage/secureStorage';
import { logger } from '@utils/logger';
import { SOCKET_EVENTS } from './events';

type AuthErrorHandler = () => Promise<void>;

class SocketClient {
  private socket: Socket | null = null;
  private onAuthError: AuthErrorHandler | null = null;

  onAuthErrorHandler(handler: AuthErrorHandler): void {
    this.onAuthError = handler;
  }

  async connect(): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.cleanup();

    const token = await secureStorage.getSecureItem(
      CONFIG.STORAGE_KEYS.ACCESS_TOKEN
    );

    if (!token) {
      logger.warn('[SocketClient] No access token available, skipping connection');
      throw new Error('No access token available');
    }

    this.socket = io(CONFIG.SOCKET_URL, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: false,
    });

    this.registerListeners();
    this.socket.connect();

    return this.socket;
  }

  async reconnect(): Promise<Socket> {
    this.cleanup();

    const token = await secureStorage.getSecureItem(
      CONFIG.STORAGE_KEYS.ACCESS_TOKEN
    );

    if (!token) {
      logger.warn('[SocketClient] No access token available for reconnect');
      throw new Error('No access token available');
    }

    this.socket = io(CONFIG.SOCKET_URL, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: false,
    });

    this.registerListeners();
    this.socket.connect();

    return this.socket;
  }

  private registerListeners(): void {
    if (!this.socket) return;

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('[SocketClient] connected', this.socket?.id);
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log('[SocketClient] disconnected', reason);
    });

    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, async (err) => {
      console.log('[SocketClient] connect_error', err.message);

      const message = err.message?.toLowerCase() ?? '';
      const isAuthError =
        message.includes('token') ||
        message.includes('unauthorized') ||
        message.includes('expired') ||
        message.includes('invalid');

      if (!isAuthError) return;

      if (this.onAuthError) {
        await this.onAuthError();
      }
    });
  }

  disconnect(): void {
    this.cleanup();
  }

  private cleanup(): void {
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
