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
  User,
} from '@app-types/index';
import { Category } from '@constants/categories';

export interface CategoryWithSkills extends Category {
  skills: Skill[];
}

export interface OnboardingStatusData {
  status: OnboardingStatus;
  completedSteps: string[];
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;
  rejectionReason: string | null;
}

export interface PersonalInfoPayload {
  phone: string;
  profileImageUrl?: string | null;
}

export interface BusinessInfoPayload {
  businessName: string;
  bio?: string;
  location?: string;
  pricingFrom?: number | null;
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

export interface SubmitError {
  success: false;
  message: string;
  details?: {
    missingFields?: string[];
  };
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
    const { data } = await apiClient.get<ApiResponse<OnboardingStatusData>>(
      API_ROUTES.ONBOARDING.STATUS
    );
    return data.data;
  },

  patchPersonalInfo: async (payload: PersonalInfoPayload) => {
    const { data } = await apiClient.patch<ApiResponse<User>>(
      API_ROUTES.ONBOARDING.PERSONAL,
      payload
    );
    return data.data;
  },

  patchBusinessInfo: async (payload: BusinessInfoPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{
      id: string;
      userId: string;
      businessName: string;
      bio: string | null;
      pricingFrom: string;
      location: string | null;
      applicationStatus: string;
    }>>(
      API_ROUTES.ONBOARDING.BUSINESS,
      payload
    );
    return data.data;
  },

  patchCategories: async (payload: CategoriesPayload) => {
    const { data } = await apiClient.patch<ApiResponse<string[]>>(
      API_ROUTES.ONBOARDING.CATEGORIES,
      payload
    );
    return data.data;
  },

  patchSkills: async (payload: SkillsPayload) => {
    const { data } = await apiClient.patch<ApiResponse<string[]>>(
      API_ROUTES.ONBOARDING.SKILLS,
      payload
    );
    return data.data;
  },

  patchServices: async (payload: ServicesPayload) => {
    const { data } = await apiClient.patch<ApiResponse<Array<{
      id: string;
      title: string;
      description: string;
      price: string;
      durationMinutes: number;
      categoryId: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }>>>(
      API_ROUTES.ONBOARDING.SERVICES,
      payload
    );
    return data.data;
  },

  patchAvailability: async (payload: AvailabilityPayload) => {
    const { data } = await apiClient.patch<ApiResponse<Array<{
      id: string;
      day: string;
      startTime: string;
      endTime: string;
      createdAt: string;
    }>>>(
      API_ROUTES.ONBOARDING.AVAILABILITY,
      payload
    );
    return data.data;
  },

  patchPortfolio: async (payload: PortfolioPayload) => {
    const { data } = await apiClient.patch<ApiResponse<Array<{
      id: string;
      imageUrl: string;
      caption: string | null;
      createdAt: string;
    }>>>(
      API_ROUTES.ONBOARDING.PORTFOLIO,
      payload
    );
    return data.data;
  },

  patchVerification: async (payload: VerificationPayload) => {
    const { data } = await apiClient.patch<ApiResponse<{
      id: string;
      artisanProfileId: string;
      institution: string;
      studentId: string;
      verificationImageUrl: string;
      status: string;
      reviewNotes: string | null;
      reviewedByUserId: string | null;
      reviewedAt: string | null;
      createdAt: string;
      updatedAt: string;
    }>>(
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
    const { data } = await apiClient.post<ApiResponse<{
      id: string;
      userId: string;
      businessName: string;
      applicationStatus: string;
      submittedAt: string;
    }>>(
      API_ROUTES.ONBOARDING.SUBMIT,
      payload || {}
    );
    return data.data;
  },
};