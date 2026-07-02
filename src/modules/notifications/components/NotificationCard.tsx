import React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  Bell,
  Briefcase,
  MessageCircle,
} from 'lucide-react-native';
import { AppNotification } from '../notifications.types';
import { colors } from '@shared/ui/colors';

const ICON_MAP = {
  booking: Briefcase,
  system: Bell,
  chat: MessageCircle,
};

const BG_MAP = {
  booking: 'bg-primary/10',
  system: 'bg-yellow-100',
  chat: 'bg-blue-100',
};

const COLOR_MAP = {
  booking: colors.primary,
  system: '#d97706',
  chat: '#2563eb',
};

interface NotificationCardProps {
  notification: AppNotification;
  onPress: () => void;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  if (diffMs < 0) return 'just now';

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  const IconComponent = ICON_MAP[notification.type];
  const bgColor = BG_MAP[notification.type];
  const iconColor = COLOR_MAP[notification.type];

  return (
    <Pressable
      onPress={onPress}
      className={[
        'mb-3 flex-row rounded-3xl border p-5 shadow-sm active:scale-[0.98]',
        notification.read
          ? 'border-transparent bg-white shadow-gray-200'
          : 'border-primary/20 bg-primary/5 shadow-primary/10',
      ].join(' ')}
    >
      <View
        className={['mr-4 h-12 w-12 items-center justify-center rounded-2xl', bgColor].join(' ')}
      >
        <IconComponent size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            className={[
              'flex-1 text-base',
              notification.read ? 'font-medium text-gray-900' : 'font-bold text-gray-900',
            ].join(' ')}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          {!notification.read ? (
            <View className="ml-2 h-2.5 w-2.5 rounded-full bg-primary" />
          ) : null}
        </View>
        <Text className="mt-1 text-sm leading-5 text-gray-600" numberOfLines={2}>
          {notification.message}
        </Text>
        <Text className="mt-2 text-xs font-semibold text-gray-400">
          {timeAgo(notification.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
};
