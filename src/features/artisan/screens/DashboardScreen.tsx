import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CompositeScreenProps, useIsFocused } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Avatar } from '@shared/components';
import { useAuthStore } from '@store/auth.store';
import { useBookingStore } from '@store/booking.store';
import { chatApi } from '@features/chat/services/chat.api';
import { artisanApi } from '@services/api/artisan.api';
import { reviewApi } from '@services/api/review.api';
import { artisanService } from '@services/artisan.service';
import { Chat } from '@app-types/index';
import { DashboardUrgentActions } from '../components/DashboardUrgentActions';
import { DashboardQuickStats } from '../components/DashboardQuickStats';
import { DashboardTodaysJobs } from '../components/DashboardTodaysJobs';
import { NotificationBell } from '@modules/notifications/components/NotificationBell';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Dashboard'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const user = useAuthStore((state) => state.user);
  const userName = user?.name?.split(' ')[0];
  const { bookings, fetchBookings } = useBookingStore();
  const [earnings, setEarnings] = useState<{ total: number; thisMonth: number; pending: number } | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const isFocused = useIsFocused();

  const loadDashboard = useCallback(() => {
    void fetchBookings({});
    artisanApi.getEarnings().then(setEarnings).catch(() => {});
    chatApi.listChats().then(setChats).catch(() => {});
    artisanService.getMyProfile().then((profile) => {
      if (profile) {
        reviewApi.list(profile.id, 1, 999).then((result) => {
          const allReviews = result.items;
          setReviewCount(result.totalItems);
          if (allReviews.length > 0) {
            const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            setAverageRating(avg);
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  }, [fetchBookings]);

  useEffect(() => {
    if (isFocused) loadDashboard();
  }, [isFocused, loadDashboard]);

  return (
    <ScreenWrapper scrollable contentClassName="pt-2">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium tracking-wide text-gray-500">
            Dashboard
          </Text>
          <Text className="mt-0.5 font-heading text-3xl font-bold text-gray-900">
            {userName ?? 'Artisan'}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <NotificationBell onPress={() => navigation.navigate('Notifications')} />
          <Avatar name={user?.name ?? 'Artisan'} imageUrl={user?.avatarUrl} />
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
        averageRating={averageRating}
        reviewCount={reviewCount}
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
