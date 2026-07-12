import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus, Trash2 } from 'lucide-react-native';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { Input } from '@shared/components';
import { useOnboardingStore } from '../store/onboarding.store';
import { colors } from '@shared/ui/colors';
import { AvailabilitySlot } from '@app-types/index';
import { onboardingApi } from '../services/onboarding.api';
import { useFeedbackStore } from '@store/feedback.store';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep6'>;

export const Step6AvailabilityScreen: React.FC<Props> = ({ navigation }) => {
  const { cachedSlots, cacheSlots, saveDraft } = useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [slots, setSlots] = useState<AvailabilitySlot[]>(cachedSlots.length > 0 ? cachedSlots : []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const addSlot = () => setSlots((prev) => [...prev, { day: 'MONDAY', startTime: '09:00', endTime: '17:00' }]);

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: string) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeSlot = (index: number) => setSlots((prev) => prev.filter((_, i) => i !== index));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (slots.length === 0) errs.availability = 'Add at least one availability slot.';
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    slots.forEach((slot, i) => {
      if (!timeRegex.test(slot.startTime)) errs[`start_${i}`] = 'Use HH:mm format (e.g. 09:00).';
      if (!timeRegex.test(slot.endTime)) errs[`end_${i}`] = 'Use HH:mm format (e.g. 17:00).';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      await onboardingApi.patchAvailability({ slots });
      cacheSlots(slots);
      navigation.navigate('OnboardingStep7');
    } catch (err) {
      feedbackStore.show({ type: 'error', title: 'Error', message: 'Could not save availability. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    cacheSlots(slots);
    await saveDraft();
    Alert.alert('Draft saved', 'Your progress has been saved.');
  };

  return (
    <OnboardingLayout
      currentStep={6}
      onBack={() => navigation.navigate('OnboardingStep5')}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      disableNext={slots.length === 0}
      isNextLoading={isSaving}
      nextLabel="Save & Continue"
    >
      <Text className="mb-2 font-heading text-xl font-bold text-gray-900">Availability</Text>
      <Text className="mb-4 text-sm text-gray-500">Set your weekly availability schedule.</Text>

      {slots.map((slot, index) => (
        <View key={index} className="mb-3 rounded-lg border border-gray-200 bg-white p-3">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm font-bold text-gray-700">Slot {index + 1}</Text>
            <Pressable onPress={() => removeSlot(index)}><Trash2 size={16} color={colors.danger} /></Pressable>
          </View>

          <View className="mb-2">
            <Text className="mb-1 text-xs font-medium text-gray-600">Day</Text>
            <View className="flex-row flex-wrap gap-1">
              {DAYS.map((day) => {
                const isSelected = slot.day === day;
                return (
                  <Pressable
                    key={day}
                    onPress={() => updateSlot(index, 'day', day)}
                    className={`rounded px-2 py-1 ${isSelected ? 'bg-primary' : 'bg-gray-100'}`}
                  >
                    <Text className={`text-xs ${isSelected ? 'text-white' : 'text-gray-700'}`}>{day.slice(0, 3)}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="flex-row gap-2">
            <Input label="Start" placeholder="09:00" value={slot.startTime} onChangeText={(val) => updateSlot(index, 'startTime', val)} className="flex-1" />
            <Input label="End" placeholder="17:00" value={slot.endTime} onChangeText={(val) => updateSlot(index, 'endTime', val)} className="flex-1" />
          </View>
        </View>
      ))}

      <Pressable onPress={addSlot} className="flex-row items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-3">
        <Plus size={18} color={colors.gray400} />
        <Text className="ml-2 text-sm font-medium text-gray-500">Add Availability Slot</Text>
      </Pressable>

      {errors.availability && <Text className="mt-1 text-xs text-red-500">{errors.availability}</Text>}
    </OnboardingLayout>
  );
};