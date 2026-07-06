import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '@app-types/index';
import { chatSocket } from '../services/chat.socket';
import { useAuthStore } from '@store/auth.store';
import { useChatStore } from '@store/chat.store';

export const useChat = (chatId: string) => {
  const currentUserId = useAuthStore((state) => state.user?.id ?? '');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addReceivedMessage = useChatStore((s) => s.addReceivedMessage);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const messages = useChatStore((s) => s.messagesByChat[chatId] ?? []);

  useEffect(() => {
    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeTyping: (() => void) | undefined;

    const setup = async () => {
      await chatSocket.joinChat(chatId);

      unsubscribeMessage = chatSocket.onReceiveMessage((message) => {
        if (message.chatId === chatId) {
          addReceivedMessage(chatId, message);
        }
      });

      unsubscribeTyping = chatSocket.onTyping((payload) => {
        if (payload.chatId === chatId && payload.userId !== currentUserId) {
          setIsOtherTyping(payload.isTyping);

          if (payload.isTyping) {
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(
              () => setIsOtherTyping(false),
              3000
            );
          }
        }
      });
    };

    void setup();
    void fetchMessages(chatId);

    return () => {
      unsubscribeMessage?.();
      unsubscribeTyping?.();
      void chatSocket.leaveChat(chatId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [chatId, currentUserId, addReceivedMessage, fetchMessages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      await useChatStore.getState().sendMessage(chatId, text);
    },
    [chatId]
  );

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!currentUserId) return;
      void chatSocket.sendTyping({ chatId, isTyping });
    },
    [chatId, currentUserId]
  );

  return { messages, sendMessage, isOtherTyping, setTyping };
};
