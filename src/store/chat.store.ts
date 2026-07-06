import { create } from 'zustand';
import { Chat, Message } from '@app-types/index';
import { chatApi } from '@features/chat/services/chat.api';
import { chatSocket } from '@features/chat/services/chat.socket';
import { getOtherUserId } from '@features/chat/utils';
import { useAuthStore } from './auth.store';

interface ChatState {
  chats: Chat[];
  chatsLoading: boolean;

  messagesByChat: Record<string, Message[]>;
  messagesLoading: Record<string, boolean>;
  hasMoreMessages: Record<string, boolean>;

  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: string, page?: number) => Promise<void>;

  sendMessage: (chatId: string, text: string) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;

  addReceivedMessage: (chatId: string, message: Message) => void;
  upsertChat: (chat: Chat) => void;
}

const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  chatsLoading: false,

  messagesByChat: {},
  messagesLoading: {},
  hasMoreMessages: {},

  fetchChats: async () => {
    set({ chatsLoading: true });
    try {
      const apiChats = await chatApi.listChats();
      const apiIds = new Set(apiChats.map((c) => c.id));
      const localOnly = get().chats.filter((c) => !apiIds.has(c.id));
      const chats = [...apiChats, ...localOnly];
      chats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      set({ chats, chatsLoading: false });
    } catch {
      set({ chatsLoading: false });
    }
  },

  fetchMessages: async (chatId, page = 1) => {
    const key = chatId;
    set((s) => ({
      messagesLoading: { ...s.messagesLoading, [key]: true },
    }));

    try {
      const result = await chatApi.getMessages(chatId, page);
      const existing = get().messagesByChat[chatId] ?? [];

      const existingIds = new Set(existing.map((m) => m.id));
      const newItems = result.items.filter((m) => !existingIds.has(m.id));

      const temps = existing.filter(
        (m) => typeof m.id === 'string' && m.id.startsWith('temp_'),
      );

      set((s) => ({
        messagesByChat: {
          ...s.messagesByChat,
          [key]: page === 1 ? [...result.items, ...temps] : [...newItems, ...existing],
        },
        hasMoreMessages: {
          ...s.hasMoreMessages,
          [key]: result.page < result.totalPages,
        },
        messagesLoading: { ...s.messagesLoading, [key]: false },
      }));
    } catch {
      set((s) => ({
        messagesLoading: { ...s.messagesLoading, [key]: false },
      }));
    }
  },

  sendMessage: async (chatId, text) => {
    const currentUserId = useAuthStore.getState().user?.id;
    if (!currentUserId) return;

    const optimisticMessage: Message = {
      id: `temp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      chatId,
      senderId: currentUserId,
      text,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };

    set((s) => ({
      messagesByChat: {
        ...s.messagesByChat,
        [chatId]: [...(s.messagesByChat[chatId] ?? []), optimisticMessage],
      },
    }));

    try {
      const receiverId = getOtherUserId(chatId, currentUserId);
      await chatSocket.sendMessage({ chatId, text, receiverId });
    } catch {
      // socket send failed — message remains as optimistic placeholder
    }
  },

  markAsRead: async (chatId) => {
    try {
      await chatApi.markAsRead(chatId);
    } catch {
      // non-critical
    }
  },

  addReceivedMessage: (chatId, message) => {
    const existing = get().messagesByChat[chatId] ?? [];
    if (existing.some((m) => m.id === message.id)) return;

    const filtered = existing.filter(
      (m) => !(typeof m.id === 'string' && m.id.startsWith('temp_') && m.senderId === message.senderId),
    );

    set((s) => ({
      messagesByChat: {
        ...s.messagesByChat,
        [chatId]: [...filtered, message],
      },
    }));

    const updatedChats = get().chats.map((c) => {
      if (c.id !== chatId) return c;
      return { ...c, lastMessage: message, updatedAt: message.createdAt };
    });
    updatedChats.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    set({ chats: updatedChats });
  },

  upsertChat: (chat) => {
    const existing = get().chats.find((c) => c.id === chat.id);
    if (existing) {
      set((s) => ({
        chats: s.chats.map((c) => (c.id === chat.id ? chat : c)),
      }));
    } else {
      set((s) => ({ chats: [chat, ...s.chats] }));
    }
  },
}));

export { useChatStore };
