import { useEffect } from 'react';
import { Alert } from 'react-native';
import { socketClient } from '@services/socket/socketClient';
import { SOCKET_EVENTS } from '@services/socket/events';
import { useBookingStore } from '@store/booking.store';
import { Booking } from '@app-types/index';

export const useBookingSocket = () => {
  const fetchBookings = useBookingStore((state) => state.fetchBookings);
  const fetchBookingById = useBookingStore((state) => state.fetchBookingById);

  useEffect(() => {
    const socket = socketClient.getSocket();
    if (!socket) return;

    const handleBookingEvent = (event: string, data: { booking: Booking }) => {
      const { booking } = data;

      const statusLabels: Record<string, string> = {
        booking_created: 'New Booking Request',
        booking_accepted: 'Booking Accepted',
        booking_completed: 'Booking Completed',
        booking_cancelled: 'Booking Cancelled',
      };

      const title = statusLabels[event] ?? 'Booking Update';

      Alert.alert(title, `Booking #${booking.id.slice(-6).toUpperCase()} has been updated.`);

      fetchBookings();

      const state = useBookingStore.getState();
      if (state.selectedBooking?.id === booking.id) {
        fetchBookingById(booking.id);
      }
    };

    const onBookingCreated = (data: { booking: Booking }) =>
      handleBookingEvent('booking_created', data);
    const onBookingAccepted = (data: { booking: Booking }) =>
      handleBookingEvent('booking_accepted', data);
    const onBookingCompleted = (data: { booking: Booking }) =>
      handleBookingEvent('booking_completed', data);
    const onBookingCancelled = (data: { booking: Booking }) =>
      handleBookingEvent('booking_cancelled', data);

    socket.on(SOCKET_EVENTS.BOOKING_CREATED, onBookingCreated);
    socket.on(SOCKET_EVENTS.BOOKING_ACCEPTED, onBookingAccepted);
    socket.on(SOCKET_EVENTS.BOOKING_COMPLETED, onBookingCompleted);
    socket.on(SOCKET_EVENTS.BOOKING_CANCELLED, onBookingCancelled);

    return () => {
      socket.off(SOCKET_EVENTS.BOOKING_CREATED, onBookingCreated);
      socket.off(SOCKET_EVENTS.BOOKING_ACCEPTED, onBookingAccepted);
      socket.off(SOCKET_EVENTS.BOOKING_COMPLETED, onBookingCompleted);
      socket.off(SOCKET_EVENTS.BOOKING_CANCELLED, onBookingCancelled);
    };
  }, [fetchBookings, fetchBookingById]);
};
