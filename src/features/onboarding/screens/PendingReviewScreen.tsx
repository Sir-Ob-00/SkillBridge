import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ClipboardCheck } from 'lucide-react-native';
import { OnboardingFlowParamList } from '../onboarding.types';
import { StatusScreen } from '../components/StatusScreen';
import { colors } from '@shared/ui/colors';
import { useAuth } from '@hooks/useAuth';
import { onboardingApi } from '../services/onboarding.api';
import { useAuthStore } from '@store/auth.store';

type Props = NativeStackScreenProps<OnboardingFlowParamList, 'PendingReview'>;

export const PendingReviewScreen: React.FC<Props> = () => {
  const { logout } = useAuth();
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      const result = await onboardingApi.getOnboardingStatus();
      if (user) {
        setUser({ ...user, onboardingStatus: result.status });
      }
    } catch {
      // ignore
    } finally {
      setIsChecking(false);
    }
  }, [user, setUser]);

  return (
    <StatusScreen
      icon={
        <View className="h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <ClipboardCheck size={40} color={colors.success} />
        </View>
      }
      title="Application submitted!"
      subtitle="We've received your application"
      message="Thank you for submitting your artisan application. Our team is reviewing your information. This usually takes 1-3 business days. We'll notify you once your application has been reviewed."
      actionLabel="Check Status"
      onAction={isChecking ? undefined : handleCheckStatus}
      secondaryActionLabel="Sign Out"
      onSecondaryAction={logout}
    />
  );
};