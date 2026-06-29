import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { useAuthStore } from '@store/auth.store';
import { useBookingStore } from '@store/booking.store';
import { chatApi } from '@features/chat/services/chat.api';
import { artisanApi } from '@services/api/artisan.api';
import { Chat } from '@app-types/index';
import { DashboardUrgentActions } from '../components/DashboardUrgentActions';
import { DashboardQuickStats } from '../components/DashboardQuickStats';
import { DashboardTodaysJobs } from '../components/DashboardTodaysJobs';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Dashboard'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const userName = useAuthStore((state) => state.user?.name?.split(' ')[0]);
  const initial = userName?.charAt(0) ?? 'A';
  const { bookings, fetchBookings } = useBookingStore();
  const [earnings, setEarnings] = useState<{ total: number; thisMonth: number; pending: number } | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    void fetchBookings({});
    artisanApi.getEarnings().then(setEarnings).catch(() => {});
    chatApi.listChats().then(setChats).catch(() => {});
  }, [fetchBookings]);

  return (
    <ScreenWrapper scrollable contentClassName="pt-2">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium tracking-wide text-gray-500">
            Dashboard
          </Text>
          <Text className="mt-0.5 font-heading text-3xl font-bold text-gray-900">
            {userName ?? 'Artisan'} 👋
          </Text>
        </View>
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Text className="text-lg font-bold text-primary">{initial}</Text>
        </View>
      </View>

      <DashboardUrgentActions
        bookings={bookings}
        chats={chats}
        onViewRequest={(id) =>
          navigation.navigate('BookingDetails', { bookingId: id })
        }
        onViewChat={() => navigation.navigate('Chat')}
      />

      <DashboardQuickStats
        bookings={bookings}
        earningsThisMonth={earnings?.thisMonth ?? 0}
      />

      <DashboardTodaysJobs
        bookings={bookings}
        onViewDetails={(id) =>
          navigation.navigate('BookingDetails', { bookingId: id })
        }
      />
    </ScreenWrapper>
  );
};
