import { socketClient } from '@services/socket/socketClient';
import { SOCKET_EVENTS } from '@services/socket/events';
import { Message } from '@app-types/index';

export interface SendMessagePayload {
  chatId: string;
  text: string;
  receiverId: string;
}

export interface TypingPayload {
  chatId: string;
  isTyping: boolean;
}

export const chatSocket = {
  async joinChat(chatId: string): Promise<void> {
    const socket = await socketClient.connect();
    socket.emit(SOCKET_EVENTS.JOIN_CHAT, { chatId });
  },

  async leaveChat(chatId: string): Promise<void> {
    const socket = socketClient.getSocket();
    socket?.emit(SOCKET_EVENTS.LEAVE_CHAT, { chatId });
  },

  async sendMessage(payload: SendMessagePayload): Promise<void> {
    const socket = await socketClient.connect();
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
  },

  async sendTyping(payload: TypingPayload): Promise<void> {
    const socket = socketClient.getSocket();
    socket?.emit(SOCKET_EVENTS.TYPING_INDICATOR, payload);
  },

  onReceiveMessage(callback: (message: Message) => void): () => void {
    const socket = socketClient.getSocket();
    socket?.on(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
    return () => socket?.off(SOCKET_EVENTS.RECEIVE_MESSAGE, callback);
  },

  onTyping(callback: (payload: TypingPayload & { userId: string }) => void): () => void {
    const socket = socketClient.getSocket();
    socket?.on(SOCKET_EVENTS.TYPING_INDICATOR, callback);
    return () => socket?.off(SOCKET_EVENTS.TYPING_INDICATOR, callback);
  },
};
