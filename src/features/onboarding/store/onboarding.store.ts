import { create } from 'zustand';
import {
  OnboardingDraft,
  OnboardingStepId,
  AvailabilitySlot,
  OnboardingServiceItem,
  PortfolioItemData,
} from '@app-types/index';
import { secureStorage } from '@services/storage/secureStorage';
import { useAuthStore } from '@store/auth.store';
import { logger } from '@utils/logger';
import { COMPLETED_STEP_ORDER, STEP_TO_COMPLETED_KEY } from '../onboarding.types';
import { onboardingApi, DraftData } from '../services/onboarding.api';

const getDraftKey = (): string => {
  const user = useAuthStore.getState().user;
  return `skillbridge.onboardingDraft.${user?.id ?? 'anonymous'}`;
};

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
  completeStep: (stepKey: string) => void;

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

  completeStep: (stepKey) =>
    set((state) => ({
      completedSteps: state.completedSteps.includes(stepKey)
        ? state.completedSteps
        : [...state.completedSteps, stepKey],
    })),

  loadDraft: async () => {
    set({ isLoading: true });
    try {
      let loaded = false;

      // 1. Server is canonical source
      try {
        const serverDraft = await onboardingApi.getDraft();
        console.log('[loadDraft] serverDraft:', JSON.stringify(serverDraft));
        if (serverDraft) {
          set({
            currentStep: serverDraft.currentStep as OnboardingStepId,
            cachedPhone: serverDraft.phone ?? '',
            cachedProfileImageUrl: serverDraft.profileImageUrl ?? null,
            cachedBusinessName: serverDraft.businessName ?? '',
            cachedBio: serverDraft.bio ?? '',
            cachedLocation: serverDraft.location ?? '',
            cachedPricingFrom: serverDraft.pricingFrom ?? 0,
            cachedCategoryIds: serverDraft.categoryIds ?? [],
            cachedSkillIds: serverDraft.skillIds ?? [],
            cachedServices: serverDraft.services ?? [],
            cachedSlots: serverDraft.slots ?? [],
            cachedPortfolioItems: serverDraft.portfolioItems ?? [],
            cachedInstitution: serverDraft.institution ?? '',
            cachedStudentId: serverDraft.studentId ?? '',
            cachedVerificationImageUrl: serverDraft.verificationImageUrl ?? null,
          });
          loaded = true;
        }
      } catch (err) {
        logger.warn('[OnboardingStore] GET /draft failed, falling back to AsyncStorage', err);
      }

      // 2. Fallback: AsyncStorage
      if (!loaded) {
        const localDraft = await secureStorage.getItem<OnboardingDraft>(getDraftKey());
        console.log('[loadDraft] AsyncStorage fallback localDraft:', JSON.stringify(localDraft));
        if (localDraft) {
          set({
            currentStep: localDraft.currentStep,
            payload: localDraft.application,
            cachedPhone: localDraft.cachedPhone ?? '',
            cachedProfileImageUrl: localDraft.cachedProfileImageUrl ?? null,
            cachedBusinessName: localDraft.cachedBusinessName ?? '',
            cachedBio: localDraft.cachedBio ?? '',
            cachedLocation: localDraft.cachedLocation ?? '',
            cachedPricingFrom: localDraft.cachedPricingFrom ?? 0,
            cachedCategoryIds: localDraft.cachedCategoryIds ?? [],
            cachedSkillIds: localDraft.cachedSkillIds ?? [],
            cachedServices: localDraft.cachedServices ?? [],
            cachedSlots: localDraft.cachedSlots ?? [],
            cachedPortfolioItems: localDraft.cachedPortfolioItems ?? [],
            cachedInstitution: localDraft.cachedInstitution ?? '',
            cachedStudentId: localDraft.cachedStudentId ?? '',
            cachedVerificationImageUrl: localDraft.cachedVerificationImageUrl ?? null,
          });
        }
      }

      // 3. Merge: if server draft was loaded but missing non-essential fields,
      //    fill them in from AsyncStorage
      if (loaded) {
        const state = get();
        const localDraft = await secureStorage.getItem<OnboardingDraft>(getDraftKey());
        if (localDraft) {
          const updates: Partial<OnboardingState> = {};
          if (!state.cachedCategoryIds?.length && localDraft.cachedCategoryIds?.length) {
            console.log('[loadDraft] merging cachedCategoryIds from AsyncStorage:', localDraft.cachedCategoryIds);
            updates.cachedCategoryIds = localDraft.cachedCategoryIds;
          }
          if (!state.cachedSkillIds?.length && localDraft.cachedSkillIds?.length) {
            console.log('[loadDraft] merging cachedSkillIds from AsyncStorage:', localDraft.cachedSkillIds);
            updates.cachedSkillIds = localDraft.cachedSkillIds;
          }
          if (!state.cachedServices?.length && localDraft.cachedServices?.length) {
            console.log('[loadDraft] merging cachedServices from AsyncStorage:', localDraft.cachedServices);
            updates.cachedServices = localDraft.cachedServices;
          }
          if (!state.cachedSlots?.length && localDraft.cachedSlots?.length) {
            console.log('[loadDraft] merging cachedSlots from AsyncStorage:', localDraft.cachedSlots);
            updates.cachedSlots = localDraft.cachedSlots;
          }
          if (!state.cachedPortfolioItems?.length && localDraft.cachedPortfolioItems?.length) {
            console.log('[loadDraft] merging cachedPortfolioItems from AsyncStorage:', localDraft.cachedPortfolioItems);
            updates.cachedPortfolioItems = localDraft.cachedPortfolioItems;
          }
          if (Object.keys(updates).length > 0) {
            console.log('[loadDraft] applying merged updates:', Object.keys(updates));
            set(updates);
          } else {
            console.log('[loadDraft] no fields needed merge');
          }
        } else {
          console.log('[loadDraft] no AsyncStorage draft for merge');
        }
      }
    } catch (err) {
      logger.error('[OnboardingStore] loadDraft failed', err);
    } finally {
      set({ isLoading: false });
    }
  },

  saveDraft: async () => {
    const {
      currentStep, payload, completedSteps,
      cachedPhone, cachedProfileImageUrl,
      cachedBusinessName, cachedBio, cachedLocation, cachedPricingFrom,
      cachedCategoryIds, cachedSkillIds, cachedServices,
      cachedSlots, cachedPortfolioItems,
      cachedInstitution, cachedStudentId, cachedVerificationImageUrl,
    } = get();

    // Server draft (canonical source)
    const serverDraft: DraftData = {
      currentStep,
      completedSteps,
      phone: cachedPhone || null,
      profileImageUrl: cachedProfileImageUrl || undefined,
      businessName: cachedBusinessName || undefined,
      bio: cachedBio || null,
      location: cachedLocation || null,
      pricingFrom: cachedPricingFrom ?? null,
      categoryIds: cachedCategoryIds,
      skillIds: cachedSkillIds,
      services: cachedServices,
      slots: cachedSlots,
      portfolioItems: cachedPortfolioItems,
      institution: cachedInstitution || undefined,
      studentId: cachedStudentId || undefined,
      verificationImageUrl: cachedVerificationImageUrl || undefined,
    };

    console.log('[saveDraft] categoryIds:', cachedCategoryIds, 'skillIds:', cachedSkillIds, 'services.length:', cachedServices.length);

    try {
      await onboardingApi.putDraft(serverDraft);
    } catch (err) {
      logger.warn('[OnboardingStore] PUT /draft failed, saved to AsyncStorage only', err);
    }

    // Local draft (offline resilience)
    const localDraft: OnboardingDraft = {
      currentStep,
      application: payload,
      updatedAt: new Date().toISOString(),
      cachedPhone,
      cachedProfileImageUrl,
      cachedBusinessName,
      cachedBio,
      cachedLocation,
      cachedPricingFrom,
      cachedCategoryIds,
      cachedSkillIds,
      cachedServices,
      cachedSlots,
      cachedPortfolioItems,
      cachedInstitution,
      cachedStudentId,
      cachedVerificationImageUrl,
    };
    await secureStorage.setItem(getDraftKey(), localDraft);
  },

  clearDraft: async () => {
    try {
      await onboardingApi.putDraft({ currentStep: 1, completedSteps: [] });
    } catch (err) {
      logger.warn('[OnboardingStore] Clear server draft failed, cleared locally only', err);
    }

    await secureStorage.removeItem(getDraftKey());
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