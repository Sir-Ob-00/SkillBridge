import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNotificationsStore } from '../notifications.store';
import { colors } from '@shared/ui/colors';

interface NotificationBellProps {
  onPress: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onPress }) => {
  const unreadCount = useNotificationsStore((s) => s.notifications.filter((n) => !n.read).length);

  return (
    <Pressable
      onPress={onPress}
      className="relative h-10 w-10 items-center justify-center rounded-xl bg-gray-100 active:opacity-70"
      accessibilityLabel={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
    >
      <Bell size={20} color={colors.gray600} />
      {unreadCount > 0 ? (
        <View className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1">
          <Text className="text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};
