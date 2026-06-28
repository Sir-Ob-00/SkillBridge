import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Inbox } from 'lucide-react-native';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { RequestCard } from '../components/RequestCard';
import { EmptyState } from '@shared/components';
import { useBookingStore } from '@store/booking.store';
import { BookingStatus } from '@app-types/index';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Requests'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

const FILTERS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
];

export const RequestsScreen: React.FC<Props> = ({ navigation }) => {
  const { bookings, isLoading, fetchBookings } = useBookingStore();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('pending');

  useEffect(() => {
    void fetchBookings(filter === 'all' ? {} : { status: filter });
  }, [filter, fetchBookings]);

  return (
    <ScreenWrapper scrollable={false} contentClassName="pt-2">
      <Text className="mb-6 font-heading text-3xl font-bold text-gray-900">
        Booking Requests
      </Text>

      <View className="mb-4 flex-row gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={[
                'rounded-full px-5 py-2.5',
                isActive ? 'bg-primary shadow-sm shadow-primary/20' : 'bg-gray-100 border border-transparent',
              ].join(' ')}
            >
              <Text
                className={[
                  'text-sm font-medium',
                  isActive ? 'text-white' : 'text-gray-700',
                ].join(' ')}
              >
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {!isLoading && bookings.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No requests"
          description="You're all caught up."
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshing={isLoading}
          onRefresh={() => fetchBookings(filter === 'all' ? {} : { status: filter })}
          renderItem={({ item }) => (
            <RequestCard
              booking={item}
              onPress={() =>
                navigation.navigate('BookingDetails', { bookingId: item.id })
              }
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
};
