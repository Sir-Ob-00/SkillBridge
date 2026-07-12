import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useOnboardingStore } from '../store/onboarding.store';
import { onboardingApi, CategoryWithSkills } from '../services/onboarding.api';
import { colors } from '@shared/ui/colors';
import { Skill } from '@app-types/index';
import { useFeedbackStore } from '@store/feedback.store';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep3'>;

export const Step4SkillsScreen: React.FC<Props> = ({ navigation }) => {
  const { cachedCategoryIds, cachedSkillIds, cacheSkillIds, saveDraft } = useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(cachedSkillIds.length > 0 ? cachedSkillIds : []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const categories = await onboardingApi.getCategoriesWithSkills();
      const catsToUse = cachedCategoryIds.length > 0
        ? categories.filter((c) => cachedCategoryIds.includes(c.id))
        : categories;
      const skills = catsToUse.flatMap((c) => c.skills);
      setAllSkills(skills);
    } catch {
      setError('Could not load skills. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (id: string) => {
    if (selectedIds.length >= 20 && !selectedIds.includes(id)) {
      Alert.alert('Limit', 'You can select up to 20 skills.');
      return;
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('Required', 'Please select at least one skill.');
      return;
    }
    setIsSaving(true);
    try {
      await onboardingApi.patchSkills({ skillIds: selectedIds });
      cacheSkillIds(selectedIds);
      navigation.navigate('OnboardingStep4');
    } catch (err) {
      feedbackStore.show({ type: 'error', title: 'Error', message: 'Could not save skills. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    cacheSkillIds(selectedIds);
    await saveDraft();
    Alert.alert('Draft saved', 'Your progress has been saved.');
  };

  if (isLoading) {
    return (
      <OnboardingLayout currentStep={3}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-gray-500">Loading skills...</Text>
        </View>
      </OnboardingLayout>
    );
  }

  if (error) {
    return (
      <OnboardingLayout currentStep={3}>
        <View className="flex-1 items-center justify-center">
          <Text className="mb-4 text-center text-red-500">{error}</Text>
          <Pressable onPress={loadSkills}><Text className="font-bold text-primary">Retry</Text></Pressable>
        </View>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      currentStep={3}
      onBack={() => navigation.navigate('OnboardingStep2')}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      disableNext={selectedIds.length === 0}
      isNextLoading={isSaving}
    >
      <Text className="mb-2 font-heading text-xl font-bold text-gray-900">Skills</Text>
      <Text className="mb-4 text-sm text-gray-500">Select the skills you offer. Choose from the available list.</Text>

      {allSkills.length > 0 ? (
        <View className="flex-row flex-wrap gap-2">
          {allSkills.map((skill) => {
            const isSelected = selectedIds.includes(skill.id);
            return (
              <Pressable
                key={skill.id}
                onPress={() => toggleSkill(skill.id)}
                className={`rounded-lg border px-4 py-3 ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                }`}
              >
                <Text className={`text-sm ${isSelected ? 'font-bold text-primary' : 'text-gray-700'}`}>
                  {skill.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text className="text-sm text-gray-400">No skills available.</Text>
      )}
    </OnboardingLayout>
  );
};