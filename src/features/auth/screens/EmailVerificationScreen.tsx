import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MailCheck } from 'lucide-react-native';
import { AuthStackParamList } from '../auth.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Input } from '@shared/components';
import { colors } from '@shared/ui/colors';
import { authApi } from '../services/auth.api';
import { useFeedbackStore } from '@store/feedback.store';
import { handleAuthError } from '@utils/handleAuthError';

const RESEND_COOLDOWN = 60;

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailVerification'>;

export const EmailVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email, role } = route.params;
  const feedbackStore = useFeedbackStore();

  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    startCountdown();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCountdown = () => {
    setCountdown(RESEND_COOLDOWN);
    setCanResend(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = async () => {
    if (otp.length < 4) {
      feedbackStore.show({
        type: 'error',
        title: 'Invalid OTP',
        message: 'Please enter the complete verification code.',
      });
      return;
    }

    setIsVerifying(true);
    try {
      await authApi.verifyEmail({ email, otp });
      feedbackStore.show({
        type: 'success',
        title: 'Email verified!',
        message: 'Your email has been verified. You can now sign in.',
      });
      navigation.navigate('Login', { role });
    } catch (err) {
      feedbackStore.show(handleAuthError(err));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsResending(true);
    try {
      await authApi.resendEmailOtp({ email });
      startCountdown();
      feedbackStore.show({
        type: 'success',
        title: 'OTP resent',
        message: 'A new verification code has been sent to your email.',
      });
    } catch (err) {
      feedbackStore.show(handleAuthError(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <ScreenWrapper scrollable keyboardAvoiding>
      <View className="flex-1 items-center justify-center px-4">
        <View className="mb-8 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <MailCheck size={40} color={colors.primary} />
        </View>

        <Text className="mb-2 text-center font-heading text-2xl font-bold text-gray-900">
          Verify your email
        </Text>
        <Text className="mb-2 text-center text-base text-gray-500">
          Enter the 6-digit code sent to
        </Text>
        <Text className="mb-6 text-center font-bold text-gray-900">{email}</Text>

        <View className="mb-4 w-full">
          <Input
            label="Verification Code"
            placeholder="000000"
            value={otp}
            onChangeText={(val) => setOtp(val.replace(/[^0-9]/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />
        </View>

        <Button
          label="Verify Email"
          onPress={handleVerify}
          isLoading={isVerifying}
          disabled={otp.length < 6}
          fullWidth
          size="lg"
        />

        <View className="mt-6 items-center">
          {canResend ? (
            <Button
              label="Resend Code"
              onPress={handleResend}
              variant="ghost"
              isLoading={isResending}
              size="sm"
            />
          ) : (
            <Text className="text-sm text-gray-400">
              Resend code in {countdown}s
            </Text>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};