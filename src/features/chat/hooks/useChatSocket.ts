import { useEffect } from 'react';
import { socketClient } from '@services/socket/socketClient';
import { SOCKET_EVENTS } from '@services/socket/events';
import { useChatStore } from '@store/chat.store';
import { Message } from '@app-types/index';

export const useChatSocket = () => {
  const addReceivedMessage = useChatStore((s) => s.addReceivedMessage);
  const fetchChats = useChatStore((s) => s.fetchChats);

  useEffect(() => {
    const socket = socketClient.getSocket();
    if (!socket) return;

    const onReceiveMessage = (message: Message) => {
      addReceivedMessage(message.chatId, message);
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, onReceiveMessage);

    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, onReceiveMessage);
    };
  }, [addReceivedMessage, fetchChats]);
};
