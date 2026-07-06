import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Phone, ArrowRight } from 'lucide-react-native';
import { ScreenWrapper } from '@shared/layout';
import { Button, Input } from '@shared/components';
import { colors } from '@shared/ui/colors';
import { useAuthStore } from '@store/auth.store';
import { useUserStore } from '@store/user.store';
import { useFeedbackStore } from '@store/feedback.store';
import { validatePhone } from '@utils/validateEmail';
import { handleAuthError } from '@utils/handleAuthError';

export const CompleteProfileScreen: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const isLoading = useUserStore((state) => state.isLoading);
  const feedbackStore = useFeedbackStore();

  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | undefined>();

  const handleSubmit = async () => {
    if (!validatePhone(phone)) {
      setPhoneError('Enter a valid phone number.');
      return;
    }
    setPhoneError(undefined);

    try {
      await updateProfile({ phone: phone.trim() });
    } catch (err) {
      feedbackStore.show(handleAuthError(err));
    }
  };

  return (
    <ScreenWrapper scrollable keyboardAvoiding>
      <View className="mt-6 mb-10">
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Phone size={28} color={colors.primary} />
        </View>
        <Text className="font-heading text-4xl font-bold text-gray-900">
          Complete your profile
        </Text>
        <Text className="mt-3 text-base text-gray-500">
          Welcome{user?.name ? `, ${user.name}` : ''}! Please add your phone number to continue.
        </Text>
      </View>

      <Input
        label="Phone number"
        placeholder="0XX XXX XXXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={(val) => {
          setPhone(val);
          setPhoneError(undefined);
        }}
        error={phoneError}
        leftIcon={<Phone size={18} color={colors.gray400} />}
      />

      <Button
        label="Continue"
        onPress={handleSubmit}
        isLoading={isLoading}
        fullWidth
        size="lg"
        rightIcon={<ArrowRight size={18} color="#fff" />}
      />
    </ScreenWrapper>
  );
};
