import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { XCircle } from 'lucide-react-native';
import { OnboardingFlowParamList } from '../onboarding.types';
import { StatusScreen } from '../components/StatusScreen';
import { colors } from '@shared/ui/colors';
import { useAuth } from '@hooks/useAuth';
import { onboardingApi } from '../services/onboarding.api';

type Props = NativeStackScreenProps<OnboardingFlowParamList, 'Rejected'>;

export const RejectedScreen: React.FC<Props> = ({ navigation }) => {
  const { logout } = useAuth();
  const [rejectionReason, setRejectionReason] = useState(
    'Your application did not meet our verification requirements. Please ensure all provided information is accurate and try again.'
  );

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const result = await onboardingApi.getOnboardingStatus();
      if (result.rejectionReason) {
        setRejectionReason(result.rejectionReason);
      }
    } catch {
      // keep default message
    }
  };

  return (
    <StatusScreen
      icon={
        <View className="h-20 w-20 items-center justify-center rounded-full bg-danger/10">
          <XCircle size={40} color={colors.danger} />
        </View>
      }
      title="Application not approved"
      subtitle="We were unable to verify your information"
      message={rejectionReason}
      actionLabel="Continue Editing"
      onAction={() => navigation.navigate('OnboardingSteps')}
      secondaryActionLabel="Sign Out"
      onSecondaryAction={logout}
    />
  );
};