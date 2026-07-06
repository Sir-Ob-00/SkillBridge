import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@shared/layout';
import { useChatStore } from '@store/chat.store';
import { colors } from '@shared/ui/colors';
import { ChatStackParamList } from '../chat.types';
import ChatItem from '../components/chat/ChatItem';
import ChatEmptyState from '../components/chat/ChatEmptyState';
import { ChatSummary } from '../types';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatList'>;

const SKELETON_KEYS = ['s1', 's2', 's3', 's4'];

const ChatSkeleton: React.FC = () => (
  <View className="mb-2 flex-row items-center rounded-2xl bg-white p-3">
    <View className="h-12 w-12 rounded-full bg-gray-200" />
    <View className="ml-3 flex-1 gap-1.5">
      <View className="h-3.5 w-1/2 rounded-md bg-gray-200" />
      <View className="h-3 w-4/5 rounded-md bg-gray-200" />
    </View>
  </View>
);

export const ChatListScreen: React.FC<Props> = ({ navigation }) => {
  const chats = useChatStore((s) => s.chats);
  const isLoading = useChatStore((s) => s.chatsLoading);
  const fetchChats = useChatStore((s) => s.fetchChats);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    void fetchChats();
  }, [fetchChats]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchChats();
    setIsRefreshing(false);
  }, [fetchChats]);

  const items = useMemo<ChatSummary[]>(
    () =>
      chats.map((chat) => ({
        chatId: chat.id,
        name: chat.otherUser.name,
        avatarUrl: chat.otherUser.avatarUrl ?? '',
        lastMessage: chat.lastMessage?.text ?? 'Start a conversation',
        lastMessageTime:
          chat.lastMessage?.createdAt ?? new Date().toISOString(),
        unreadCount: chat.unreadCount ?? 0,
      })),
    [chats],
  );

  const handlePress = useCallback(
    (chatId: string) => {
      const chat = chats.find((c) => c.id === chatId);
      const name = chat?.otherUser.name ?? 'Conversation';
      navigation.navigate('ChatRoom', { chatId, otherUserName: name });
    },
    [chats, navigation],
  );

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <Text className="mb-4 mt-2 font-heading text-2xl font-bold text-gray-900">
        Messages
      </Text>

      {isLoading && items.length === 0 ? (
        <View className="px-4">
          {SKELETON_KEYS.map((k) => (
            <ChatSkeleton key={k} />
          ))}
        </View>
      ) : items.length === 0 ? (
        <ChatEmptyState description="Messages with artisans will appear here." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.chatId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <ChatItem chat={item} onPress={handlePress} />
          )}
        />
      )}
    </ScreenWrapper>
  );
};
