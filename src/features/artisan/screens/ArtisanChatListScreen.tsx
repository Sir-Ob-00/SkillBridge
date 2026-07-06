import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Skeleton } from '@shared/components';
import { useChatStore } from '@store/chat.store';
import { colors } from '@shared/ui/colors';
import ChatItem from '@features/chat/components/chat/ChatItem';
import ChatEmptyState from '@features/chat/components/chat/ChatEmptyState';
import { ChatSummary } from '@features/chat/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Chat'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

const ChatSkeleton: React.FC = () => (
  <View className="mb-2 flex-row items-center rounded-2xl bg-white p-3">
    <View className="h-12 w-12 rounded-full bg-gray-200" />
    <View className="ml-3 flex-1 gap-1.5">
      <Skeleton width="50%" height={14} />
      <Skeleton width="80%" height={12} />
    </View>
  </View>
);

export const ArtisanChatListScreen: React.FC<Props> = ({ navigation }) => {
  const chats = useChatStore((s) => s.chats);
  const isLoading = useChatStore((s) => s.chatsLoading);
  const fetchChats = useChatStore((s) => s.fetchChats);

  useEffect(() => {
    void fetchChats();
  }, [fetchChats]);

  const [isRefreshing, setIsRefreshing] = useState(false);

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
      <View className="mb-4 px-4 pt-2">
        <Text className="font-heading text-2xl font-bold text-gray-900">
          Messages
        </Text>
      </View>

      {isLoading && items.length === 0 ? (
        <View className="px-4">
          {[1, 2, 3, 4].map((i) => (
            <ChatSkeleton key={i} />
          ))}
        </View>
      ) : items.length === 0 ? (
        <ChatEmptyState description="Your messages with students will appear here." />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.chatId}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-4 pb-6"
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
