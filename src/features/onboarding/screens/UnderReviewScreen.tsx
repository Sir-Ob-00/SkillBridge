import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search } from 'lucide-react-native';
import { OnboardingFlowParamList } from '../onboarding.types';
import { StatusScreen } from '../components/StatusScreen';
import { colors } from '@shared/ui/colors';
import { useAuth } from '@hooks/useAuth';
import { onboardingApi } from '../services/onboarding.api';
import { useAuthStore } from '@store/auth.store';

type Props = NativeStackScreenProps<OnboardingFlowParamList, 'UnderReview'>;

export const UnderReviewScreen: React.FC<Props> = () => {
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
      animated
      icon={
        <View className="h-20 w-20 items-center justify-center rounded-full bg-warning/10">
          <Search size={40} color={colors.warning} />
        </View>
      }
      title="Application under review"
      subtitle="Our team is working on it"
      message="Your application is currently being reviewed by our team. We carefully evaluate every application to maintain quality on SkillBridge. You'll receive a notification once a decision has been made."
      actionLabel="Check Status"
      onAction={isChecking ? undefined : handleCheckStatus}
      secondaryActionLabel="Sign Out"
      onSecondaryAction={logout}
    />
  );
};