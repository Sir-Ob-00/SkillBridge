import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import { ScreenWrapper } from '@shared/layout';
import { Avatar } from '@shared/components';
import { Loader } from '@shared/components/Loader';
import { EmptyState } from '@shared/components';
import { chatApi } from '../services/chat.api';
import { Chat } from '@app-types/index';
import { useAuthStore } from '@store/auth.store';
import { formatRelativeTime } from '@utils/formatDate';
import { truncate } from '@utils/helpers';
import { colors } from '@shared/ui/colors';
import { ChatStackParamList } from '../chat.types';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatList'>;

export const ChatListScreen: React.FC<Props> = ({ navigation }) => {
  const currentUserId = useAuthStore((state) => state.user?.id ?? '');
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chatApi
      .listChats()
      .then(setChats)
      .catch(() => setChats([]))
      .finally(() => setIsLoading(false));
  }, []);

  const getOtherParticipantLabel = (chat: Chat): string => {
    const otherId = chat.participantIds.find((id) => id !== currentUserId);
    return otherId ?? 'Conversation';
  };

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <Text className="mb-4 font-heading text-2xl font-bold text-gray-900">
        Messages
      </Text>

      {isLoading ? (
        <Loader label="Loading conversations..." />
      ) : chats.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No conversations yet"
          description="Messages with artisans will appear here."
        />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => {
            const label = getOtherParticipantLabel(item);
            return (
              <Pressable
                onPress={() =>
                  navigation.navigate('ChatRoom', {
                    chatId: item.id,
                    otherUserName: label,
                  })
                }
                className="mb-2 flex-row items-center rounded-2xl bg-white p-3"
              >
                <Avatar name={label} size="md" />
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-gray-900">
                      {label}
                    </Text>
                    {item.lastMessage ? (
                      <Text className="text-xs text-gray-400">
                        {formatRelativeTime(item.lastMessage.createdAt)}
                      </Text>
                    ) : null}
                  </View>
                  {item.lastMessage ? (
                    <Text className="mt-0.5 text-sm text-gray-500">
                      {truncate(item.lastMessage.text, 50)}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            );
          }}
        />
      )}
    </ScreenWrapper>
  );
};
