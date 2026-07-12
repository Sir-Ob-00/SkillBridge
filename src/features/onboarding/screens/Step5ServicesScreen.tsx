import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus, Trash2 } from 'lucide-react-native';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { Input } from '@shared/components';
import { useOnboardingStore } from '../store/onboarding.store';
import { colors } from '@shared/ui/colors';
import { OnboardingServiceItem } from '@app-types/index';
import { onboardingApi, CategoryWithSkills } from '../services/onboarding.api';
import { useFeedbackStore } from '@store/feedback.store';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep5'>;

export const Step5ServicesScreen: React.FC<Props> = ({ navigation }) => {
  const { cachedCategoryIds, cachedServices, cacheServices, saveDraft } = useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [categories, setCategories] = useState<CategoryWithSkills[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [items, setItems] = useState<OnboardingServiceItem[]>(
    cachedServices.length > 0
      ? cachedServices
      : [{ title: '', description: '', price: 0, durationMinutes: 60, categoryId: '', isActive: true }]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const data = await onboardingApi.getCategoriesWithSkills();
      setCategories(data);
    } catch {
      feedbackStore.show({ type: 'error', title: 'Error', message: 'Could not load categories.' });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const addItem = () => {
    setItems((prev) => [...prev, { title: '', description: '', price: 0, durationMinutes: 60, categoryId: '', isActive: true }]);
  };

  const updateItem = (index: number, field: keyof OnboardingServiceItem, value: string | number | boolean) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (items.length === 0) errs.services = 'Add at least one service.';
    items.forEach((s, i) => {
      if (!s.title.trim() || s.title.trim().length < 3) errs[`title_${i}`] = 'Title must be at least 3 characters.';
      if (s.title.trim().length > 100) errs[`title_${i}`] = 'Title must be at most 100 characters.';
      if (!s.description.trim() || s.description.trim().length < 10) errs[`description_${i}`] = 'Description must be at least 10 characters.';
      if (s.description.trim().length > 1000) errs[`description_${i}`] = 'Description must be at most 1000 characters.';
      if (!s.categoryId) errs[`categoryId_${i}`] = 'Select a category';
      if (!s.price || s.price <= 0) errs[`price_${i}`] = 'Enter a valid positive price.';
      if (!s.durationMinutes || s.durationMinutes <= 0) errs[`duration_${i}`] = 'Enter a valid positive duration.';
      else if (s.durationMinutes > 1440) errs[`duration_${i}`] = 'Duration cannot exceed 1440 minutes.';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const payload = items.map((s) => ({
        ...s,
        title: s.title.trim(),
        description: s.description.trim(),
      }));
      await onboardingApi.patchServices({ items: payload });
      cacheServices(payload);
      navigation.navigate('OnboardingStep6');
    } catch (err) {
      feedbackStore.show({ type: 'error', title: 'Error', message: 'Could not save services. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    cacheServices(items);
    await saveDraft();
    Alert.alert('Draft saved', 'Your progress has been saved.');
  };

  const selectedCategoryIds = cachedCategoryIds.length > 0 ? cachedCategoryIds : categories.map((c) => c.id);
  const availableCategories = categories.filter((c) => selectedCategoryIds.includes(c.id));

  return (
    <OnboardingLayout
      currentStep={5}
      onBack={() => navigation.navigate('OnboardingStep4')}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      disableNext={items.length === 0}
      isNextLoading={isSaving}
      nextLabel="Save & Continue"
    >
      <Text className="mb-2 font-heading text-xl font-bold text-gray-900">Services</Text>
      <Text className="mb-4 text-sm text-gray-500">List the services you offer with pricing and duration.</Text>

      {isLoadingCategories ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text className="mt-2 text-sm text-gray-400">Loading categories...</Text>
        </View>
      ) : (
        items.map((item, index) => (
          <View key={index} className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-bold text-gray-700">Service {index + 1}</Text>
              <Pressable onPress={() => removeItem(index)}><Trash2 size={16} color={colors.danger} /></Pressable>
            </View>

            <Input
              label="Title"
              placeholder="e.g. Haircut"
              value={item.title}
              onChangeText={(val) => { updateItem(index, 'title', val); setErrors((prev) => ({ ...prev, [`title_${index}`]: '' })); }}
              error={errors[`title_${index}`]}
            />

            <Input
              label="Description"
              placeholder="Brief description"
              value={item.description}
              onChangeText={(val) => updateItem(index, 'description', val)}
            />

            <Text className="mb-1 text-xs font-medium text-gray-600">Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-1">
              <View className="flex-row gap-1.5">
                {availableCategories.map((cat) => {
                  const isSelected = item.categoryId === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      onPress={() => { updateItem(index, 'categoryId', cat.id); setErrors((prev) => ({ ...prev, [`categoryId_${index}`]: '' })); }}
                      className={`rounded-full px-3 py-1.5 ${isSelected ? 'bg-primary' : 'border border-gray-200 bg-white'}`}
                    >
                      <Text className={`text-xs ${isSelected ? 'font-bold text-white' : 'text-gray-600'}`}>{cat.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
            {errors[`categoryId_${index}`] && <Text className="mb-1 text-xs text-red-500">{errors[`categoryId_${index}`]}</Text>}

            <View className="flex-row gap-2">
              <View className="flex-1">
                <Input
                  label="Price (GHS)"
                  placeholder="e.g. 50"
                  value={item.price ? String(item.price) : ''}
                  onChangeText={(val) => { updateItem(index, 'price', val ? Number(val) : 0); setErrors((prev) => ({ ...prev, [`price_${index}`]: '' })); }}
                  keyboardType="numeric"
                  error={errors[`price_${index}`]}
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Duration (min)"
                  placeholder="e.g. 60"
                  value={item.durationMinutes ? String(item.durationMinutes) : ''}
                  onChangeText={(val) => { updateItem(index, 'durationMinutes', val ? Number(val) : 0); setErrors((prev) => ({ ...prev, [`duration_${index}`]: '' })); }}
                  keyboardType="numeric"
                  error={errors[`duration_${index}`]}
                />
              </View>
            </View>
          </View>
        ))
      )}

      <Pressable
        onPress={addItem}
        className="mb-4 flex-row items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-3"
      >
        <Plus size={18} color={colors.gray400} />
        <Text className="ml-2 text-sm font-medium text-gray-500">Add Service</Text>
      </Pressable>

      {errors.services && <Text className="mb-2 text-xs text-red-500">{errors.services}</Text>}
    </OnboardingLayout>
  );
};