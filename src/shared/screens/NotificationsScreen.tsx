import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { ScreenWrapper } from '@shared/layout';
import { EmptyState } from '@shared/components';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<any, any>;

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Booking Confirmed', message: 'Your booking for Haircut has been confirmed.', time: '2 hours ago', read: false },
  { id: '2', title: 'New Message', message: 'Alex sent you a message regarding your appointment.', time: '5 hours ago', read: false },
  { id: '3', title: 'Welcome!', message: 'Thanks for joining SkillBridge.', time: '2 days ago', read: true },
];

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenWrapper scrollable={false} edges={['top', 'left', 'right']}>
      <View className="mb-4 flex-row items-center">
        <Pressable onPress={() => navigation.goBack()} className="mr-4 w-10 active:opacity-70">
          <ArrowLeft size={24} color={colors.gray800} />
        </Pressable>
        <Text className="font-heading text-2xl font-bold text-gray-900">
          Notifications
        </Text>
      </View>

      {MOCK_NOTIFICATIONS.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="We'll let you know when something important happens."
        />
      ) : (
        <FlatList
          data={MOCK_NOTIFICATIONS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Pressable
              className={[
                'mb-3 flex-row rounded-3xl border p-5 shadow-sm active:scale-[0.98] transition-transform',
                item.read
                  ? 'border-transparent bg-white shadow-gray-200'
                  : 'border-primary/20 bg-primary/5 shadow-primary/10',
              ].join(' ')}
            >
              <View className="mr-4 mt-1 h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm shadow-gray-100">
                <Bell size={20} color={item.read ? colors.gray400 : colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">{item.title}</Text>
                <Text className="mt-1 text-sm leading-5 text-gray-600">{item.message}</Text>
                <Text className="mt-2 text-xs font-semibold text-gray-400">{item.time}</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </ScreenWrapper>
  );
};
