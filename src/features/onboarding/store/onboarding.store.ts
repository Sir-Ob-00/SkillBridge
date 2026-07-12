import { create } from 'zustand';
import {
  OnboardingDraft,
  OnboardingStepId,
  AvailabilitySlot,
  OnboardingServiceItem,
  PortfolioItemData,
} from '@app-types/index';
import { secureStorage } from '@services/storage/secureStorage';
import { COMPLETED_STEP_ORDER, STEP_TO_COMPLETED_KEY } from '../onboarding.types';

const ONBOARDING_DRAFT_KEY = 'skillbridge.onboardingDraft';

interface OnboardingState {
  currentStep: OnboardingStepId;
  payload: Record<string, unknown>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  completedSteps: string[];

  localProfileImageUri: string | null;
  localPortfolioUris: string[];
  localVerificationImageUri: string | null;

  cachedBusinessName: string;
  cachedBio: string;
  cachedLocation: string;
  cachedPricingFrom: number;
  cachedPhone: string;
  cachedProfileImageUrl: string | null;
  cachedCategoryIds: string[];
  cachedSkillIds: string[];
  cachedServices: OnboardingServiceItem[];
  cachedSlots: AvailabilitySlot[];
  cachedPortfolioItems: PortfolioItemData[];
  cachedInstitution: string;
  cachedStudentId: string;
  cachedVerificationImageUrl: string | null;

  setCurrentStep: (step: OnboardingStepId) => void;
  setCompletedSteps: (steps: string[]) => void;

  isStepAccessible: (step: OnboardingStepId) => boolean;

  cachePersonalInfo: (phone: string, profileImageUrl?: string) => void;
  cacheBusinessInfo: (businessName: string, bio: string, location: string, pricingFrom: number) => void;
  cacheCategoryIds: (ids: string[]) => void;
  cacheSkillIds: (ids: string[]) => void;
  cacheServices: (items: OnboardingServiceItem[]) => void;
  cacheSlots: (slots: AvailabilitySlot[]) => void;
  addLocalPortfolioUri: (uri: string) => void;
  removeLocalPortfolioUri: (index: number) => void;
  reorderLocalPortfolio: (fromIndex: number, toIndex: number) => void;
  setLocalProfileImageUri: (uri: string | null) => void;
  setLocalVerificationImageUri: (uri: string | null) => void;
  cacheVerification: (institution: string, studentId: string, verificationImageUrl?: string) => void;
  cachePortfolioItem: (item: PortfolioItemData) => void;
  clearPortfolioItems: () => void;

  loadDraft: () => Promise<void>;
  saveDraft: () => Promise<void>;
  clearDraft: () => Promise<void>;
  setSubmitting: (value: boolean) => void;
  setError: (error: string | null) => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentStep: 1,
  payload: {},
  isLoading: false,
  isSubmitting: false,
  error: null,
  completedSteps: [],
  localPortfolioUris: [],
  localVerificationImageUri: null,
  localProfileImageUri: null,
  cachedBusinessName: '',
  cachedBio: '',
  cachedLocation: '',
  cachedPricingFrom: 0,
  cachedPhone: '',
  cachedProfileImageUrl: null,
  cachedCategoryIds: [],
  cachedSkillIds: [],
  cachedServices: [],
  cachedSlots: [],
  cachedPortfolioItems: [],
  cachedInstitution: '',
  cachedStudentId: '',
  cachedVerificationImageUrl: null,

  setCurrentStep: (step) => set({ currentStep: step }),
  setCompletedSteps: (steps) => set({ completedSteps: steps }),

  isStepAccessible: (step) => {
    const { completedSteps } = get();
    if (step === 1) return true;
    const prereqStep = (step - 1) as OnboardingStepId;
    const prereqKey = STEP_TO_COMPLETED_KEY[prereqStep];
    if (!prereqKey) return false;
    return completedSteps.includes(prereqKey);
  },

  cachePersonalInfo: (phone, profileImageUrl) =>
    set({ cachedPhone: phone, cachedProfileImageUrl: profileImageUrl ?? null }),

  cacheBusinessInfo: (businessName, bio, location, pricingFrom) =>
    set({ cachedBusinessName: businessName, cachedBio: bio, cachedLocation: location, cachedPricingFrom: pricingFrom }),

  cacheCategoryIds: (ids) => set({ cachedCategoryIds: ids }),
  cacheSkillIds: (ids) => set({ cachedSkillIds: ids }),
  cacheServices: (items) => set({ cachedServices: items }),
  cacheSlots: (slots) => set({ cachedSlots: slots }),

  addLocalPortfolioUri: (uri) =>
    set((state) => ({
      localPortfolioUris: [...state.localPortfolioUris, uri],
    })),

  removeLocalPortfolioUri: (index) =>
    set((state) => ({
      localPortfolioUris: state.localPortfolioUris.filter((_, i) => i !== index),
    })),

  reorderLocalPortfolio: (fromIndex, toIndex) =>
    set((state) => {
      const items = [...state.localPortfolioUris];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      return { localPortfolioUris: items };
    }),

  setLocalProfileImageUri: (uri) =>
    set({ localProfileImageUri: uri }),

  setLocalVerificationImageUri: (uri) =>
    set({ localVerificationImageUri: uri }),

  cacheVerification: (institution, studentId, verificationImageUrl) =>
    set({ cachedInstitution: institution, cachedStudentId: studentId, cachedVerificationImageUrl: verificationImageUrl ?? null }),

  cachePortfolioItem: (item) =>
    set((state) => ({ cachedPortfolioItems: [...state.cachedPortfolioItems, item] })),

  clearPortfolioItems: () => set({ cachedPortfolioItems: [] }),

  loadDraft: async () => {
    set({ isLoading: true });
    try {
      const draft = await secureStorage.getItem<OnboardingDraft>(ONBOARDING_DRAFT_KEY);
      if (draft) {
        set({
          currentStep: draft.currentStep,
          payload: draft.application,
        });
      }
    } catch {
      // ignore
    } finally {
      set({ isLoading: false });
    }
  },

  saveDraft: async () => {
    const { currentStep, payload } = get();
    const draft: OnboardingDraft = {
      currentStep,
      application: payload,
      updatedAt: new Date().toISOString(),
    };
    await secureStorage.setItem(ONBOARDING_DRAFT_KEY, draft);
  },

  clearDraft: async () => {
    await secureStorage.removeItem(ONBOARDING_DRAFT_KEY);
    set({
      currentStep: 1,
      payload: {},
      completedSteps: [],
      localPortfolioUris: [],
      localVerificationImageUri: null,
      localProfileImageUri: null,
      cachedBusinessName: '',
      cachedBio: '',
      cachedLocation: '',
      cachedPricingFrom: 0,
      cachedPhone: '',
      cachedProfileImageUrl: null,
      cachedCategoryIds: [],
      cachedSkillIds: [],
      cachedServices: [],
      cachedSlots: [],
      cachedPortfolioItems: [],
      cachedInstitution: '',
      cachedStudentId: '',
      cachedVerificationImageUrl: null,
    });
  },

  setSubmitting: (value) => set({ isSubmitting: value }),
  setError: (error) => set({ error }),
}));