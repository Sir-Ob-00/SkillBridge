import React, { useCallback } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Bell, CheckCheck, Trash2 } from 'lucide-react-native';
import { ScreenWrapper } from '@shared/layout';
import { EmptyState, Button } from '@shared/components';
import { useNotificationsStore } from '@modules/notifications/notifications.store';
import { NotificationCard } from '@modules/notifications/components/NotificationCard';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<any, any>;

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } =
    useNotificationsStore();

  const handlePress = useCallback(
    (id: string) => {
      markAsRead(id);
    },
    [markAsRead]
  );

  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <View className="mb-4 flex-row items-center">
        <Pressable onPress={() => navigation.goBack()} className="mr-4 w-10 active:opacity-70">
          <ArrowLeft size={24} color={colors.gray800} />
        </Pressable>
        <Text className="flex-1 font-heading text-2xl font-bold text-gray-900">
          Notifications
        </Text>
        {notifications.length > 0 ? (
          <View className="flex-row gap-2">
            <Pressable
              onPress={markAllAsRead}
              className="h-10 w-10 items-center justify-center rounded-xl bg-gray-100 active:opacity-70"
              accessibilityLabel="Mark all as read"
            >
              <CheckCheck size={20} color={colors.gray600} />
            </Pressable>
            <Pressable
              onPress={clearNotifications}
              className="h-10 w-10 items-center justify-center rounded-xl bg-gray-100 active:opacity-70"
              accessibilityLabel="Clear all notifications"
            >
              <Trash2 size={20} color={colors.danger} />
            </Pressable>
          </View>
        ) : null}
      </View>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="We'll let you know when something important happens."
        />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={() => handlePress(item.id)}
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
};
