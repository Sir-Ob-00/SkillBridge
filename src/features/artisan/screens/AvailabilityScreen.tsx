import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft } from 'lucide-react-native';
import { ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Button } from '@shared/components';
import { Loader } from '@shared/components/Loader';
import { CalendarPicker } from '../components/CalendarPicker';
import { artisanApi, AvailabilitySlot } from '@services/api/artisan.api';
import { useAuthStore } from '@store/auth.store';
import { colors } from '@shared/ui/colors';

type Props = NativeStackScreenProps<ArtisanStackParamList, 'Availability'>;

export const AvailabilityScreen: React.FC<Props> = ({ navigation }) => {
  const artisanId = useAuthStore((state) => state.user?.id ?? '');
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!artisanId) return;
    artisanApi
      .getAvailability(artisanId)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setIsLoading(false));
  }, [artisanId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await artisanApi.updateAvailability(artisanId, slots);
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
    <ScreenWrapper edges={['top', 'left', 'right']}>
      <Pressable onPress={() => navigation.goBack()} className="mt-2 mb-2 w-10">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <Text className="mb-6 font-heading text-2xl font-bold text-gray-900">
        Availability
      </Text>

      <CalendarPicker slots={slots} onChange={setSlots} />

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
