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
    BY_ID: (id: string) => `/users/${id}`,
  },
  ARTISANS: {
    LIST: '/artisans',
    BY_ID: (id: string) => `/artisans/${id}`,
    SERVICES: (id: string) => `/artisans/${id}/services`,
    AVAILABILITY: (id: string) => `/artisans/${id}/availability`,
    EARNINGS: '/artisans/me/earnings',
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
