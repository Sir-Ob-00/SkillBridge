const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(normalizeEmail(email));
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validatePhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone.trim());
};
