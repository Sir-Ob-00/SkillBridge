import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useOnboardingStore } from '../store/onboarding.store';
import { onboardingApi, CategoryWithSkills } from '../services/onboarding.api';
import { colors } from '@shared/ui/colors';
import { useFeedbackStore } from '@store/feedback.store';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep3'>;

export const Step3CategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const { cachedCategoryIds, cacheCategoryIds, saveDraft } = useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [categories, setCategories] = useState<CategoryWithSkills[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(cachedCategoryIds.length > 0 ? cachedCategoryIds : []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await onboardingApi.getCategoriesWithSkills();
      setCategories(data);
    } catch {
      setError('Could not load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('Selection required', 'Please select at least one category.');
      return;
    }
    setIsSaving(true);
    try {
      await onboardingApi.patchCategories({ categoryIds: selectedIds });
      cacheCategoryIds(selectedIds);
      navigation.navigate('OnboardingStep4');
    } catch (err) {
      feedbackStore.show({ type: 'error', title: 'Error', message: 'Could not save categories. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    cacheCategoryIds(selectedIds);
    await saveDraft();
    Alert.alert('Draft saved', 'Your progress has been saved.');
  };

  if (isLoading) {
    return (
      <OnboardingLayout currentStep={3}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-4 text-gray-500">Loading categories...</Text>
        </View>
      </OnboardingLayout>
    );
  }

  if (error) {
    return (
      <OnboardingLayout currentStep={3}>
        <View className="flex-1 items-center justify-center">
          <Text className="mb-4 text-center text-red-500">{error}</Text>
          <Pressable onPress={loadCategories}><Text className="font-bold text-primary">Retry</Text></Pressable>
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
      <Text className="mb-2 font-heading text-xl font-bold text-gray-900">Categories</Text>
      <Text className="mb-4 text-sm text-gray-500">Select your craft category. This helps students find you.</Text>

      <View className="flex-row flex-wrap gap-2">
        {categories.map((cat) => {
          const isSelected = selectedIds.includes(cat.id);
          return (
            <Pressable
              key={cat.id}
              onPress={() => toggleCategory(cat.id)}
              className={`rounded-full px-4 py-2 ${isSelected ? 'bg-primary' : 'border border-gray-200 bg-white'}`}
            >
              <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>{cat.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingLayout>
  );
};