import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { useOnboardingStore } from '../store/onboarding.store';
import { onboardingApi, ApiCategory } from '../services/onboarding.api';
import { colors } from '@shared/ui/colors';
import { useFeedbackStore } from '@store/feedback.store';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep3'>;

export const Step3CategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const { cachedCategoryIds, cacheCategoryIds, saveDraft } = useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    cachedCategoryIds.length === 1 ? cachedCategoryIds[0] : null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await onboardingApi.getCategories();
      setCategories(data);
    } catch {
      setError('Could not load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleNext = async () => {
    if (!selectedId) {
      Alert.alert('Selection required', 'Please select a category.');
      return;
    }
    setIsSaving(true);
    try {
      await onboardingApi.patchCategories({ categoryIds: [selectedId] });
      cacheCategoryIds([selectedId]);
      useOnboardingStore.getState().completeStep('skills');
      await saveDraft();
      navigation.navigate('OnboardingStep4');
    } catch (err) {
      feedbackStore.show({ type: 'error', title: 'Error', message: 'Could not save category. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    cacheCategoryIds(selectedId ? [selectedId] : []);
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
      disableNext={!selectedId}
      isNextLoading={isSaving}
    >
      <Text className="mb-2 font-heading text-xl font-bold text-gray-900">Category</Text>
      <Text className="mb-4 text-sm text-gray-500">Select your craft category. This helps students find you.</Text>

      <View className="gap-2">
        {categories.map((cat) => {
          const isSelected = selectedId === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => toggleCategory(cat.id)}
              className={`flex-row items-center rounded-xl border px-4 py-4 ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <View
                className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                  isSelected ? 'border-primary bg-primary' : 'border-gray-300'
                }`}
              >
                {isSelected && <Check size={14} color="#ffffff" />}
              </View>
              <Text
                className={`ml-3 text-base ${
                  isSelected ? 'font-semibold text-primary' : 'text-gray-700'
                }`}
              >
                {cat.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingLayout>
  );
};
