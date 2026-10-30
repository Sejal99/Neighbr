import * as Keychain from 'react-native-keychain';
import type {AuthSession, AuthUser} from '../models/auth';

const SESSION_SERVICE = 'com.neighbr.auth.session.v1';
const SESSION_USERNAME = 'neighbr-session';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isAuthUser = (value: unknown): value is AuthUser => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.fullName === 'string' &&
    typeof value.email === 'string' &&
    (typeof value.createdAt === 'string' || value.createdAt === null)
  );
};

const parseSession = (value: string): AuthSession | null => {
  try {
    const parsed: unknown = JSON.parse(value);

    if (
      !isRecord(parsed) ||
      typeof parsed.token !== 'string' ||
      parsed.token.length === 0 ||
      !isAuthUser(parsed.user)
    ) {
      return null;
    }

    return {token: parsed.token, user: parsed.user};
  } catch {
    return null;
  }
};

/**
 * Persists the token and its validated profile in the platform keychain.
 * The whole session is stored as one encrypted credential so a token can
 * never be restored without the profile it belongs to.
 */
export const saveSession = async (session: AuthSession): Promise<void> => {
  const saved = await Keychain.setGenericPassword(
    SESSION_USERNAME,
    JSON.stringify(session),
    {
      service: SESSION_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    },
  );

  if (!saved) {
    throw new Error(
      'We could not securely save your session on this device. Please try again.',
    );
  }
};

export const loadSession = async (): Promise<AuthSession | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SESSION_SERVICE,
    });

    if (!credentials) {
      return null;
    }

    return parseSession(credentials.password);
  } catch {
    return null;
  }
};

export const clearSession = async (): Promise<void> => {
  await Keychain.resetGenericPassword({service: SESSION_SERVICE});
};
