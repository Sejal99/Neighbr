import {useCallback, useRef, useState} from 'react';
import {normalizeApiError} from '../api/ApiError';
import {useAuth} from '../auth/AuthContext';
import type {
  LoginField,
  LoginFieldErrors,
  LoginFormValues,
} from '../models/auth';
import {
  validateEmail,
  validateLoginForm,
  validatePassword,
} from './loginValidation';

type TouchedFields = Record<LoginField, boolean>;

const INITIAL_VALUES: LoginFormValues = {
  email: '',
  password: '',
};

const INITIAL_TOUCHED: TouchedFields = {
  email: false,
  password: false,
};

const loginErrorMessage = (error: unknown): string => {
  const apiError = normalizeApiError(
    error,
    'We could not sign you in. Please try again.',
  );

  if (apiError.status === 401) {
    return 'The email or password you entered is incorrect.';
  }

  if (apiError.status === 400) {
    return 'We could not sign you in with those details. Please check them and try again.';
  }

  return apiError.message;
};

export const useLoginViewModel = () => {
  const {signIn} = useAuth();
  const [values, setValues] = useState<LoginFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [touched, setTouched] = useState<TouchedFields>(INITIAL_TOUCHED);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const setEmail = useCallback(
    (email: string) => {
      setValues(previousValues => ({...previousValues, email}));
      setFormError(null);

      if (touched.email) {
        setErrors(previousErrors => ({
          ...previousErrors,
          email: validateEmail(email),
        }));
      }
    },
    [touched.email],
  );

  const setPassword = useCallback(
    (password: string) => {
      setValues(previousValues => ({...previousValues, password}));
      setFormError(null);

      if (touched.password) {
        setErrors(previousErrors => ({
          ...previousErrors,
          password: validatePassword(password),
        }));
      }
    },
    [touched.password],
  );

  const handleEmailBlur = useCallback(() => {
    setTouched(previousTouched => ({...previousTouched, email: true}));
    setErrors(previousErrors => ({
      ...previousErrors,
      email: validateEmail(values.email),
    }));
  }, [values.email]);

  const handlePasswordBlur = useCallback(() => {
    setTouched(previousTouched => ({...previousTouched, password: true}));
    setErrors(previousErrors => ({
      ...previousErrors,
      password: validatePassword(values.password),
    }));
  }, [values.password]);

  const submit = useCallback(async () => {
    if (submittingRef.current) {
      return;
    }

    const nextErrors = validateLoginForm(values);

    setTouched({email: true, password: true});
    setErrors(nextErrors);
    setFormError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await signIn({
        email: values.email.trim(),
        password: values.password,
      });
    } catch (error) {
      setFormError(loginErrorMessage(error));
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [signIn, values]);

  return {
    values,
    errors,
    formError,
    isSubmitting,
    setEmail,
    setPassword,
    handleEmailBlur,
    handlePasswordBlur,
    submit,
  };
};
