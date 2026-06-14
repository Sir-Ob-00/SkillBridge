import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react-native';
import { AuthStackParamList } from '../auth.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Input } from '@shared/components';
import { colors } from '@shared/ui/colors';
import { validateEmail } from '@utils/validateEmail';
import { authApi } from '../services/auth.api';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError(undefined);
    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      Alert.alert('Something went wrong', 'Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable keyboardAvoiding>
      <Pressable onPress={() => navigation.goBack()} className="mt-4 mb-6 w-10 active:opacity-70">
        <ArrowLeft size={24} color={colors.gray800} />
      </Pressable>

      <View className="mb-10">
        <View className="mb-6 h-16 w-16 items-center justify-center rounded-2xl bg-secondary/20">
          <KeyRound size={28} color={colors.secondary} />
        </View>
        <Text className="font-heading text-4xl font-bold text-gray-900">
          Reset password
        </Text>
        <Text className="mt-3 text-base text-gray-500 leading-6">
          Enter the email associated with your account and we'll send a reset
          link.
        </Text>
      </View>

      {sent ? (
        <View className="rounded-2xl bg-success/10 p-4">
          <Text className="text-base font-semibold text-success">
            Check your inbox
          </Text>
          <Text className="mt-1 text-sm text-gray-600">
            If an account exists for {email}, a reset link is on its way.
          </Text>
        </View>
      ) : (
        <>
          <Input
            label="Email"
            placeholder="you@university.edu"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            error={error}
            leftIcon={<Mail size={18} color={colors.gray400} />}
          />

          <Button
            label="Send reset link"
            onPress={handleSubmit}
            isLoading={isLoading}
            fullWidth
            size="lg"
          />
        </>
      )}
    </ScreenWrapper>
  );
};
