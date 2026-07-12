import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingFlowParamList, COMPLETED_STEP_ORDER } from './onboarding.types';
import { OnboardingStepId, OnboardingStatus } from '@app-types/index';
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
  const setCurrentStep = useOnboardingStore((s) => s.setCurrentStep);
  const loadDraft = useOnboardingStore((s) => s.loadDraft);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadDraft();

      if (onboardingStatus === 'PENDING_PROFILE' || onboardingStatus === 'CHANGES_REQUESTED') {
        try {
          const result = await onboardingApi.getOnboardingStatus();
          setCompletedSteps(result.completedSteps);

          const nextStep = (() => {
            for (let i = 0; i < COMPLETED_STEP_ORDER.length; i++) {
              if (!result.completedSteps.includes(COMPLETED_STEP_ORDER[i])) {
                return (i + 1) as OnboardingStepId;
              }
            }
            return 9 as OnboardingStepId;
          })();
          setCurrentStep(nextStep);
        } catch {
          // fallback to step 1
        }
      }

      setIsReady(true);
    };
    void init();
  }, [onboardingStatus, setCompletedSteps, setCurrentStep, loadDraft]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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