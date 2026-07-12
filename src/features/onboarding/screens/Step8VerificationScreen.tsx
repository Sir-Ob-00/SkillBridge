import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { Camera, RotateCcw } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { Input } from '@shared/components';
import { useOnboardingStore } from '../store/onboarding.store';
import { colors } from '@shared/ui/colors';
import { uploadService } from '@services/upload.service';
import { onboardingApi } from '../services/onboarding.api';
import { useFeedbackStore } from '@store/feedback.store';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep8'>;

export const Step8VerificationScreen: React.FC<Props> = ({ navigation }) => {
  const { cachedInstitution, cachedStudentId, cachedVerificationImageUrl, cacheVerification, localVerificationImageUri, setLocalVerificationImageUri, saveDraft } =
    useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [institution, setInstitution] = useState(cachedInstitution || '');
  const [studentId, setStudentId] = useState(cachedStudentId || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleCapture = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera Permission Required', 'We need camera access to verify your identity.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });
    if (result.canceled || !result.assets[0]) return;
    setLocalVerificationImageUri(result.assets[0].uri);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!institution.trim()) errs.institution = 'Enter your institution name.';
    else if (institution.trim().length < 2) errs.institution = 'Institution name must be at least 2 characters.';
    else if (institution.trim().length > 200) errs.institution = 'Institution name must be at most 200 characters.';
    if (!studentId.trim()) errs.studentId = 'Enter your student ID number.';
    if (!localVerificationImageUri && !cachedVerificationImageUrl) errs.image = 'Please capture a verification image.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      let verificationImageUrl = cachedVerificationImageUrl || '';
      if (localVerificationImageUri) {
        verificationImageUrl = await uploadService.uploadImage(localVerificationImageUri, 'skillbridge/verification');
      }

      const payload = { institution: institution.trim(), studentId: studentId.trim(), verificationImageUrl };
      await onboardingApi.patchVerification(payload);
      cacheVerification(payload.institution, payload.studentId, payload.verificationImageUrl);
      navigation.navigate('OnboardingStep9');
    } catch (err) {
      feedbackStore.show({ type: 'error', title: 'Error', message: 'Could not save verification info. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    cacheVerification(institution.trim(), studentId.trim());
    await saveDraft();
    Alert.alert('Draft saved', 'Your progress has been saved.');
  };

  const imageUri = localVerificationImageUri || cachedVerificationImageUrl;

  return (
    <OnboardingLayout
      currentStep={8}
      onBack={() => navigation.navigate('OnboardingStep7')}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      disableNext={!institution || !studentId || (!localVerificationImageUri && !cachedVerificationImageUrl)}
      isNextLoading={isSaving}
      nextLabel="Save & Continue"
    >
      <Text className="mb-2 font-heading text-xl font-bold text-gray-900">Student Verification</Text>
      <Text className="mb-4 text-sm text-gray-500">We need to verify your student status.</Text>

      <Input
        label="Institution"
        placeholder="e.g. University of Ghana"
        value={institution}
        onChangeText={(val) => { setInstitution(val); setErrors((prev) => ({ ...prev, institution: '' })); }}
        error={errors.institution}
      />

      <Input
        label="Student ID Number"
        placeholder="e.g. 10991234"
        value={studentId}
        onChangeText={(val) => { setStudentId(val); setErrors((prev) => ({ ...prev, studentId: '' })); }}
        error={errors.studentId}
      />

      <View className="mt-4">
        <Text className="mb-2 text-sm font-medium text-gray-700">Verification Photo</Text>
        <Text className="mb-3 text-xs leading-5 text-gray-500">
          Hold your student ID beside your face and take a selfie.{'\n\n'}
          {'\u2022'} Face must be visible{'\n'}
          {'\u2022'} Student ID must be readable{'\n'}
          {'\u2022'} Good lighting required
        </Text>

        {imageUri ? (
          <View className="items-center">
            <Image source={{ uri: imageUri }} className="h-64 w-full rounded-lg bg-gray-100" resizeMode="contain" />
            <Pressable onPress={handleCapture} className="mt-3 flex-row items-center">
              <RotateCcw size={16} color={colors.primary} />
              <Text className="ml-2 text-sm font-medium text-primary">Retake Photo</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={handleCapture} className="h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
            <Camera size={36} color={colors.gray400} />
            <Text className="mt-2 text-sm font-medium text-gray-500">Tap to open camera</Text>
          </Pressable>
        )}

        {errors.image && <Text className="mt-1 text-xs text-red-500">{errors.image}</Text>}
      </View>
    </OnboardingLayout>
  );
};