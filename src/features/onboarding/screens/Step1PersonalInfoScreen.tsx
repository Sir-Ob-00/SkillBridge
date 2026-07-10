import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Phone } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../onboarding.types';
import { OnboardingLayout } from '../components/OnboardingLayout';
import { Input } from '@shared/components';
import { useOnboardingStore } from '../store/onboarding.store';
import { useAuth } from '@hooks/useAuth';
import { colors } from '@shared/ui/colors';
import { validatePhone } from '@utils/validateEmail';
import { uploadService } from '@services/upload.service';
import { onboardingApi } from '../services/onboarding.api';
import { useFeedbackStore } from '@store/feedback.store';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingStep1'>;

export const Step1PersonalInfoScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const {
    cachePersonalInfo,
    saveDraft,
    cachedPhone,
    cachedProfileImageUrl,
    localProfileImageUri,
    setLocalProfileImageUri,
  } = useOnboardingStore();
  const feedbackStore = useFeedbackStore();

  const [phone, setPhone] = useState(cachedPhone || user?.phone || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Allow access to your photo library to add a profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return;
    setLocalProfileImageUri(result.assets[0].uri);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!validatePhone(phone)) errs.phone = 'Enter a valid phone number.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      let profileImageUrl = cachedProfileImageUrl || undefined;
      if (localProfileImageUri && !profileImageUrl) {
        profileImageUrl = await uploadService.uploadImage(localProfileImageUri, 'skillbridge/profile');
      }

      const payload: { phone: string; profileImageUrl?: string } = { phone: phone.trim() };
      if (profileImageUrl) payload.profileImageUrl = profileImageUrl;

      await onboardingApi.patchPersonalInfo(payload);
      cachePersonalInfo(payload.phone, payload.profileImageUrl);
      navigation.navigate('OnboardingStep2');
    } catch (err) {
      feedbackStore.show({
        type: 'error',
        title: 'Error',
        message: 'Could not save personal info. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    cachePersonalInfo(phone.trim());
    await saveDraft();
    Alert.alert('Draft saved', 'Your progress has been saved.');
  };

  return (
    <OnboardingLayout
      currentStep={1}
      onNext={handleNext}
      onSaveDraft={handleSaveDraft}
      disableNext={!validatePhone(phone)}
      isNextLoading={isSaving}
    >
      <Text className="mb-4 font-heading text-xl font-bold text-gray-900">Personal Information</Text>

      <Pressable onPress={handlePickImage} className="mb-6 items-center self-center">
        <View className="relative">
          {localProfileImageUri ? (
            <Image
              source={{ uri: localProfileImageUri }}
              className="h-24 w-24 rounded-full bg-gray-200"
              resizeMode="cover"
            />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <Camera size={28} color={colors.gray400} />
            </View>
          )}
          <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary shadow-sm">
            <Camera size={14} color="#ffffff" />
          </View>
        </View>
        <Text className="mt-2 text-sm font-medium text-primary">Profile Picture</Text>
      </Pressable>

      <Input
        label="Phone Number"
        placeholder="0XX XXX XXXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(val) => {
          setPhone(val);
          setErrors((prev) => ({ ...prev, phone: '' }));
        }}
        error={errors.phone}
        leftIcon={<Phone size={18} color={colors.gray400} />}
      />

      <Text className="mt-4 text-sm text-gray-500">
        Your name ({user?.name}) will be used from your account settings.
      </Text>
    </OnboardingLayout>
  );
};