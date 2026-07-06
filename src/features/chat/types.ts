export interface ChatSummary {
  chatId: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
}

export interface Message {
  messageId: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read';
}

export interface TypingUser {
  chatId: string;
  userId: string;
  isTyping: boolean;
}
