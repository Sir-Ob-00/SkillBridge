import React from 'react';
import { Text, View } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';

interface ChatEmptyStateProps {
  title?: string;
  description?: string;
}

const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  title = 'No conversations yet',
  description = 'Start a conversation by messaging an artisan or student.',
}) => (
  <View className="flex-1 items-center justify-center px-8">
    <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
      <MessageCircle size={32} color={colors.primary} />
    </View>
    <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
      {title}
    </Text>
    <Text className="text-center text-sm text-gray-500">{description}</Text>
  </View>
);

export default React.memo(ChatEmptyState);
