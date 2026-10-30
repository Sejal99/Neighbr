import axios from 'axios';

export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'validation'
  | 'notFound'
  | 'server'
  | 'unknown';

type ApiErrorOptions = {
  kind: ApiErrorKind;
  status?: number;
  cause?: unknown;
};

/**
 * Normalised error type used by every service in the app.
 *
 * Keeping transport failures in one shape means view models can render
 * meaningful messages without knowing that axios is the HTTP client.
 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly cause?: unknown;

  constructor(message: string, options: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.kind = options.kind;
    this.status = options.status;
    this.cause = options.cause;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readServerMessage = (data: unknown): string | null => {
  if (!isRecord(data)) {
    return null;
  }

  const {message} = data;

  return typeof message === 'string' && message.trim().length > 0
    ? message.trim()
    : null;
};

const messageForStatus = (status: number, serverMessage: string | null) => {
  if (serverMessage) {
    return serverMessage;
  }

  if (status === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  if (status === 403) {
    return 'You do not have permission to do that.';
  }

  if (status === 404) {
    return 'We could not find what you were looking for.';
  }

  if (status === 409) {
    return 'That action conflicts with an existing record.';
  }

  if (status >= 400 && status < 500) {
    return 'Please check your details and try again.';
  }

  return 'The server is having trouble right now. Please try again in a moment.';
};

const kindForStatus = (status: number): ApiErrorKind => {
  if (status === 401) {
    return 'unauthorized';
  }

  if (status === 404) {
    return 'notFound';
  }

  if (status >= 400 && status < 500) {
    return 'validation';
  }

  return 'server';
};

/**
 * Converts anything thrown during a request into an ApiError. The server's
 * message is preserved for 4xx responses; 5xx responses intentionally use a
 * safer, user-facing message instead of leaking implementation details.
 */
export const normalizeApiError = (
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.',
): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError('The request timed out. Please try again.', {
        kind: 'timeout',
        cause: error,
      });
    }

    if (!error.response) {
      return new ApiError(
        "We can't reach Neighbr right now. Check your connection and try again.",
        {kind: 'network', cause: error},
      );
    }

    const {status} = error.response;
    const serverMessage = readServerMessage(error.response.data);
    const isServerError = status >= 500;

    return new ApiError(
      isServerError
        ? 'The server is having trouble right now. Please try again in a moment.'
        : messageForStatus(status, serverMessage),
      {
        kind: kindForStatus(status),
        status,
        cause: error,
      },
    );
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return new ApiError(error.message, {kind: 'unknown', cause: error});
  }

  return new ApiError(fallbackMessage, {kind: 'unknown', cause: error});
};
