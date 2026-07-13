import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useOnboardingStore } from '../store/onboarding.store';
import { onboardingApi } from '../services/onboarding.api';
import { colors } from '@shared/ui/colors';
import { Skill } from '@app-types/index';
import { useFeedbackStore } from '@store/feedback.store';
import { useEnsureStackHasAllSteps } from '../hooks/useOnboardingNavigation';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep4'>;

export const Step4SkillsScreen: React.FC<Props> = ({ navigation }) => {
  useEnsureStackHasAllSteps(navigation, 4);

  const { cachedCategoryIds, cachedSkillIds, cacheSkillIds, saveDraft } = useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const categoryId = cachedCategoryIds.length > 0 ? cachedCategoryIds[0] : null;

  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(cachedSkillIds.length > 0 ? cachedSkillIds : []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  console.log('[Step4SkillsScreen] mounted, cachedCategoryIds:', cachedCategoryIds, 'cachedSkillIds:', cachedSkillIds);

  useEffect(() => {
    console.log('[Step4SkillsScreen] effect running, categoryId:', categoryId);
    if (categoryId) {
      setError(null);
      loadSkills(categoryId);
    } else {
      setError('No category selected. Please go back and pick a category first.');
      setIsLoading(false);
    }
  }, [categoryId]);

  const loadSkills = async (catId: string) => {
    setIsLoading(true);
    try {
      const skills = await onboardingApi.getSkillsByCategory(catId);
      setAllSkills(skills.filter((s): s is Skill => !!s));
    } catch {
      setError('Could not load skills. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (id: string) => {
    if (selectedIds.length >= 8 && !selectedIds.includes(id)) {
      Alert.alert('Limit', 'You can select up to 8 skills.');
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
      useOnboardingStore.getState().completeStep('skills');
      await saveDraft();
      navigation.navigate('OnboardingStep5');
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
      <OnboardingLayout currentStep={4}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-gray-500">Loading skills...</Text>
        </View>
      </OnboardingLayout>
    );
  }

  if (error) {
    return (
      <OnboardingLayout currentStep={4}>
        <View className="flex-1 items-center justify-center">
          <Text className="mb-4 text-center text-red-500">{error}</Text>
          {categoryId && <Pressable onPress={() => loadSkills(categoryId)}><Text className="font-bold text-primary">Retry</Text></Pressable>}
        </View>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      currentStep={4}
      onBack={() => navigation.navigate('OnboardingStep3')}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      disableNext={selectedIds.length === 0}
      isNextLoading={isSaving}
    >
      <Text className="mb-2 font-heading text-xl font-bold text-gray-900">Skills</Text>
      <Text className="mb-4 text-sm text-gray-500">
        Select the skills you offer (1–8). Choose from the available list.
      </Text>

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
        <Text className="text-sm text-gray-400">No skills available for this category.</Text>
      )}
    </OnboardingLayout>
  );
};
