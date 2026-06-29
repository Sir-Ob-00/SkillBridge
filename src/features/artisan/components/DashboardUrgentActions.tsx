import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Inbox, MessageCircle, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { Booking, Chat } from '@app-types/index';
import { useBookingStore } from '@store/booking.store';
import { colors } from '@shared/ui/colors';

interface DashboardUrgentActionsProps {
  bookings: Booking[];
  chats: Chat[];
  onViewRequest: (bookingId: string) => void;
  onViewChat: () => void;
}

export const DashboardUrgentActions: React.FC<DashboardUrgentActionsProps> = ({
  bookings,
  chats,
  onViewRequest,
  onViewChat,
}) => {
  const { updateStatus } = useBookingStore();

  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const hasUnread = chats.some((c) => c.lastMessage);

  const handleAccept = async (id: string) => {
    try {
      await updateStatus(id, 'accepted');
    } catch {
      Alert.alert('Failed', 'Could not accept request.');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await updateStatus(id, 'rejected');
    } catch {
      Alert.alert('Failed', 'Could not decline request.');
    }
  };

  return (
    <View className="mb-6">
      <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Urgent
      </Text>

      {pendingRequests.length === 0 && !hasUnread ? (
        <View className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-5">
          <View className="flex-row items-center">
            <CheckCircle2 size={20} color={colors.gray400} />
            <Text className="ml-2 text-sm text-gray-500">
              No urgent items — you're all caught up!
            </Text>
          </View>
        </View>
      ) : (
        <>
          {pendingRequests.slice(0, 2).map((booking) => (
            <View
              key={booking.id}
              className="mb-3 rounded-2xl border border-red-100 bg-white p-4 shadow-sm shadow-red-100"
            >
              <View className="mb-3 flex-row items-center">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <Inbox size={20} color="#dc2626" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">
                    New Booking Request
                  </Text>
                  <Text className="text-xs text-gray-500">
                    Student #{booking.studentId.slice(-4).toUpperCase()}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {new Date(booking.scheduledAt).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <View className="h-2 w-2 rounded-full bg-red-500" />
              </View>

              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => handleAccept(booking.id)}
                  className="flex-1 items-center rounded-xl bg-primary py-2.5 active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-white">Accept</Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDecline(booking.id)}
                  className="flex-1 items-center rounded-xl border border-gray-200 bg-white py-2.5 active:opacity-80"
                >
                  <Text className="text-sm font-semibold text-gray-700">
                    Decline
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => onViewRequest(booking.id)}
                  className="h-10 w-10 items-center justify-center rounded-xl bg-gray-50"
                >
                  <ChevronRight size={18} color={colors.gray600} />
                </Pressable>
              </View>
            </View>
          ))}

          {hasUnread ? (
            <Pressable
              onPress={onViewChat}
              className="flex-row items-center rounded-2xl border border-blue-100 bg-blue-50 p-4 active:opacity-80"
            >
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <MessageCircle size={20} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-900">
                  New Messages
                </Text>
                <Text className="text-xs text-blue-600">
                  {chats.length} conversation{chats.length !== 1 ? 's' : ''} with recent activity
                </Text>
              </View>
              <ChevronRight size={18} color={colors.gray400} />
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
};
