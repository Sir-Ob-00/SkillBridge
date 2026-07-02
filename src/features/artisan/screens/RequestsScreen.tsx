import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Inbox } from 'lucide-react-native';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { RequestCard } from '../components/RequestCard';
import { EmptyState, Button } from '@shared/components';
import { useBookingStore } from '@store/booking.store';
import { BookingStatus } from '@app-types/index';
import { useIsFocused } from '@react-navigation/native';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Requests'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

const FILTERS: { label: string; value: BookingStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

export const RequestsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    bookings, isLoading, isLoadingMore, page, totalPages,
    fetchBookings, loadMore, updateStatus,
  } = useBookingStore();
  const [filter, setFilter] = useState<BookingStatus | 'all'>('pending');
  const isFocused = useIsFocused();

  useEffect(() => {
    void fetchBookings(filter === 'all' ? {} : { status: filter });
  }, [filter, fetchBookings, isFocused]);

  const handleRefresh = useCallback(() => {
    void fetchBookings(filter === 'all' ? {} : { status: filter });
  }, [filter, fetchBookings]);

  const handleEndReached = useCallback(() => {
    if (page < totalPages && !isLoadingMore) {
      void loadMore();
    }
  }, [page, totalPages, isLoadingMore, loadMore]);

  const handleQuickAction = useCallback(async (id: string, status: BookingStatus, label: string) => {
    if (status === 'cancelled' || status === 'completed' || status === 'rejected') {
      Alert.alert(
        `${label} Booking`,
        `Are you sure you want to ${label.toLowerCase()} this booking?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: label, onPress: () => updateStatus(id, status) },
        ]
      );
    } else {
      try {
        await updateStatus(id, status);
      } catch {
        Alert.alert('Failed', 'Could not update booking status.');
      }
    }
  }, [updateStatus]);

  const renderActions = (bookingId: string, status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <View className="flex-row gap-2 mt-2">
            <Button
              label="Decline"
              variant="outline"
              size="sm"
              onPress={() => handleQuickAction(bookingId, 'rejected', 'Decline')}
              className="flex-1"
            />
            <Button
              label="Accept"
              size="sm"
              onPress={() => handleQuickAction(bookingId, 'accepted', 'Accept')}
              className="flex-1"
            />
          </View>
        );
      case 'accepted':
        return (
          <View className="mt-2">
            <Button
              label="Start Job"
              size="sm"
              onPress={() => handleQuickAction(bookingId, 'in_progress', 'Start')}
            />
          </View>
        );
      case 'in_progress':
        return (
          <View className="mt-2">
            <Button
              label="Complete Job"
              size="sm"
              onPress={() => handleQuickAction(bookingId, 'completed', 'Complete')}
            />
          </View>
        );
      default:
        return null;
    }
  };

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
          onRefresh={handleRefresh}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <View className="py-4">
                <Text className="text-center text-sm text-gray-400">Loading more...</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate('BookingDetails', { bookingId: item.id })
              }
            >
              <RequestCard booking={item} onPress={() => {}} />
              {renderActions(item.id, item.status)}
            </Pressable>
          )}
        />
      )}
    </ScreenWrapper>
  );
};
