import * as Keychain from 'react-native-keychain';
import {
  clearSession,
  loadSession,
  saveSession,
} from '../src/auth/secureSessionStore';
import type {AuthSession} from '../src/models/auth';

const session: AuthSession = {
  token: 'signed.jwt.token',
  user: {
    id: 'user-1',
    fullName: 'Ada Lovelace',
    email: 'ada@neighbr.app',
    createdAt: '2026-10-29T10:00:00.000Z',
  },
};

const getGenericPassword = jest.mocked(Keychain.getGenericPassword);
const setGenericPassword = jest.mocked(Keychain.setGenericPassword);
const resetGenericPassword = jest.mocked(Keychain.resetGenericPassword);

const storedCredential = {
  service: 'com.neighbr.auth.session.v1',
  storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
  username: 'neighbr-session',
  password: JSON.stringify(session),
};

beforeEach(() => {
  jest.clearAllMocks();
  setGenericPassword.mockResolvedValue({
    service: 'com.neighbr.auth.session.v1',
    storage: Keychain.STORAGE_TYPE.AES_GCM_NO_AUTH,
  });
  resetGenericPassword.mockResolvedValue(true);
  getGenericPassword.mockResolvedValue(false);
});

describe('secure session storage', () => {
  it('stores the token and profile as a single keychain credential', async () => {
    await saveSession(session);

    expect(setGenericPassword).toHaveBeenCalledWith(
      'neighbr-session',
      JSON.stringify(session),
      {
        service: 'com.neighbr.auth.session.v1',
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      },
    );
  });

  it('fails loudly when the keychain refuses to store the session', async () => {
    setGenericPassword.mockResolvedValueOnce(false);

    await expect(saveSession(session)).rejects.toThrow(
      'We could not securely save your session on this device. Please try again.',
    );
  });

  it('restores a valid stored session', async () => {
    getGenericPassword.mockResolvedValueOnce(storedCredential);

    await expect(loadSession()).resolves.toEqual(session);
  });

  it('returns null when no session is stored', async () => {
    await expect(loadSession()).resolves.toBeNull();
  });

  it('returns null for a malformed stored session', async () => {
    getGenericPassword.mockResolvedValueOnce({
      ...storedCredential,
      password: '{"token":"token-with-no-user"}',
    });

    await expect(loadSession()).resolves.toBeNull();
  });

  it('returns null when keychain access fails instead of crashing boot', async () => {
    getGenericPassword.mockRejectedValueOnce(new Error('Keychain unavailable'));

    await expect(loadSession()).resolves.toBeNull();
  });

  it('clears the stored credential on sign out', async () => {
    await clearSession();

    expect(resetGenericPassword).toHaveBeenCalledWith({
      service: 'com.neighbr.auth.session.v1',
    });
  });
});
