let authToken: string | null = null;

/**
 * In-memory access token used by the API client. Persistent storage lives in
 * the keychain-backed session store; this value is only needed for request
 * headers during the current app process.
 */
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;
