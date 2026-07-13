import React from 'react';
import { Alert, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CheckCircle } from 'lucide-react-native';
import { OnboardingStackParamList, OnboardingFlowParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { Button, Input } from '@shared/components';
import { useOnboardingStore } from '../store/onboarding.store';
import { useAuthStore } from '@store/auth.store';
import { colors } from '@shared/ui/colors';
import { onboardingApi } from '../services/onboarding.api';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep9'>;

export const Step9ReviewScreen: React.FC<Props> = ({ navigation }) => {
  const {
    clearDraft,
    isSubmitting,
    setSubmitting,
    setError,
    cachedBusinessName,
    cachedBio,
    cachedLocation,
    cachedPricingFrom,
    cachedPhone,
    cachedCategoryIds,
    cachedSkillIds,
    cachedServices,
    cachedSlots,
    cachedPortfolioItems,
    cachedInstitution,
    cachedStudentId,
    cachedVerificationImageUrl,
    localPortfolioUris,
    localVerificationImageUri,
  } = useOnboardingStore();

  const [notes, setNotes] = React.useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onboardingApi.submitApplication(notes.trim() ? { notes: notes.trim() } : undefined);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({ ...currentUser, onboardingStatus: 'PENDING_REVIEW' });
      }
      await clearDraft();
      (navigation.getParent() as NativeStackNavigationProp<OnboardingFlowParamList>)?.navigate('SubmissionSuccess');
    } catch (err: any) {
      const apiError = err?.response?.data as { message?: string; details?: { missingFields?: string[] } } | undefined;
      if (apiError?.details?.missingFields) {
        const missing = apiError.details.missingFields.join(', ');
        const message = `Missing required fields: ${missing}`;
        setError(message);
        Alert.alert('Incomplete Application', message);
      } else if (apiError?.message === 'Your application has already been approved.') {
        setError(apiError.message);
        Alert.alert('Already Approved', 'Your application has already been approved.');
      } else {
        const message = apiError?.message || (err instanceof Error ? err.message : 'Could not submit application.');
        setError(message);
        Alert.alert('Error', message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const FieldRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
    <View className="mb-1 flex-row">
      <Text className="w-32 text-sm text-gray-500">{label}</Text>
      <Text className="flex-1 text-sm font-medium text-gray-900">{value || '-'}</Text>
    </View>
  );

  const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
    <Text className="mb-2 mt-4 font-heading text-base font-bold text-gray-900">{label}</Text>
  );

  return (
    <OnboardingLayout currentStep={9} hideNext>
      <View className="mb-4 flex-row items-center gap-2">
        <CheckCircle size={20} color={colors.success} />
        <Text className="font-heading text-xl font-bold text-gray-900">Review & Submit</Text>
      </View>
      <Text className="mb-4 text-sm text-gray-500">Please review all your information before submitting.</Text>

      <View className="rounded-lg border border-gray-200 bg-white p-4">
        <SectionLabel label="Personal" />
        <FieldRow label="Phone" value={cachedPhone} />

        <SectionLabel label="Business" />
        <FieldRow label="Name" value={cachedBusinessName} />
        <FieldRow label="Bio" value={cachedBio} />
        <FieldRow label="Location" value={cachedLocation} />
        <FieldRow label="Price From" value={cachedPricingFrom ? `GHS ${cachedPricingFrom}` : undefined} />

        <SectionLabel label="Categories" />
        <FieldRow label="Selected" value={cachedCategoryIds.join(', ') || 'None'} />

        <SectionLabel label="Skills" />
        <FieldRow label="Skills (IDs)" value={cachedSkillIds.join(', ') || 'None'} />

        <SectionLabel label="Services" />
        {cachedServices.length > 0
          ? cachedServices.map((s, i) => (
              <FieldRow key={i} label={s.title} value={`GHS ${s.price} / ${s.durationMinutes}min`} />
            ))
          : <FieldRow label="Services" value="None" />}

        <SectionLabel label="Availability" />
        <FieldRow label="Slots" value={cachedSlots.length ? `${cachedSlots.length} slot(s)` : 'None'} />

        <SectionLabel label="Portfolio" />
        <FieldRow label="Images" value={`${localPortfolioUris.length} image(s)`} />

        <SectionLabel label="Verification" />
        <FieldRow label="Institution" value={cachedInstitution} />
        <FieldRow label="Student ID" value={cachedStudentId} />
        <FieldRow label="Photo" value={localVerificationImageUri || cachedVerificationImageUrl ? 'Captured' : 'Not captured'} />
      </View>

      <View className="mt-4">
        <Input
          label="Notes (optional)"
          placeholder="Anything you'd like to add..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
        />
      </View>

      <View className="mb-20 mt-6">
        <Button label="Submit Application" onPress={handleSubmit} isLoading={isSubmitting} fullWidth size="lg" />
      </View>
    </OnboardingLayout>
  );
};