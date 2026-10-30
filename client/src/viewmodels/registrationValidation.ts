import type {
  RegisterFieldErrors,
  RegisterFormValues,
} from '../models/auth';
import {validateEmail} from './loginValidation';

const FULL_NAME_MIN_LENGTH = 2;
const FULL_NAME_MAX_LENGTH = 150;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

/**
 * Mirrors the server's register schema exactly: a trimmed full name of 2-150
 * characters, a valid email up to 255 characters, and an 8-72 character
 * password. The email rule is shared with login so both screens agree.
 */
export const validateFullName = (value: string): string | undefined => {
  const fullName = value.trim();

  if (!fullName) {
    return 'Enter your full name.';
  }

  if (fullName.length < FULL_NAME_MIN_LENGTH) {
    return 'Your full name must be at least 2 characters.';
  }

  if (fullName.length > FULL_NAME_MAX_LENGTH) {
    return 'Full name must be 150 characters or fewer.';
  }

  return undefined;
};

export const validateRegistrationPassword = (
  value: string,
): string | undefined => {
  if (!value) {
    return 'Create a password.';
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return 'Use at least 8 characters for your password.';
  }

  if (value.length > PASSWORD_MAX_LENGTH) {
    return 'Password must be 72 characters or fewer.';
  }

  return undefined;
};

export const validateRegistrationForm = (
  values: RegisterFormValues,
): RegisterFieldErrors => {
  const errors: RegisterFieldErrors = {};
  const fullNameError = validateFullName(values.fullName);
  const emailError = validateEmail(values.email);
  const passwordError = validateRegistrationPassword(values.password);

  if (fullNameError) {
    errors.fullName = fullNameError;
  }

  if (emailError) {
    errors.email = emailError;
  }

  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};
