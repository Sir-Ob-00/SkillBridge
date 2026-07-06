import { ApiError } from '@features/auth/services/client';

export interface AuthFeedback {
  type: 'error';
  title: string;
  message: string;
}

const ERROR_MAP: Record<number, { title: string; defaultMessage: string }> = {
  0: {
    title: 'Connection Error',
    defaultMessage:
      "We couldn't connect to the server. Please check your internet connection and try again.",
  },
  400: {
    title: 'Invalid Input',
    defaultMessage: 'Please check your information and try again.',
  },
  401: {
    title: 'Unable to Sign In',
    defaultMessage:
      'The email or password you entered is incorrect. Please try again.',
  },
  404: {
    title: 'Not Found',
    defaultMessage: 'The requested information could not be found.',
  },
  409: {
    title: 'Conflict',
    defaultMessage:
      'This account already exists. Try signing in instead.',
  },
  429: {
    title: 'Too Many Requests',
    defaultMessage:
      'You have made too many attempts. Please wait a moment and try again.',
  },
};

export function handleAuthError(err: unknown): AuthFeedback {
  if (!err) {
    return {
      type: 'error',
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred. Please try again.',
    };
  }

  const apiErr = err as ApiError;
  const statusCode = apiErr.statusCode ?? 500;
  const apiMessage = apiErr.message;

  if (statusCode >= 500) {
    return {
      type: 'error',
      title: 'Something Went Wrong',
      message:
        apiMessage ||
        "We're experiencing a temporary issue. Please try again in a few moments.",
    };
  }

  const mapping = ERROR_MAP[statusCode];
  if (mapping) {
    if (statusCode === 400 && apiErr.errors) {
      const firstField = Object.keys(apiErr.errors)[0];
      const firstError = firstField ? apiErr.errors[firstField]?.[0] : undefined;
      return {
        type: 'error',
        title: mapping.title,
        message: firstError || mapping.defaultMessage,
      };
    }
    return {
      type: 'error',
      title: mapping.title,
      message: apiMessage || mapping.defaultMessage,
    };
  }

  return {
    type: 'error',
    title: 'Something Went Wrong',
    message: apiMessage || 'An unexpected error occurred. Please try again.',
  };
}
