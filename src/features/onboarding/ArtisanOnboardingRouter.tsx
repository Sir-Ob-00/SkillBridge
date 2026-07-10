import React from 'react';
import { OnboardingStatus } from '@app-types/index';
import { OnboardingFlowNavigator } from './OnboardingFlowNavigator';

interface Props {
  onboardingStatus: OnboardingStatus;
}

export const ArtisanOnboardingRouter: React.FC<Props> = ({ onboardingStatus }) => {
  return <OnboardingFlowNavigator onboardingStatus={onboardingStatus} />;
};
