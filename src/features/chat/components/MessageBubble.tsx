import React from 'react';
import { Text, View } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import { Message } from '@types/index';
import { formatTime } from '@utils/formatDate';
import { colors } from '@shared/ui/colors';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  return (
    <View
      className={[
        'mb-2 max-w-[80%] rounded-2xl px-4 py-2.5',
        isOwnMessage ? 'self-end bg-primary' : 'self-start bg-white border border-gray-200',
      ].join(' ')}
    >
      <Text className={isOwnMessage ? 'text-white' : 'text-gray-900'}>
        {message.text}
      </Text>

      <View className="mt-1 flex-row items-center justify-end">
        <Text
          className={[
            'text-[10px]',
            isOwnMessage ? 'text-white/70' : 'text-gray-400',
          ].join(' ')}
        >
          {formatTime(message.createdAt)}
        </Text>

        {isOwnMessage ? (
          <View className="ml-1">
            {message.status === 'read' ? (
              <CheckCheck size={12} color={colors.secondary} />
            ) : (
              <Check size={12} color="#ffffffb3" />
            )}
          </View>
        ) : null}
      </View>
    </View>
  );
};
