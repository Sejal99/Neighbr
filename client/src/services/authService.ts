import {apiClient} from '../api/apiClient';
import {ApiError, normalizeApiError} from '../api/ApiError';
import type {
  AuthSession,
  AuthUser,
  AuthUserDto,
  CurrentUserResponseDto,
  LoginCredentials,
  LoginResponseDto,
  RegisterCredentials,
  RegisterResponseDto,
  RegisterResult,
} from '../models/auth';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLoginResponseDto = (value: unknown): value is LoginResponseDto => {
  if (!isRecord(value) || !isRecord(value.user)) {
    return false;
  }

  const {token, user} = value;

  return (
    typeof token === 'string' &&
    token.length > 0 &&
    typeof user.id === 'string' &&
    typeof user.full_name === 'string' &&
    typeof user.email === 'string'
  );
};

const isAuthUserDto = (value: unknown): value is AuthUserDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.full_name === 'string' &&
    typeof value.email === 'string' &&
    typeof value.created_at === 'string'
  );
};

const isCurrentUserResponseDto = (
  value: unknown,
): value is CurrentUserResponseDto =>
  isRecord(value) && isAuthUserDto(value.user);

const isRegisterResponseDto = (
  value: unknown,
): value is RegisterResponseDto => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.message === 'string' &&
    value.message.trim().length > 0 &&
    isAuthUserDto(value.user)
  );
};

const mapUser = (user: AuthUserDto): AuthUser => ({
  id: user.id,
  fullName: user.full_name,
  email: user.email,
  createdAt: user.created_at,
});

const unexpectedResponse = () =>
  new ApiError(
    'The server returned an unexpected response. Please try again.',
    {kind: 'server'},
  );

/**
 * Creates a resident account using the existing POST /auth/register endpoint.
 * The endpoint intentionally returns no token, so the caller must send the
 * resident to sign in after a successful registration.
 */
export const register = async (
  credentials: RegisterCredentials,
): Promise<RegisterResult> => {
  try {
    const {data} = await apiClient.post<unknown>('/auth/register', {
      fullName: credentials.fullName.trim(),
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });

    if (!isRegisterResponseDto(data)) {
      throw unexpectedResponse();
    }

    return {
      message: data.message.trim(),
      user: mapUser(data.user),
    };
  } catch (error) {
    throw normalizeApiError(
      error,
      'We could not create your account. Please try again.',
    );
  }
};

/**
 * Signs a resident in using the existing POST /auth/login endpoint.
 */
export const login = async (
  credentials: LoginCredentials,
): Promise<AuthSession> => {
  try {
    const {data} = await apiClient.post<unknown>('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });

    if (!isLoginResponseDto(data)) {
      throw unexpectedResponse();
    }

    return {
      token: data.token,
      user: {
        id: data.user.id,
        fullName: data.user.full_name,
        email: data.user.email,
        createdAt: null,
      },
    };
  } catch (error) {
    throw normalizeApiError(
      error,
      'We could not sign you in. Please try again.',
    );
  }
};

/**
 * Validates the current token against GET /auth/me and returns the latest
 * profile. A 401 from this call means the stored session is no longer valid.
 */
export const getCurrentUser = async (): Promise<AuthUser> => {
  try {
    const {data} = await apiClient.get<unknown>('/auth/me');

    if (!isCurrentUserResponseDto(data)) {
      throw unexpectedResponse();
    }

    return mapUser(data.user);
  } catch (error) {
    throw normalizeApiError(
      error,
      'We could not verify your session. Please sign in again.',
    );
  }
};

export const authService = {
  login,
  register,
  getCurrentUser,
};
