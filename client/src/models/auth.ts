/**
 * Authentication contracts shared by the API service, session storage and
 * view models. API payloads use snake_case; the app maps them to camelCase at
 * the service boundary so screens never depend on transport details.
 */

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string | null;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type LoginResponseDto = {
  token: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
};

export type AuthUserDto = {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
};

export type CurrentUserResponseDto = {
  user: AuthUserDto;
};

/**
 * POST /auth/register returns the created profile but deliberately does not
 * issue a token, so registration and sign-in remain separate steps.
 */
export type RegisterResponseDto = {
  message: string;
  user: AuthUserDto;
};

export type RegisterResult = {
  message: string;
  user: AuthUser;
};

export type LoginField = 'email' | 'password';

export type LoginFieldErrors = Partial<Record<LoginField, string>>;

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterField = 'fullName' | 'email' | 'password';

export type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
};
