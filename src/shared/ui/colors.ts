export const colors = {
  primary: '#8b003b',
  secondary: '#ffc712',
  success: '#08540a',
  background: '#f9feff',
  white: '#ffffff',
  black: '#000000',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray600: '#4b5563',
  gray800: '#1f2937',
  danger: '#dc2626',
  warning: '#d97706',
} as const;

export type ColorKey = keyof typeof colors;
