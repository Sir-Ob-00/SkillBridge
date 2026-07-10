import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { Input } from '@shared/components';
import { useOnboardingStore } from '../store/onboarding.store';
import { onboardingApi } from '../services/onboarding.api';
import { useFeedbackStore } from '@store/feedback.store';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep2'>;

export const Step2BusinessInfoScreen: React.FC<Props> = ({ navigation }) => {
  const { cachedBusinessName, cachedBio, cachedLocation, cachedPricingFrom, cacheBusinessInfo, saveDraft } =
    useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [businessName, setBusinessName] = useState(cachedBusinessName || '');
  const [bio, setBio] = useState(cachedBio || '');
  const [location, setLocation] = useState(cachedLocation || '');
  const [pricingFrom, setPricingFrom] = useState(cachedPricingFrom ? String(cachedPricingFrom) : '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (businessName.trim().length < 2) errs.businessName = 'Enter your business name.';
    if (bio.trim().length < 10) errs.bio = 'Please write at least 10 characters about your work.';
    if (!location.trim()) errs.location = 'Enter your location.';
    if (!pricingFrom || isNaN(Number(pricingFrom)) || Number(pricingFrom) <= 0) {
      errs.pricingFrom = 'Enter a valid starting price.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const payload = {
        businessName: businessName.trim(),
        bio: bio.trim(),
        location: location.trim(),
        pricingFrom: Number(pricingFrom),
      };
      await onboardingApi.patchBusinessInfo(payload);
      cacheBusinessInfo(payload.businessName, payload.bio, payload.location, payload.pricingFrom);
      navigation.navigate('OnboardingStep3');
    } catch (err) {
      feedbackStore.show({
        type: 'error',
        title: 'Error',
        message: 'Could not save business info. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    cacheBusinessInfo(businessName.trim(), bio.trim(), location.trim(), Number(pricingFrom) || 0);
    await saveDraft();
    Alert.alert('Draft saved', 'Your progress has been saved.');
  };

  return (
    <OnboardingLayout
      currentStep={2}
      onBack={() => navigation.navigate('OnboardingStep1')}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      disableNext={businessName.trim().length < 2 || bio.trim().length < 10 || !location || !pricingFrom}
      isNextLoading={isSaving}
    >
      <Text className="mb-6 font-heading text-xl font-bold text-gray-900">Business Information</Text>

      <Input
        label="Business Name"
        placeholder="e.g. Kofi's Barber Shop"
        value={businessName}
        onChangeText={(val) => { setBusinessName(val); setErrors((prev) => ({ ...prev, businessName: '' })); }}
        error={errors.businessName}
      />

      <Input
        label="Professional Bio"
        placeholder="Tell students about your work, experience..."
        value={bio}
        onChangeText={(val) => { setBio(val); setErrors((prev) => ({ ...prev, bio: '' })); }}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="min-h-[100px]"
        error={errors.bio}
      />

      <Input
        label="Location"
        placeholder="e.g. Accra, Ghana"
        value={location}
        onChangeText={(val) => { setLocation(val); setErrors((prev) => ({ ...prev, location: '' })); }}
        error={errors.location}
      />

      <Input
        label="Starting Price (GHS)"
        placeholder="e.g. 50"
        value={pricingFrom}
        onChangeText={(val) => { setPricingFrom(val); setErrors((prev) => ({ ...prev, pricingFrom: '' })); }}
        keyboardType="numeric"
        error={errors.pricingFrom}
      />
    </OnboardingLayout>
  );
};