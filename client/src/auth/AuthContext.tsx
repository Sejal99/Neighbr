import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {ApiError, normalizeApiError} from '../api/ApiError';
import {setAuthToken} from '../api/authToken';
import type {AuthSession, AuthUser, LoginCredentials} from '../models/auth';
import {authService} from '../services/authService';
import {clearSession, loadSession, saveSession} from './secureSessionStore';

export type AuthStatus = 'restoring' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({children}: AuthProviderProps) => {
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [user, setUser] = useState<AuthUser | null>(null);
  const restoreStarted = useRef(false);

  const restoreSession = useCallback(async () => {
    if (restoreStarted.current) {
      return;
    }

    restoreStarted.current = true;

    const storedSession = await loadSession();

    if (!storedSession) {
      setAuthToken(null);
      setStatus('unauthenticated');
      return;
    }

    setAuthToken(storedSession.token);

    try {
      const currentUser = await authService.getCurrentUser();
      const refreshedSession: AuthSession = {
        token: storedSession.token,
        user: currentUser,
      };

      setUser(currentUser);
      setStatus('authenticated');

      // Refreshing the cached profile is best-effort: the active session is
      // already valid even if the keychain write fails.
      try {
        await saveSession(refreshedSession);
      } catch {
        // The in-memory session remains usable; the previous cache is intact.
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setAuthToken(null);
        setUser(null);

        try {
          await clearSession();
        } catch {
          // The stale token is already discarded from memory.
        }

        setStatus('unauthenticated');
        return;
      }

      // Network or server failure: keep the last validated session so the app
      // remains usable offline. A 401 on any later request will force a
      // re-authentication through the normal flow.
      setUser(storedSession.user);
      setStatus('authenticated');
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    const session = await authService.login(credentials);

    try {
      await saveSession(session);
    } catch (error) {
      throw normalizeApiError(
        error,
        'We could not securely save your session. Please try again.',
      );
    }

    setAuthToken(session.token);
    setUser(session.user);
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    setStatus('unauthenticated');

    try {
      await clearSession();
    } catch {
      // Signing out of the current process must not depend on keychain access.
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({status, user, signIn, signOut}),
    [status, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
};
