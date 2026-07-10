import { UserRole } from '@app-types/index';

export type AuthStackParamList = {
  Onboarding: undefined;
  RoleSelect: undefined;
  Login: { role?: UserRole } | undefined;
  Register: { role?: UserRole } | undefined;
  EmailVerification: { email: string; role: UserRole };
  ForgotPassword: undefined;
  CompleteProfile: undefined;
};