import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Platform,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../hooks/useChat';
import { useChatStore } from '@store/chat.store';
import { Message as StoreMessage } from '@app-types/index';
import { useAuthStore } from '@store/auth.store';
import { ChatStackParamList } from '../chat.types';
import { Message } from '../types';
import ChatHeader from '../components/chat/ChatHeader';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import TypingIndicator from '../components/chat/TypingIndicator';
import ChatEmptyState from '../components/chat/ChatEmptyState';
import ReportModal from '../components/chat/ReportModal';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatRoom'>;

const mapMessage = (m: StoreMessage, chatId: string): Message => ({
  messageId: m.id,
  chatId,
  senderId: m.senderId,
  text: m.text,
  createdAt: m.createdAt,
  status: m.status ?? 'sent',
});

export const ChatScreen: React.FC<Props> = ({ route, navigation }) => {
  const { chatId, otherUserName: routeUserName, targetUserId: routeTargetUserId } = route.params;
  const currentUserId = useAuthStore((state) => state.user?.id ?? '');
  const { messages, sendMessage, isOtherTyping, setTyping } = useChat(chatId);
  const messagesLoading = useChatStore(
    (s) => s.messagesLoading[chatId] ?? false,
  );
  const hasMore = useChatStore((s) => s.hasMoreMessages[chatId] ?? false);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const markAsRead = useChatStore((s) => s.markAsRead);
  const chats = useChatStore((s) => s.chats);
  const [reportVisible, setReportVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const listRef = useRef<FlatList<Message>>(null);
  const pageRef = useRef(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isNearBottomRef = useRef(true);

  const chat = chats.find((c) => c.id === chatId);

  const otherUserName = chat?.otherUser.name ?? routeUserName;
  const targetUserId = chat?.otherUser.id ?? routeTargetUserId ?? '';

  const items = useMemo(
    () => messages.map((m) => mapMessage(m, chatId)),
    [messages, chatId],
  );

  const prevCountRef = useRef(items.length);

  useEffect(() => {
    if (items.length > prevCountRef.current && isNearBottomRef.current) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
    prevCountRef.current = items.length;
  }, [items.length]);

  useEffect(() => {
    void markAsRead(chatId);
  }, [chatId, markAsRead]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    pageRef.current += 1;
    await fetchMessages(chatId, pageRef.current);
    setIsLoadingMore(false);
  }, [chatId, fetchMessages, hasMore, isLoadingMore]);

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text);
    },
    [sendMessage],
  );

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      setTyping(isTyping);
    },
    [setTyping],
  );

  const handleScroll = useCallback(
    (e: {
      nativeEvent: {
        contentOffset: { y: number };
        contentSize: { height: number };
        layoutMeasurement: { height: number };
      };
    }) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const distanceFromBottom =
        contentSize.height - contentOffset.y - layoutMeasurement.height;
      isNearBottomRef.current = distanceFromBottom < 60;
    },
    [],
  );

  return (
    <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: '#f9feff' }}>
      <View className="flex-1">
        <ChatHeader
          name={otherUserName}
          avatarUrl={chat?.otherUser.avatarUrl}
          isOnline={false}
          onBack={() => navigation.goBack()}
          onMenu={() => setReportVisible(true)}
        />

        <View className="flex-1 px-4">
          {messagesLoading && items.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <View className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </View>
          ) : items.length === 0 ? (
            <ChatEmptyState
              title="No messages yet"
              description="Send a message to start the conversation."
            />
          ) : (
            <FlatList
              ref={listRef}
              data={items}
              keyExtractor={(item) => item.messageId}
              className="flex-1 pt-3"
              contentContainerStyle={{ paddingBottom: 12 }}
              keyboardShouldPersistTaps="handled"
              onStartReached={handleLoadMore}
              onStartReachedThreshold={0.3}
              onScroll={handleScroll}
              scrollEventThrottle={100}
              removeClippedSubviews={Platform.OS === 'android'}
              maxToRenderPerBatch={15}
              windowSize={10}
              renderItem={({ item }) => (
                <MessageBubble
                  message={item}
                  isOwnMessage={item.senderId === currentUserId}
                />
              )}
              ListFooterComponent={
                isLoadingMore ? (
                  <View className="py-3">
                    <View className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </View>

                ) : null
              }
            />
          )}
        </View>
      </View>

      {isOtherTyping ? <TypingIndicator name={otherUserName} /> : null}

      <View style={{ paddingBottom: keyboardHeight }}>
        <MessageInput onSend={handleSend} onTyping={handleTyping} />
      </View>

      <ReportModal
        visible={reportVisible}
        onClose={() => setReportVisible(false)}
        targetUserId={targetUserId}
      />
    </SafeAreaView>
  );
};
