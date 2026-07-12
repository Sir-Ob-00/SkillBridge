import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingFlowParamList } from './onboarding.types';
import { OnboardingStatus } from '@app-types/index';
import { PendingReviewScreen } from './screens/PendingReviewScreen';
import { UnderReviewScreen } from './screens/UnderReviewScreen';
import { RejectedScreen } from './screens/RejectedScreen';
import { ChangesRequestedScreen } from './screens/ChangesRequestedScreen';
import { OnboardingNavigator } from './OnboardingNavigator';
import { onboardingApi } from './services/onboarding.api';
import { useOnboardingStore } from './store/onboarding.store';

const Stack = createNativeStackNavigator<OnboardingFlowParamList>();

interface Props {
  onboardingStatus: OnboardingStatus;
}

const initialRoute = (status: OnboardingStatus): keyof OnboardingFlowParamList => {
  switch (status) {
    case 'PENDING_PROFILE':
      return 'OnboardingSteps';
    case 'PENDING_REVIEW':
      return 'PendingReview';
    case 'UNDER_REVIEW':
      return 'UnderReview';
    case 'CHANGES_REQUESTED':
      return 'ChangesRequested';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'OnboardingSteps';
  }
};

export const OnboardingFlowNavigator: React.FC<Props> = ({ onboardingStatus }) => {
  const setCompletedSteps = useOnboardingStore((s) => s.setCompletedSteps);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await onboardingApi.getOnboardingStatus();
        setCompletedSteps(result.completedSteps);
      } catch {
        // Use empty completed steps as fallback
      }
    };
    if (onboardingStatus === 'PENDING_PROFILE' || onboardingStatus === 'CHANGES_REQUESTED') {
      void fetchStatus();
    }
  }, [onboardingStatus, setCompletedSteps]);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute(onboardingStatus)}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="PendingReview" component={PendingReviewScreen} />
      <Stack.Screen name="UnderReview" component={UnderReviewScreen} />
      <Stack.Screen name="Rejected" component={RejectedScreen} />
      <Stack.Screen name="ChangesRequested" component={ChangesRequestedScreen} />
      <Stack.Screen name="OnboardingSteps" component={OnboardingNavigator} />
    </Stack.Navigator>
  );
};