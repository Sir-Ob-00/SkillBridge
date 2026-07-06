import { ChatSummary, Message } from './types';

export const MOCK_CURRENT_USER_ID = 'user_self_001';

export const MOCK_CHATS: ChatSummary[] = [
  {
    chatId: 'chat_1',
    name: 'Sarah Johnson',
    avatarUrl: '',
    lastMessage: 'Perfect, see you tomorrow at 10am!',
    lastMessageTime: new Date(Date.now() - 2 * 60000).toISOString(),
    unreadCount: 2,
    isOnline: true,
  },
  {
    chatId: 'chat_2',
    name: 'Mike Chen',
    avatarUrl: '',
    lastMessage: 'Thanks for the quick response!',
    lastMessageTime: new Date(Date.now() - 35 * 60000).toISOString(),
    unreadCount: 0,
    isOnline: false,
  },
  {
    chatId: 'chat_3',
    name: 'Emily Davis',
    avatarUrl: '',
    lastMessage: 'Could you share your portfolio?',
    lastMessageTime: new Date(Date.now() - 3 * 3600000).toISOString(),
    unreadCount: 1,
    isOnline: true,
  },
  {
    chatId: 'chat_4',
    name: 'James Wilson',
    avatarUrl: '',
    lastMessage: 'I agree with the proposed changes.',
    lastMessageTime: new Date(Date.now() - 24 * 3600000).toISOString(),
    unreadCount: 0,
    isOnline: false,
  },
  {
    chatId: 'chat_5',
    name: 'Sophia Martinez',
    avatarUrl: '',
    lastMessage: 'Can you do plumbing work as well?',
    lastMessageTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    unreadCount: 0,
    isOnline: false,
  },
];

const baseTime = new Date();
baseTime.setMinutes(baseTime.getMinutes() - 10);

const t = (offsetMinutes: number): string => {
  const d = new Date(baseTime.getTime() + offsetMinutes * 60000);
  return d.toISOString();
};

export const MOCK_MESSAGES: Record<string, Message[]> = {
  chat_1: [
    {
      messageId: 'm1',
      chatId: 'chat_1',
      senderId: 'user_self_001',
      text: 'Hi Sarah! I can take a look at your faucet issue.',
      createdAt: t(-8),
      status: 'read',
    },
    {
      messageId: 'm2',
      chatId: 'chat_1',
      senderId: 'user_other_001',
      text: 'That would be great! It has been dripping for two days.',
      createdAt: t(-7),
      status: 'read',
    },
    {
      messageId: 'm3',
      chatId: 'chat_1',
      senderId: 'user_self_001',
      text: 'No problem. I can come by tomorrow morning around 10am.',
      createdAt: t(-5),
      status: 'read',
    },
    {
      messageId: 'm4',
      chatId: 'chat_1',
      senderId: 'user_other_001',
      text: 'Perfect, see you tomorrow at 10am!',
      createdAt: t(-2),
      status: 'delivered',
    },
    {
      messageId: 'm5',
      chatId: 'chat_1',
      senderId: 'user_self_001',
      text: 'See you then!',
      createdAt: t(-1),
      status: 'sent',
    },
  ],
  chat_2: [
    {
      messageId: 'm6',
      chatId: 'chat_2',
      senderId: 'user_other_002',
      text: 'Hey, are you available this weekend?',
      createdAt: t(-60),
      status: 'read',
    },
    {
      messageId: 'm7',
      chatId: 'chat_2',
      senderId: 'user_self_001',
      text: 'Yes, I have some slots open on Saturday afternoon.',
      createdAt: t(-50),
      status: 'read',
    },
    {
      messageId: 'm8',
      chatId: 'chat_2',
      senderId: 'user_other_002',
      text: 'Thanks for the quick response!',
      createdAt: t(-35),
      status: 'delivered',
    },
  ],
  chat_3: [
    {
      messageId: 'm9',
      chatId: 'chat_3',
      senderId: 'user_other_003',
      text: 'Hi! I saw your work on SkillBridge, looks amazing!',
      createdAt: t(-200),
      status: 'read',
    },
    {
      messageId: 'm10',
      chatId: 'chat_3',
      senderId: 'user_self_001',
      text: 'Thank you! Happy to help with whatever you need.',
      createdAt: t(-190),
      status: 'read',
    },
    {
      messageId: 'm11',
      chatId: 'chat_3',
      senderId: 'user_other_003',
      text: 'Could you share your portfolio?',
      createdAt: t(-180),
      status: 'delivered',
    },
  ],
};
