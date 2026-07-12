import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, View, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { Input } from '@shared/components';
import { useOnboardingStore } from '../store/onboarding.store';
import { colors } from '@shared/ui/colors';
import { uploadService } from '@services/upload.service';
import { onboardingApi } from '../services/onboarding.api';
import { useFeedbackStore } from '@store/feedback.store';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep7'>;

export const Step7PortfolioScreen: React.FC<Props> = ({ navigation }) => {
  const {
    localPortfolioUris,
    addLocalPortfolioUri,
    removeLocalPortfolioUri,
    reorderLocalPortfolio,
    cachePortfolioItem,
    clearPortfolioItems,
    saveDraft,
  } = useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [captions, setCaptions] = useState<Record<number, string>>({});
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddImages = async () => {
    if (localPortfolioUris.length >= 10) {
      Alert.alert('Limit reached', 'You can upload up to 10 images.');
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Allow access to your photo library.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (result.canceled || !result.assets.length) return;
    const remaining = 10 - localPortfolioUris.length;
    result.assets.slice(0, remaining).forEach((a) => addLocalPortfolioUri(a.uri));
  };

  const handleNext = async () => {
    if (localPortfolioUris.length === 0) {
      Alert.alert('Required', 'Please upload at least one portfolio image.');
      return;
    }
    const longCaption = Object.values(captions).find((c) => c.length > 200);
    if (longCaption) {
      Alert.alert('Validation', 'Caption must be at most 200 characters.');
      return;
    }
    setIsSaving(true);
    try {
      const items: { imageUrl: string; caption: string }[] = [];
      for (let i = 0; i < localPortfolioUris.length; i++) {
        const uri = localPortfolioUris[i];
        setUploadingIndex(i);
        const imageUrl = await uploadService.uploadImage(uri, 'skillbridge/portfolio');
        items.push({ imageUrl, caption: captions[i] || '' });
      }
      setUploadingIndex(null);

      await onboardingApi.patchPortfolio({ items });
      clearPortfolioItems();
      items.forEach((item) => cachePortfolioItem(item));
      useOnboardingStore.getState().completeStep('portfolio');
      await saveDraft();
      navigation.navigate('OnboardingStep8');
    } catch (err) {
      feedbackStore.show({ type: 'error', title: 'Upload Error', message: 'Could not upload portfolio images. Please try again.' });
    } finally {
      setUploadingIndex(null);
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    await saveDraft();
    Alert.alert('Draft saved', 'Your progress has been saved.');
  };

  return (
    <OnboardingLayout
      currentStep={7}
      onBack={() => navigation.navigate('OnboardingStep6')}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      disableNext={localPortfolioUris.length === 0}
      isNextLoading={isSaving}
      nextLabel="Upload & Continue"
    >
      <Text className="mb-2 font-heading text-xl font-bold text-gray-900">Portfolio</Text>
      <Text className="mb-4 text-sm text-gray-500">Upload images showcasing your work.</Text>
      <Text className="mb-2 text-sm text-gray-600">{localPortfolioUris.length} / 10 images</Text>

      <View className="flex-row flex-wrap gap-2">
        {localPortfolioUris.map((uri, index) => (
          <View key={`${uri}-${index}`} className="mb-2 w-full">
            <View className="relative">
              {uploadingIndex === index ? (
                <View className="h-28 items-center justify-center rounded-lg bg-gray-100">
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text className="mt-1 text-xs text-gray-400">Uploading...</Text>
                </View>
              ) : (
                <Image source={{ uri }} className="h-28 w-28 rounded-lg bg-gray-100" resizeMode="cover" />
              )}
              <Pressable onPress={() => removeLocalPortfolioUri(index)} className="absolute right-1 top-1 h-6 w-6 items-center justify-center rounded-full bg-red-500">
                <Trash2 size={12} color="#ffffff" />
              </Pressable>
              <View className="absolute bottom-1 left-1 flex-row gap-1">
                {index > 0 && (
                  <Pressable onPress={() => reorderLocalPortfolio(index, index - 1)} className="h-6 w-6 items-center justify-center rounded-full bg-gray-800/60">
                    <MoveUp size={12} color="#ffffff" />
                  </Pressable>
                )}
                {index < localPortfolioUris.length - 1 && (
                  <Pressable onPress={() => reorderLocalPortfolio(index, index + 1)} className="h-6 w-6 items-center justify-center rounded-full bg-gray-800/60">
                    <MoveDown size={12} color="#ffffff" />
                  </Pressable>
                )}
              </View>
            </View>
            <Input
              label="Caption (optional)"
              placeholder="Describe this work"
              value={captions[index] || ''}
              onChangeText={(val) => setCaptions((prev) => ({ ...prev, [index]: val }))}
              className="mt-1"
            />
          </View>
        ))}

        {localPortfolioUris.length < 10 && (
          <Pressable onPress={handleAddImages} className="h-28 w-28 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <Plus size={28} color={colors.gray400} />
            <Text className="mt-1 text-xs text-gray-400">Add Image</Text>
          </Pressable>
        )}
      </View>
    </OnboardingLayout>
  );
};