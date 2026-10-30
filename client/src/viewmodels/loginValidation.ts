import type {LoginFieldErrors, LoginFormValues} from '../models/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (value: string): string | undefined => {
  const email = value.trim();

  if (!email) {
    return 'Enter your email address.';
  }

  if (email.length > 255) {
    return 'Email address must be 255 characters or fewer.';
  }

  if (!EMAIL_PATTERN.test(email)) {
    return 'Enter a valid email address.';
  }

  return undefined;
};

export const validatePassword = (value: string): string | undefined => {
  if (!value) {
    return 'Enter your password.';
  }

  if (value.length > 72) {
    return 'Password must be 72 characters or fewer.';
  }

  return undefined;
};

/**
 * Validates the whole form at once for submit. The same field validators are
 * reused for blur/change feedback so the rules can never drift apart.
 */
export const validateLoginForm = (
  values: LoginFormValues,
): LoginFieldErrors => {
  const errors: LoginFieldErrors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};
