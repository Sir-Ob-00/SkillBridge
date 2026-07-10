import { apiClient } from '@services/api/client';
import { API_ROUTES } from '@constants/apiRoutes';
import {
  ApiResponse,
  OnboardingStatus,
  Skill,
  AvailabilitySlot,
  OnboardingServiceItem,
  PortfolioItemData,
  OnboardingHistoryItem,
} from '@app-types/index';
import { Category } from '@constants/categories';
import { ChangesRequestedInfo } from '../onboarding.types';

export interface CategoryWithSkills extends Category {
  skills: Skill[];
}

export interface OnboardingStatusResponse {
  status: OnboardingStatus;
  completedSteps: string[];
  changesRequested?: ChangesRequestedInfo & {
    rejectionReason?: string;
    adminNotes?: string;
  };
}

export interface PersonalInfoPayload {
  phone: string;
  profileImageUrl?: string;
}

export interface BusinessInfoPayload {
  businessName: string;
  bio: string;
  location: string;
  pricingFrom: number;
}

export interface CategoriesPayload {
  categoryIds: string[];
}

export interface SkillsPayload {
  skillIds: string[];
}

export interface ServicesPayload {
  items: OnboardingServiceItem[];
}

export interface AvailabilityPayload {
  slots: AvailabilitySlot[];
}

export interface PortfolioPayload {
  items: PortfolioItemData[];
}

export interface VerificationPayload {
  institution: string;
  studentId: string;
  verificationImageUrl: string;
}

export interface SubmitPayload {
  notes?: string;
}

export const onboardingApi = {
  getCategoriesWithSkills: async () => {
    const { data } = await apiClient.get<ApiResponse<CategoryWithSkills[]>>(API_ROUTES.CATEGORIES.LIST);
    return data.data;
  },

  getSkillsByCategory: async (categoryId: string) => {
    const { data } = await apiClient.get<ApiResponse<Skill[]>>(API_ROUTES.CATEGORIES.SKILLS(categoryId));
    return data.data;
  },

  getOnboardingStatus: async () => {
    const { data } = await apiClient.get<ApiResponse<OnboardingStatusResponse>>(
      API_ROUTES.ONBOARDING.STATUS
    );
    return data.data;
  },

  patchPersonalInfo: async (payload: PersonalInfoPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{ status: OnboardingStatus }>>(
      API_ROUTES.ONBOARDING.PERSONAL,
      payload
    );
    return data.data;
  },

  patchBusinessInfo: async (payload: BusinessInfoPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{ status: OnboardingStatus }>>(
      API_ROUTES.ONBOARDING.BUSINESS,
      payload
    );
    return data.data;
  },

  patchCategories: async (payload: CategoriesPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{ status: OnboardingStatus }>>(
      API_ROUTES.ONBOARDING.CATEGORIES,
      payload
    );
    return data.data;
  },

  patchSkills: async (payload: SkillsPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{ status: OnboardingStatus }>>(
      API_ROUTES.ONBOARDING.SKILLS,
      payload
    );
    return data.data;
  },

  patchServices: async (payload: ServicesPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{ status: OnboardingStatus }>>(
      API_ROUTES.ONBOARDING.SERVICES,
      payload
    );
    return data.data;
  },

  patchAvailability: async (payload: AvailabilityPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{ status: OnboardingStatus }>>(
      API_ROUTES.ONBOARDING.AVAILABILITY,
      payload
    );
    return data.data;
  },

  patchPortfolio: async (payload: PortfolioPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{ status: OnboardingStatus }>>(
      API_ROUTES.ONBOARDING.PORTFOLIO,
      payload
    );
    return data.data;
  },

  patchVerification: async (payload: VerificationPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{ status: OnboardingStatus }>>(
      API_ROUTES.ONBOARDING.VERIFICATION,
      payload
    );
    return data.data;
  },

  getOnboardingHistory: async () => {
    const { data } = await apiClient.get<ApiResponse<OnboardingHistoryItem[]>>(
      API_ROUTES.ONBOARDING.HISTORY
    );
    return data.data;
  },

  submitApplication: async (payload?: SubmitPayload) => {
    const { data } = await apiClient.post<ApiResponse<{ status: OnboardingStatus }>>(
      API_ROUTES.ONBOARDING.SUBMIT,
      payload || {}
    );
    return data.data;
  },
};