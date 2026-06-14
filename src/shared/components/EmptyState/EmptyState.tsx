import React from 'react';
import { Text, View } from 'react-native';
import { Inbox, LucideIcon } from 'lucide-react-native';
import { colors } from '@shared/ui/colors';
import { Button } from '@shared/components/Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Icon size={32} color={colors.primary} />
      </View>
      <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
        {title}
      </Text>
      {description ? (
        <Text className="mb-4 text-center text-sm text-gray-500">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} size="sm" />
      ) : null}
    </View>
  );
};
