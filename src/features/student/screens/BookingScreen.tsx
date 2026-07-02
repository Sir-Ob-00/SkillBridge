import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar, Clock, DollarSign } from 'lucide-react-native';
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
  const { artisanId, serviceId: preselectedServiceId } = route.params;
  const createBooking = useBookingStore((state) => state.createBooking);
  const isLoading = useBookingStore((state) => state.isLoading);

  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [useCustomService, setUseCustomService] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [scheduledAt, setScheduledAt] = useState<Date>(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [showPicker, setShowPicker] = useState<'date' | 'time' | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    let mounted = true;
    artisanApi.getServices(artisanId).then((svcs) => {
      if (!mounted) return;
      setServices(svcs);
      if (preselectedServiceId) {
        const match = svcs.find((s) => s.id === preselectedServiceId);
        if (match) setSelectedService(match);
      }
    }).finally(() => {
      if (mounted) setIsLoadingServices(false);
    });
    return () => { mounted = false; };
  }, [artisanId, preselectedServiceId]);

  const handleDateChange = (_: any, selected?: Date) => {
    setShowPicker(null);
    if (selected) setScheduledAt(selected);
  };

  const handleConfirm = async () => {
    if (!useCustomService && !selectedService) {
      Alert.alert('Select a service', 'Please choose a service or enter a custom one.');
      return;
    }
    if (useCustomService && customTitle.trim().length < 2) {
      Alert.alert('Enter service name', 'Please describe the service you need.');
      return;
    }

    try {
      await createBooking({
        artisanId,
        ...(useCustomService
          ? { serviceTitle: customTitle.trim(), price: Number(customPrice) || undefined }
          : { serviceId: selectedService!.id }
        ),
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

  if (isLoadingServices) {
    return <Loader fullScreen label="Loading services..." />;
  }

  return (
    <ScreenWrapper scrollable keyboardAvoiding edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-4 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <Text className="font-heading text-2xl font-bold text-gray-900">
        Confirm booking
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mt-4">
          <Text className="mb-2 text-sm font-medium text-gray-700">Select a service</Text>
          <Pressable
            onPress={() => { setUseCustomService(false); setSelectedService(null); }}
            className={[
              'mb-2 rounded-2xl border p-4',
              !useCustomService && !selectedService
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 bg-white',
            ].join(' ')}
          >
            <Text className="text-sm font-medium text-gray-700">Choose from available services</Text>
          </Pressable>

          {!useCustomService ? (
            services.length === 0 ? (
              <Text className="text-sm text-gray-500">No services listed. Switch to custom service below.</Text>
            ) : (
              services.map((svc) => {
                const isSelected = selectedService?.id === svc.id;
                return (
                  <Pressable
                    key={svc.id}
                    onPress={() => setSelectedService(svc)}
                    className={[
                      'mb-2 rounded-2xl border p-4',
                      isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white',
                    ].join(' ')}
                  >
                    <Text className={['text-base font-semibold', isSelected ? 'text-primary' : 'text-gray-900'].join(' ')}>
                      {svc.title}
                    </Text>
                    <Text className="mt-0.5 text-sm text-gray-500" numberOfLines={1}>
                      {svc.description}
                    </Text>
                    <Text className="mt-1 text-sm font-medium text-primary">
                      {formatCurrency(svc.price)} · {svc.durationMinutes} min
                    </Text>
                  </Pressable>
                );
              })
            )
          ) : null}

          <Pressable
            onPress={() => { setUseCustomService(true); setSelectedService(null); }}
            className={[
              'mb-4 rounded-2xl border p-4',
              useCustomService ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white',
            ].join(' ')}
          >
            <Text className={[
              'text-sm font-medium',
              useCustomService ? 'text-primary' : 'text-gray-700',
            ].join(' ')}>
              I need a custom service
            </Text>
          </Pressable>

          {useCustomService ? (
            <View className="mb-4">
              <Input
                label="Service name"
                placeholder="e.g. Custom haircut"
                value={customTitle}
                onChangeText={setCustomTitle}
              />
              <Input
                label="Price (optional)"
                placeholder="e.g. 50"
                value={customPrice}
                onChangeText={setCustomPrice}
                keyboardType="numeric"
                leftIcon={<DollarSign size={16} color={colors.gray400} />}
              />
            </View>
          ) : null}
        </View>

        <Text className="mb-2 text-sm font-medium text-gray-700">
          Preferred date & time
        </Text>
        <Pressable
          onPress={() => setShowPicker('date')}
          className="mb-4 flex-row items-center rounded-2xl border border-gray-200 bg-white px-5 py-4"
        >
          <Calendar size={18} color={colors.gray400} />
          <Text className="ml-2 flex-1 text-base text-gray-900">
            {formatDateTime(scheduledAt.toISOString())}
          </Text>
          <Pressable onPress={() => setShowPicker('time')} className="ml-2">
            <Clock size={18} color={colors.gray400} />
          </Pressable>
        </Pressable>

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

        <Input
          label="Notes for the artisan (optional)"
          placeholder="e.g. I'd like a low fade, please."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="min-h-[80px]"
        />

        <View className="h-6" />
      </ScrollView>

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
