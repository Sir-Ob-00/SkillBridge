import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingFlowParamList, COMPLETED_STEP_ORDER } from './onboarding.types';
import { OnboardingStepId, OnboardingStatus } from '@app-types/index';
import { PendingReviewScreen } from './screens/PendingReviewScreen';
import { UnderReviewScreen } from './screens/UnderReviewScreen';
import { SubmissionSuccessScreen } from './screens/SubmissionSuccessScreen';
import { RejectedScreen } from './screens/RejectedScreen';
import { ChangesRequestedScreen } from './screens/ChangesRequestedScreen';
import { OnboardingNavigator } from './OnboardingNavigator';
import { onboardingApi } from './services/onboarding.api';
import { useOnboardingStore } from './store/onboarding.store';
import { useAuthStore } from '@store/auth.store';

const Stack = createNativeStackNavigator<OnboardingFlowParamList>();

interface Props {
  onboardingStatus: OnboardingStatus;
}

const initialRoute = (status: OnboardingStatus): keyof OnboardingFlowParamList => {
  switch (status) {
    case 'PENDING_PROFILE':
      return 'OnboardingSteps';
    case 'PENDING_REVIEW':
    case 'UNDER_REVIEW':
      return 'SubmissionSuccess';
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
      if (onboardingStatus === 'PENDING_PROFILE' || onboardingStatus === 'CHANGES_REQUESTED') {
        try {
          const result = await onboardingApi.getOnboardingStatus();
          setCompletedSteps(result.completedSteps);

          // If server says we've progressed past PENDING_PROFILE/CHANGES_REQUESTED,
          // update the auth store user so RootNavigator re-evaluates and shows
          // the correct screen (dashboard for ACTIVE, submission for PENDING_REVIEW, etc.)
          if (result.status !== 'PENDING_PROFILE' && result.status !== 'CHANGES_REQUESTED') {
            const currentUser = useAuthStore.getState().user;
            if (currentUser) {
              useAuthStore.getState().setUser({ ...currentUser, onboardingStatus: result.status });
            }
            return;
          }

          if (result.completedSteps.length > 0) {
            await loadDraft();
            const state = useOnboardingStore.getState();

            const allStepsCompleted = COMPLETED_STEP_ORDER.every(s => result.completedSteps.includes(s));

            if (allStepsCompleted) {
              console.log('[OnboardingFlow] all steps completed, going to step 9');
              setCurrentStep(9);
            } else {
              let dataCorruptStep: OnboardingStepId | null = null;
              if (result.completedSteps.includes('categories') && state.cachedCategoryIds.length === 0) {
                dataCorruptStep = 3;
              } else if (result.completedSteps.includes('skills') && state.cachedSkillIds.length === 0) {
                dataCorruptStep = 4;
              } else if (result.completedSteps.includes('services') && state.cachedServices.length === 0) {
                dataCorruptStep = 5;
              }

              if (dataCorruptStep) {
                console.log('[OnboardingFlow] data corrupt, redirecting to step', dataCorruptStep);
                setCurrentStep(dataCorruptStep);
              } else {
                const nextStep = (() => {
                  for (let i = 0; i < COMPLETED_STEP_ORDER.length; i++) {
                    if (!result.completedSteps.includes(COMPLETED_STEP_ORDER[i])) {
                      return (i + 1) as OnboardingStepId;
                    }
                  }
                  return 9 as OnboardingStepId;
                })();
                console.log('[OnboardingFlow] result.completedSteps:', result.completedSteps, 'nextStep:', nextStep);
                setCurrentStep(nextStep);
              }
            }
          } else {
            console.log('[OnboardingFlow] no completed steps, starting at step 1');
            setCurrentStep(1);
          }
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
      <Stack.Screen name="SubmissionSuccess" component={SubmissionSuccessScreen} />
      <Stack.Screen name="Rejected" component={RejectedScreen} />
      <Stack.Screen name="ChangesRequested" component={ChangesRequestedScreen} />
      <Stack.Screen name="OnboardingSteps" component={OnboardingNavigator} />
    </Stack.Navigator>
  );
};