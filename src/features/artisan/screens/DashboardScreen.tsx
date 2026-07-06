import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CompositeScreenProps, useIsFocused } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Avatar, Loader } from '@shared/components';
import { useAuthStore } from '@store/auth.store';
import { useBookingStore } from '@store/booking.store';
import { chatApi } from '@features/chat/services/chat.api';
import { artisanApi } from '@services/api/artisan.api';
import { reviewApi } from '@services/api/review.api';
import { artisanService } from '@services/artisan.service';
import { useSocket } from '@hooks/useSocket';
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
  const [isDataLoading, setIsDataLoading] = useState(true);
  const isFocused = useIsFocused();
  const { isConnected } = useSocket();

  const loadDashboard = useCallback(() => {
    setIsDataLoading(true);

    const bookingsPromise = fetchBookings({});
    const earningsPromise = artisanApi.getEarnings().then(setEarnings).catch(() => {});
    const chatsPromise = chatApi.listChats().then(setChats).catch(() => {});
    const reviewsPromise = artisanService
      .getMyProfile()
      .then((profile) => {
        if (!profile) return;
        const rc = Number(profile.reviewCount) || 0;
        if (rc > 0) {
          setAverageRating(Number(profile.rating) || 0);
          setReviewCount(rc);
          return;
        }
        return reviewApi.list(profile.id, 1, 999).then((result) => {
          setReviewCount(result.totalItems);
          if (result.items.length > 0) {
            const avg = result.items.reduce((sum, r) => sum + Number(r.rating), 0) / result.items.length;
            setAverageRating(avg);
          }
        });
      })
      .catch(() => {});

    Promise.all([bookingsPromise, earningsPromise, chatsPromise, reviewsPromise])
      .catch(() => {})
      .finally(() => setIsDataLoading(false));
  }, [fetchBookings]);

  useEffect(() => {
    if (isFocused && isConnected) {
      loadDashboard();
    }
  }, [isFocused, isConnected, loadDashboard]);

  const showLoading = isFocused && (!isConnected || isDataLoading);

  return (
    <ScreenWrapper scrollable={!showLoading} contentClassName="pt-2">
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

      {showLoading ? (
        <View className="flex-1 items-center justify-center py-20">
          <Loader label="Loading dashboard..." />
        </View>
      ) : (
        <>
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
        </>
      )}
    </ScreenWrapper>
  );
};
