import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Sun, Umbrella } from 'lucide-react-native';
import { ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { Loader } from '@shared/components/Loader';
import { CalendarPicker } from '../components/CalendarPicker';
import { artisanApi, AvailabilitySlot } from '@services/api/artisan.api';
import { artisanService } from '@services/artisan.service';
import { useAuthStore } from '@store/auth.store';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<ArtisanStackParamList, 'Availability'>;

export const AvailabilityScreen: React.FC<Props> = ({ navigation }) => {
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [holidayMode, setHolidayMode] = useState(false);
  const [instantAvailable, setInstantAvailable] = useState(false);
  const [artisanId, setArtisanId] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await artisanService.getMyProfile();
        setArtisanId(profile.id);
        const availability = await artisanApi.getAvailability(profile.id);
        setSlots(availability);
      } catch {
        setArtisanId(userId);
        try {
          const availability = await artisanApi.getAvailability(userId);
          setSlots(availability);
        } catch {
          setSlots([]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [userId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = holidayMode ? [] : slots;
      await artisanApi.updateAvailability(artisanId, dataToSave);
      Alert.alert('Saved', 'Your availability has been updated.');
    } catch {
      Alert.alert('Failed to save', 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader fullScreen label="Loading availability..." />;
  }

  return (
    <ScreenWrapper scrollable keyboardAvoiding edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <Text className="mb-6 font-heading text-2xl font-bold text-gray-900">
        Availability
      </Text>

      {/* Holiday Mode Toggle */}
      <View className="mb-4 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <Umbrella size={20} color="#d97706" />
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-900">
              Holiday Mode
            </Text>
            <Text className="text-xs text-gray-500">
              Hide from search until turned off
            </Text>
          </View>
        </View>
        <Switch
          value={holidayMode}
          onValueChange={setHolidayMode}
          trackColor={{ false: colors.gray200, true: '#d97706' }}
          thumbColor="#ffffff"
        />
      </View>

      {/* Instant Availability Toggle */}
      <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-success/10">
            <Sun size={20} color={colors.success} />
          </View>
          <View>
            <Text className="text-sm font-semibold text-gray-900">
              Available Now
            </Text>
            <Text className="text-xs text-gray-500">
              Mark yourself as instantly available
            </Text>
          </View>
        </View>
        <Switch
          value={instantAvailable}
          onValueChange={setInstantAvailable}
          trackColor={{ false: colors.gray200, true: colors.success }}
          thumbColor="#ffffff"
        />
      </View>

      <CalendarPicker
        slots={slots}
        onChange={setSlots}
        holidayMode={holidayMode}
      />

      <Button
        label="Save Availability"
        onPress={handleSave}
        isLoading={isSaving}
        fullWidth
        size="lg"
        className="mt-8"
      />
    </ScreenWrapper>
  );
};
