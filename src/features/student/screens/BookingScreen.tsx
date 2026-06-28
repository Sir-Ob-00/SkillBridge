import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { StudentStackParamList } from '../student.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Input } from '@shared/components';
import { Loader } from '@shared/components/Loader';
import { artisanApi } from '@services/api/artisan.api';
import { useBookingStore } from '@store/booking.store';
import { Service } from '@app-types/index';
import { formatCurrency } from '@utils/currency';
import { formatDateTime } from '@utils/formatDate';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<StudentStackParamList, 'Booking'>;

export const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { artisanId, serviceId } = route.params;
  const createBooking = useBookingStore((state) => state.createBooking);
  const isLoading = useBookingStore((state) => state.isLoading);

  const [service, setService] = useState<Service | null>(null);
  const [isLoadingService, setIsLoadingService] = useState(true);
  const [scheduledAt, setScheduledAt] = useState<Date>(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let isMounted = true;

    artisanApi
      .getServices(artisanId)
      .then((services) => {
        if (!isMounted) return;
        setService(services.find((s: any) => s.id === serviceId) ?? null);
      })
      .finally(() => {
        if (isMounted) setIsLoadingService(false);
      });

    return () => {
      isMounted = false;
    };
  }, [artisanId, serviceId]);

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    setShowPicker(null);
    if (selected) {
      setScheduledAt(selected);
    }
  };

  const handleConfirm = async () => {
    try {
      await createBooking({
        artisanId,
        serviceId,
        scheduledAt: scheduledAt.toISOString(),
        notes: notes.trim() || undefined,
      });

      Alert.alert('Booking requested', 'The artisan will confirm shortly.', [
        { text: 'OK', onPress: () => navigation.popToTop() },
      ]);
    } catch {
      Alert.alert('Booking failed', 'Please try again.');
    }
  };

  if (isLoadingService) {
    return <Loader fullScreen label="Loading service..." />;
  }

  return (
    <ScreenWrapper scrollable keyboardAvoiding edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-4 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <Text className="font-heading text-2xl font-bold text-gray-900">
        Confirm booking
      </Text>

      {service ? (
        <View className="mt-4 rounded-3xl border border-transparent bg-white p-5 shadow-sm shadow-gray-200">
          <Text className="text-lg font-bold text-gray-900">
            {service.title}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">{service.description}</Text>
          <Text className="mt-2 text-sm font-medium text-primary">
            {formatCurrency(service.price)} · {service.durationMinutes} min
          </Text>
        </View>
      ) : (
        <Text className="mt-4 text-sm text-gray-500">Service details unavailable.</Text>
      )}

      <Text className="mt-6 mb-2 text-sm font-medium text-gray-700">
        Preferred date & time
      </Text>

      <View className="flex-row gap-3">
        <Pressable
          onPress={() => setShowPicker('date')}
          className="flex-1 flex-row items-center rounded-2xl border border-transparent bg-white px-5 py-4 shadow-sm shadow-gray-100 active:scale-[0.98] active:opacity-90"
        >
          <Calendar size={18} color={colors.gray400} />
          <Text className="ml-2 text-base text-gray-900">
            {formatDateTime(scheduledAt.toISOString())}
          </Text>
        </Pressable>
      </View>

      {showPicker ? (
        <DateTimePicker
          value={scheduledAt}
          mode={showPicker}
          is24Hour
          minimumDate={new Date()}
          onChange={handleDateChange}
          {...(Platform.OS === 'ios' ? { display: 'spinner' } : {})}
        />
      ) : null}

      <View className="mt-4">
        <Input
          label="Notes for the artisan (optional)"
          placeholder="e.g. I'd like a low fade, please."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          leftIcon={<Clock size={18} color={colors.gray400} />}
          className="min-h-[80px]"
        />
      </View>

      <Button
        label="Request Booking"
        onPress={handleConfirm}
        isLoading={isLoading}
        fullWidth
        size="lg"
      />
    </ScreenWrapper>
  );
};
