import {useCallback, useRef, useState} from 'react';
import {normalizeApiError} from '../api/ApiError';
import type {
  RegisterField,
  RegisterFieldErrors,
  RegisterFormValues,
  RegisterResult,
} from '../models/auth';
import {authService} from '../services/authService';
import {validateEmail} from './loginValidation';
import {
  validateFullName,
  validateRegistrationForm,
  validateRegistrationPassword,
} from './registrationValidation';

type TouchedFields = Record<RegisterField, boolean>;

const INITIAL_VALUES: RegisterFormValues = {
  fullName: '',
  email: '',
  password: '',
};

const INITIAL_TOUCHED: TouchedFields = {
  fullName: false,
  email: false,
  password: false,
};

const fieldValidators: Record<
  RegisterField,
  (value: string) => string | undefined
> = {
  fullName: validateFullName,
  email: validateEmail,
  password: validateRegistrationPassword,
};

const registrationErrorMessage = (error: unknown): string => {
  const apiError = normalizeApiError(
    error,
    'We could not create your account. Please try again.',
  );

  if (apiError.status === 409) {
    return 'An account with this email already exists. Try signing in instead.';
  }

  if (apiError.status === 400) {
    return 'Some of your details are not valid. Please check them and try again.';
  }

  return apiError.message;
};

export const useRegisterViewModel = () => {
  const [values, setValues] = useState<RegisterFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>(INITIAL_TOUCHED);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const updateField = useCallback(
    (field: RegisterField, value: string, shouldValidate: boolean) => {
      setValues(previousValues => ({...previousValues, [field]: value}));
      setFormError(null);

      if (shouldValidate) {
        setErrors(previousErrors => ({
          ...previousErrors,
          [field]: fieldValidators[field](value),
        }));
      }
    },
    [],
  );

  const setFullName = useCallback(
    (fullName: string) =>
      updateField('fullName', fullName, touched.fullName),
    [touched.fullName, updateField],
  );

  const setEmail = useCallback(
    (email: string) => updateField('email', email, touched.email),
    [touched.email, updateField],
  );

  const setPassword = useCallback(
    (password: string) => updateField('password', password, touched.password),
    [touched.password, updateField],
  );

  const handleBlur = useCallback(
    (field: RegisterField) => {
      setTouched(previousTouched => ({...previousTouched, [field]: true}));
      setErrors(previousErrors => ({
        ...previousErrors,
        [field]: fieldValidators[field](values[field]),
      }));
    },
    [values],
  );

  const submit = useCallback(async (): Promise<RegisterResult | null> => {
    if (submittingRef.current) {
      return null;
    }

    const nextErrors = validateRegistrationForm(values);

    setTouched({fullName: true, email: true, password: true});
    setErrors(nextErrors);
    setFormError(null);

    if (Object.keys(nextErrors).length > 0) {
      return null;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      return await authService.register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });
    } catch (error) {
      setFormError(registrationErrorMessage(error));
      return null;
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [values]);

  return {
    values,
    errors,
    formError,
    isSubmitting,
    setFullName,
    setEmail,
    setPassword,
    handleBlur,
    submit,
  };
};
