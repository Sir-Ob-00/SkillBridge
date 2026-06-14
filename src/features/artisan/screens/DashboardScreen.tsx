import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Calendar, Star, Wallet } from 'lucide-react-native';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { RequestCard } from '../components/RequestCard';
import { EmptyState } from '@shared/components';
import { useBookingStore } from '@store/booking.store';
import { useAuthStore } from '@store/auth.store';
import { formatCurrency } from '@utils/currency';
import { colors } from '@shared/ui/colors';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Dashboard'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const userName = useAuthStore((state) => state.user?.name?.split(' ')[0]);
  const { bookings, fetchBookings } = useBookingStore();

  useEffect(() => {
    void fetchBookings({ status: 'pending' });
  }, [fetchBookings]);

  const pendingBookings = bookings.filter((b) => b.status === 'pending').slice(0, 3);

  return (
    <ScreenWrapper scrollable contentClassName="pt-2">
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overview,</Text>
          <Text className="mt-1 font-heading text-3xl font-bold text-gray-900">
            {userName ?? 'Artisan'} 👋
          </Text>
        </View>
        <View className="h-12 w-12 items-center justify-center rounded-full bg-secondary/20 border border-secondary/30">
          <Text className="text-lg font-bold text-secondary">{userName?.charAt(0) ?? 'A'}</Text>
        </View>
      </View>

      <View className="mb-6 flex-row gap-3">
        <View className="flex-1 rounded-3xl border border-transparent bg-white p-5 shadow-sm shadow-gray-200">
          <View className="mb-2 h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Calendar size={18} color={colors.primary} />
          </View>
          <Text className="text-xs text-gray-500">Pending</Text>
          <Text className="text-lg font-bold text-gray-900">
            {bookings.filter((b) => b.status === 'pending').length}
          </Text>
        </View>

        <View className="flex-1 rounded-3xl border border-transparent bg-white p-5 shadow-sm shadow-gray-200">
          <View className="mb-2 h-9 w-9 items-center justify-center rounded-full bg-secondary/20">
            <Star size={18} color={colors.secondary} />
          </View>
          <Text className="text-xs text-gray-500">Rating</Text>
          <Text className="text-lg font-bold text-gray-900">4.8</Text>
        </View>

        <View className="flex-1 rounded-3xl border border-transparent bg-white p-5 shadow-sm shadow-gray-200">
          <View className="mb-2 h-9 w-9 items-center justify-center rounded-full bg-success/10">
            <Wallet size={18} color={colors.success} />
          </View>
          <Text className="text-xs text-gray-500">Earnings</Text>
          <Text className="text-lg font-bold text-gray-900">
            {formatCurrency(0)}
          </Text>
        </View>
      </View>

      <Text className="mb-3 text-lg font-semibold text-gray-900">
        Recent requests
      </Text>

      {pendingBookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No pending requests"
          description="New booking requests will appear here."
        />
      ) : (
        pendingBookings.map((booking) => (
          <RequestCard
            key={booking.id}
            booking={booking}
            onPress={() =>
              navigation.navigate('BookingDetails', { bookingId: booking.id })
            }
          />
        ))
      )}
    </ScreenWrapper>
  );
};
