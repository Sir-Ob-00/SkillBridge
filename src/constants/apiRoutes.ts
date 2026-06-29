export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me',
    AVATAR: '/users/me/avatar',
    BY_ID: (id: string) => `/users/${id}`,
  },
  ARTISANS: {
    LIST: '/artisans',
    BY_ID: (id: string) => `/artisans/${id}`,
    ME_PROFILE: '/artisans/me/profile',
    ME_PROFILE_IMAGE: '/artisans/me/profile-image',
    ME_PORTFOLIO: '/artisans/me/portfolio',
    SERVICES: (id: string) => `/artisans/${id}/services`,
    SERVICE_ITEM: (id: string, serviceId: string) =>
      `/artisans/${id}/services/${serviceId}`,
    AVAILABILITY: (id: string) => `/artisans/${id}/availability`,
    EARNINGS: '/artisans/me/earnings',
    PORTFOLIO: (id: string) => `/artisans/${id}/portfolio`,
    PORTFOLIO_ITEM: (id: string, itemId: string) =>
      `/artisans/${id}/portfolio/${itemId}`,
  },
  BOOKINGS: {
    LIST: '/bookings',
    CREATE: '/bookings',
    BY_ID: (id: string) => `/bookings/${id}`,
    UPDATE_STATUS: (id: string) => `/bookings/${id}/status`,
  },
  REVIEWS: {
    LIST: (artisanId: string) => `/artisans/${artisanId}/reviews`,
    CREATE: '/reviews',
  },
  CHAT: {
    LIST: '/chats',
    MESSAGES: (chatId: string) => `/chats/${chatId}/messages`,
  },
};
