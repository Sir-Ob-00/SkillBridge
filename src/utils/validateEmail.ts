const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validatePhone = (phone: string): boolean => {
  return /^[+]?[\d\s-]{7,15}$/.test(phone.trim());
};
