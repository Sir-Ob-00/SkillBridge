import { OnboardingStatus, OnboardingStepId } from '@app-types/index';

export interface OnboardingStep {
  id: OnboardingStepId;
  label: string;
  description: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 1, label: 'Personal', description: 'Personal Information' },
  { id: 2, label: 'Business', description: 'Business Information' },
  { id: 3, label: 'Category', description: 'Category' },
  { id: 4, label: 'Skill', description: 'Skill' },
  { id: 5, label: 'Services', description: 'Services & Pricing' },
  { id: 6, label: 'Availability', description: 'Availability' },
  { id: 7, label: 'Portfolio', description: 'Portfolio' },
  { id: 8, label: 'Verification', description: 'Student Verification' },
  { id: 9, label: 'Review', description: 'Review & Submit' },
];

export type OnboardingStackParamList = {
  OnboardingStep1: undefined;
  OnboardingStep2: undefined;
  OnboardingStep3: undefined;
  OnboardingStep4: undefined;
  OnboardingStep5: undefined;
  OnboardingStep6: undefined;
  OnboardingStep7: undefined;
  OnboardingStep8: undefined;
  OnboardingStep9: undefined;
};

export type OnboardingFlowParamList = {
  PendingReview: undefined;
  UnderReview: undefined;
  SubmissionSuccess: undefined;
  Rejected: undefined;
  ChangesRequested: undefined;
  OnboardingSteps: undefined;
};

export const STEP_ROUTES: Record<number, keyof OnboardingStackParamList> = {
  1: 'OnboardingStep1',
  2: 'OnboardingStep2',
  3: 'OnboardingStep3',
  4: 'OnboardingStep4',
  5: 'OnboardingStep5',
  6: 'OnboardingStep6',
  7: 'OnboardingStep7',
  8: 'OnboardingStep8',
  9: 'OnboardingStep9',
};

export const COMPLETED_STEP_ORDER: string[] = [
  'personal',
  'business',
  'categories',
  'skills',
  'services',
  'availability',
  'portfolio',
  'verification',
];

export const STEP_TO_COMPLETED_KEY: Record<OnboardingStepId, string> = {
  1: 'personal',
  2: 'business',
  3: 'categories',
  4: 'skills',
  5: 'services',
  6: 'availability',
  7: 'portfolio',
  8: 'verification',
  9: 'review',
};