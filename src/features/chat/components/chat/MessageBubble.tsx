import React from 'react';
import { Text, View } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import { Message } from '../../types';
import { formatTime } from '@utils/formatDate';
import { colors } from '@shared/ui/colors';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => (
  <View
    className={[
      'mb-2 max-w-[80%] rounded-2xl px-4 py-2.5',
      isOwnMessage
        ? 'self-end bg-primary shadow-sm shadow-primary/30'
        : 'self-start border border-gray-200 bg-white shadow-sm shadow-gray-200',
    ].join(' ')}
  >
    <Text className={isOwnMessage ? 'text-white' : 'text-gray-900'} selectable>
      {message.text}
    </Text>

    <View className="mt-1 flex-row items-center justify-end gap-1">
      <Text
        className={[
          'text-[10px]',
          isOwnMessage ? 'text-white/70' : 'text-gray-400',
        ].join(' ')}
      >
        {formatTime(message.createdAt)}
      </Text>

      {isOwnMessage ? (
        message.status === 'read' ? (
          <CheckCheck size={12} color={colors.secondary} />
        ) : message.status === 'delivered' ? (
          <CheckCheck size={12} color="#ffffffb3" />
        ) : (
          <Check size={12} color="#ffffffb3" />
        )
      ) : null}
    </View>
  </View>
);

export default React.memo(MessageBubble);
