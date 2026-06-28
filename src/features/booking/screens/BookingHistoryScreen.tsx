import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CalendarX } from 'lucide-react-native';
import { StudentTabParamList, StudentStackParamList } from '@features/student/student.types';
import { ScreenWrapper } from '@shared/layout';
import { EmptyState } from '@shared/components';
import { BookingCard } from '../components/BookingCard';
import { useBookingStore } from '@store/booking.store';
import { BookingStatus } from '@app-types/index';

type Props = CompositeScreenProps<
  BottomTabScreenProps<StudentTabParamList, 'Bookings'>,
  NativeStackScreenProps<StudentStackParamList>
>;

const FILTERS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Completed', value: 'completed' },
];

export const BookingHistoryScreen: React.FC<Props> = ({ navigation }) => {
  const { bookings, isLoading, fetchBookings } = useBookingStore();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    void fetchBookings(filter === 'all' ? {} : { status: filter });
  }, [filter, fetchBookings]);

  return (
    <ScreenWrapper scrollable={false} contentClassName="pt-2">
      <Text className="mb-3 font-heading text-2xl font-bold text-gray-900">
        My Bookings
      </Text>

      <View className="mb-4 flex-row gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.value;
          return (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={[
                'rounded-full px-4 py-2',
                isActive ? 'bg-primary' : 'bg-white border border-gray-200',
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
          icon={CalendarX}
          title="No bookings yet"
          description="Your booking requests will show up here."
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
            <BookingCard
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
