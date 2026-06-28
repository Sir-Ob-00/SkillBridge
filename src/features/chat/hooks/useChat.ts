import { useCallback, useEffect, useRef, useState } from 'react';
import { Message } from '@app-types/index';
import { chatSocket } from '../services/chat.socket';
import { useAuthStore } from '@store/auth.store';

export const useChat = (chatId: string) => {
  const currentUserId = useAuthStore((state) => state.user?.id ?? '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let unsubscribeMessage: (() => void) | undefined;
    let unsubscribeTyping: (() => void) | undefined;

    const setup = async () => {
      await chatSocket.joinChat(chatId);

      unsubscribeMessage = chatSocket.onReceiveMessage((message) => {
        if (message.chatId === chatId) {
          setMessages((prev) => [...prev, message]);
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

    return () => {
      unsubscribeMessage?.();
      unsubscribeTyping?.();
      void chatSocket.leaveChat(chatId);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [chatId, currentUserId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      await chatSocket.sendMessage({ chatId, text, senderId: currentUserId });
    },
    [chatId, currentUserId]
  );

  const setTyping = useCallback(
    (isTyping: boolean) => {
      void chatSocket.sendTyping({ chatId, userId: currentUserId, isTyping });
    },
    [chatId, currentUserId]
  );

  return { messages, sendMessage, isOtherTyping, setTyping };
};
