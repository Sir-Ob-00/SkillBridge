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
import { useEnsureStackHasAllSteps } from '../hooks/useOnboardingNavigation';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

interface TimeBlock {
  days: string[];
  startTime: string;
  endTime: string;
}

function groupSlotsIntoBlocks(slots: AvailabilitySlot[]): TimeBlock[] {
  const groups = new Map<string, TimeBlock>();
  for (const slot of slots) {
    const key = `${slot.startTime}|${slot.endTime}`;
    if (groups.has(key)) {
      groups.get(key)!.days.push(slot.day);
    } else {
      groups.set(key, { days: [slot.day], startTime: slot.startTime, endTime: slot.endTime });
    }
  }
  return Array.from(groups.values());
}

function flattenBlocksToSlots(blocks: TimeBlock[]): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  for (const block of blocks) {
    for (const day of block.days) {
      slots.push({ day, startTime: block.startTime, endTime: block.endTime });
    }
  }
  return slots;
}

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep6'>;

export const Step6AvailabilityScreen: React.FC<Props> = ({ navigation }) => {
  useEnsureStackHasAllSteps(navigation, 6);

  const { cachedSlots, cacheSlots, saveDraft } = useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [blocks, setBlocks] = useState<TimeBlock[]>(() =>
    cachedSlots.length > 0 ? groupSlotsIntoBlocks(cachedSlots) : []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const addBlock = () =>
    setBlocks((prev) => [...prev, { days: [], startTime: '09:00', endTime: '17:00' }]);

  const toggleDay = (blockIndex: number, day: string) => {
    setBlocks((prev) => {
      const updated = [...prev];
      const block = { ...updated[blockIndex] };
      if (block.days.includes(day)) {
        block.days = block.days.filter((d) => d !== day);
      } else {
        block.days = [...block.days, day];
      }
      updated[blockIndex] = block;
      return updated;
    });
  };

  const updateBlock = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setBlocks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeBlock = (index: number) =>
    setBlocks((prev) => prev.filter((_, i) => i !== index));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (blocks.length === 0) errs.availability = 'Add at least one time block.';
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    blocks.forEach((block, i) => {
      if (block.days.length === 0) errs[`days_${i}`] = 'Select at least one day.';
      if (!timeRegex.test(block.startTime)) errs[`start_${i}`] = 'Use HH:mm format (e.g. 09:00).';
      if (!timeRegex.test(block.endTime)) errs[`end_${i}`] = 'Use HH:mm format (e.g. 17:00).';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const slots = flattenBlocksToSlots(blocks);
      await onboardingApi.patchAvailability({ slots });
      cacheSlots(slots);
      useOnboardingStore.getState().completeStep('availability');
      await saveDraft();
      navigation.navigate('OnboardingStep7');
    } catch (err) {
      feedbackStore.show({ type: 'error', title: 'Error', message: 'Could not save availability. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    const slots = flattenBlocksToSlots(blocks);
    cacheSlots(slots);
    await saveDraft();
    Alert.alert('Draft saved', 'Your progress has been saved.');
  };

  const hasAnyDaySelected = blocks.some((b) => b.days.length > 0);

  return (
    <OnboardingLayout
      currentStep={6}
      onBack={() => navigation.navigate('OnboardingStep5')}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      disableNext={blocks.length === 0 || !hasAnyDaySelected}
      isNextLoading={isSaving}
      nextLabel="Continue"
    >
      <Text className="mb-2 font-heading text-xl font-bold text-gray-900">Availability</Text>
      <Text className="mb-4 text-sm text-gray-500">
        Set your weekly availability. Each time block lets you select multiple days with the same hours.
      </Text>

      {blocks.map((block, index) => (
        <View key={index} className="mb-3 rounded-lg border border-gray-200 bg-white p-3">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-sm font-bold text-gray-700">Time Block {index + 1}</Text>
            <Pressable onPress={() => removeBlock(index)}>
              <Trash2 size={16} color={colors.danger} />
            </Pressable>
          </View>

          <View className="mb-2">
            <View className="mb-1 flex-row items-center justify-between">
              <Text className="text-xs font-medium text-gray-600">Days</Text>
              {errors[`days_${index}`] &&
                <Text className="text-xs text-red-500">{errors[`days_${index}`]}</Text>}
            </View>
            <View className="flex-row flex-wrap gap-1">
              {DAYS.map((day) => {
                const isSelected = block.days.includes(day);
                return (
                  <Pressable
                    key={day}
                    onPress={() => toggleDay(index, day)}
                    className={`rounded px-2 py-1 ${isSelected ? 'bg-primary' : 'bg-gray-100'}`}
                  >
                    <Text className={`text-xs ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                      {day.slice(0, 3)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1">
              <Input
                label="Start"
                placeholder="09:00"
                value={block.startTime}
                onChangeText={(val) => updateBlock(index, 'startTime', val)}
                error={errors[`start_${index}`]}
              />
            </View>
            <View className="flex-1">
              <Input
                label="End"
                placeholder="17:00"
                value={block.endTime}
                onChangeText={(val) => updateBlock(index, 'endTime', val)}
                error={errors[`end_${index}`]}
              />
            </View>
          </View>
        </View>
      ))}

      <Pressable
        onPress={addBlock}
        className="mb-4 flex-row items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-3"
      >
        <Plus size={18} color={colors.gray400} />
        <Text className="ml-2 text-sm font-medium text-gray-500">Add Time Block</Text>
      </Pressable>

      {errors.availability && <Text className="mb-2 text-xs text-red-500">{errors.availability}</Text>}
    </OnboardingLayout>
  );
};
