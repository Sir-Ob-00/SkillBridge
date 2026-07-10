export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    RESEND_EMAIL_OTP: '/api/v1/auth/resend-email-otp',
  },
  USERS: {
    ME: '/api/v1/users/me',
    UPDATE_PROFILE: '/api/v1/users/me',
    AVATAR: '/api/v1/users/me/avatar',
    BY_ID: (id: string) => `/api/v1/users/${id}`,
  },
  ARTISANS: {
    LIST: '/api/v1/artisans',
    BY_ID: (id: string) => `/api/v1/artisans/${id}`,
    ME_PROFILE: '/api/v1/artisans/me/profile',
    ME_PROFILE_IMAGE: '/api/v1/artisans/me/profile-image',
    ME_PORTFOLIO: '/api/v1/artisans/me/portfolio',
    SERVICES: (id: string) => `/api/v1/artisans/${id}/services`,
    SERVICE_ITEM: (id: string, serviceId: string) =>
      `/api/v1/artisans/${id}/services/${serviceId}`,
    AVAILABILITY: (id: string) => `/api/v1/artisans/${id}/availability`,
    EARNINGS: '/api/v1/artisans/me/earnings',
    PORTFOLIO: (id: string) => `/api/v1/artisans/${id}/portfolio`,
    PORTFOLIO_ITEM: (id: string, itemId: string) =>
      `/api/v1/artisans/${id}/portfolio/${itemId}`,
  },
  BOOKINGS: {
    LIST: '/api/v1/bookings',
    CREATE: '/api/v1/bookings',
    BY_ID: (id: string) => `/api/v1/bookings/${id}`,
    UPDATE_STATUS: (id: string) => `/api/v1/bookings/${id}/status`,
  },
  REVIEWS: {
    LIST: (artisanId: string) => `/api/v1/artisans/${artisanId}/reviews`,
    CREATE: '/api/v1/reviews',
  },
  CHAT: {
    LIST: '/api/v1/chats',
    MESSAGES: (chatId: string) => `/api/v1/chats/${chatId}/messages`,
    MARK_READ: (chatId: string) => `/api/v1/chats/${chatId}/read`,
  },
  REPORTS: {
    CREATE: '/api/v1/reports',
  },
  ONBOARDING: {
    STATUS: '/api/v1/artisans/me/onboarding/status',
    HISTORY: '/api/v1/artisans/me/onboarding/history',
    PERSONAL: '/api/v1/artisans/me/onboarding/personal',
    BUSINESS: '/api/v1/artisans/me/onboarding/business',
    CATEGORIES: '/api/v1/artisans/me/onboarding/categories',
    SKILLS: '/api/v1/artisans/me/onboarding/skills',
    SERVICES: '/api/v1/artisans/me/onboarding/services',
    AVAILABILITY: '/api/v1/artisans/me/onboarding/availability',
    PORTFOLIO: '/api/v1/artisans/me/onboarding/portfolio',
    VERIFICATION: '/api/v1/artisans/me/onboarding/verification',
    SUBMIT: '/api/v1/artisans/me/onboarding/submit',
    DRAFT: '/api/v1/artisans/me/onboarding/draft',
  },
  CATEGORIES: {
    LIST: '/api/v1/categories',
    SKILLS: (id: string) => `/api/v1/categories/${id}/skills`,
  },
  UPLOADS: {
    IMAGE: (folder: string) => `/api/v1/uploads/image?folder=${folder}`,
  },
};