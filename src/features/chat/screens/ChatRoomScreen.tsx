import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { ScreenWrapper } from '@shared/layout';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { useChat } from '../hooks/useChat';
import { chatApi } from '../services/chat.api';
import { Message } from '@app-types/index';
import { useAuthStore } from '@store/auth.store';
import { colors } from '@shared/ui/colors';
import { ChatStackParamList } from '../chat.types';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatRoom'>;

export const ChatRoomScreen: React.FC<Props> = ({ route, navigation }) => {
  const { chatId, otherUserName } = route.params;
  const currentUserId = useAuthStore((state) => state.user?.id ?? '');
  const { messages, sendMessage, isOtherTyping, setTyping } = useChat(chatId);
  const [history, setHistory] = useState<Message[]>([]);
  const listRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    chatApi
      .getMessages(chatId)
      .then((result) => setHistory(result.items))
      .catch(() => setHistory([]));
  }, [chatId]);

  const allMessages = [...history, ...messages];

  useEffect(() => {
    if (allMessages.length > 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [allMessages.length]);

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <View className="flex-row items-center border-b border-gray-100 pb-3">
        <Pressable onPress={() => navigation.goBack()} className="mr-3">
          <ArrowLeft size={24} color={colors.gray800} />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-900">{otherUserName}</Text>
      </View>

      <FlatList
        ref={listRef}
        data={allMessages}
        keyExtractor={(item) => item.id}
        className="flex-1 pt-3"
        contentContainerStyle={{ paddingBottom: 12 }}
        renderItem={({ item }) => (
          <MessageBubble message={item} isOwnMessage={item.senderId === currentUserId} />
        )}
      />

      {isOtherTyping ? (
        <Text className="mb-1 text-xs text-gray-400">{otherUserName} is typing...</Text>
      ) : null}

      <ChatInput onSend={sendMessage} onTypingChange={setTyping} />
    </ScreenWrapper>
  );
};
