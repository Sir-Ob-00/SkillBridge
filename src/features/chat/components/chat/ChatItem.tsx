import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Avatar } from '@shared/components';
import { ChatSummary } from '../../types';
import { formatRelativeTime } from '@utils/formatDate';
import { truncate } from '@utils/helpers';

interface ChatItemProps {
  chat: ChatSummary;
  onPress: (chatId: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, onPress }) => (
  <Pressable
    onPress={() => onPress(chat.chatId)}
    className="mb-2 flex-row items-center rounded-2xl bg-white p-3 shadow-sm shadow-gray-200 active:opacity-80"
  >
    <View className="relative">
      <Avatar name={chat.name} size="md" imageUrl={chat.avatarUrl || undefined} />
      {chat.isOnline ? (
        <View className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
      ) : null}
    </View>

    <View className="ml-3 flex-1">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-gray-900" numberOfLines={1}>
          {chat.name}
        </Text>
        <Text className="ml-2 text-xs text-gray-400">
          {formatRelativeTime(chat.lastMessageTime)}
        </Text>
      </View>

      <View className="mt-0.5 flex-row items-center justify-between">
        <Text className="flex-1 text-sm text-gray-500" numberOfLines={1}>
          {truncate(chat.lastMessage, 50)}
        </Text>
        {chat.unreadCount > 0 ? (
          <View className="ml-2 h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5">
            <Text className="text-[10px] font-bold text-white">
              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  </Pressable>
);

export default React.memo(ChatItem);
