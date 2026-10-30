import type {AxiosResponse} from 'axios';
import {apiClient} from '../src/api/apiClient';
import {authService} from '../src/services/authService';

jest.mock('../src/api/apiClient', () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const post = jest.mocked(apiClient.post);
const get = jest.mocked(apiClient.get);

const response = (data: unknown) => ({data} as AxiosResponse<unknown>);

const httpError = (status: number, message: string) =>
  Object.assign(new Error('Request failed'), {
    isAxiosError: true,
    response: {
      status,
      data: {message},
    },
  });

const networkError = () =>
  Object.assign(new Error('Network Error'), {isAxiosError: true});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('authService.register', () => {
  it('sends the server field names and maps the created profile', async () => {
    post.mockResolvedValueOnce(
      response({
        message: 'Registration successful',
        user: {
          id: 'user-2',
          full_name: 'Ada Lovelace',
          email: 'ada@neighbr.app',
          created_at: '2026-10-29T10:00:00.000Z',
        },
      }),
    );

    await expect(
      authService.register({
        fullName: '  Ada Lovelace ',
        email: ' Ada@Neighbr.App ',
        password: 'correct horse battery staple',
      }),
    ).resolves.toEqual({
      message: 'Registration successful',
      user: {
        id: 'user-2',
        fullName: 'Ada Lovelace',
        email: 'ada@neighbr.app',
        createdAt: '2026-10-29T10:00:00.000Z',
      },
    });

    expect(post).toHaveBeenCalledWith('/auth/register', {
      fullName: 'Ada Lovelace',
      email: 'ada@neighbr.app',
      password: 'correct horse battery staple',
    });
  });

  it('surfaces a duplicate email as a conflict ApiError', async () => {
    post.mockRejectedValueOnce(httpError(409, 'Email is already registered'));

    await expect(
      authService.register({
        fullName: 'Ada Lovelace',
        email: 'ada@neighbr.app',
        password: 'correct horse battery staple',
      }),
    ).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'validation',
      status: 409,
      message: 'Email is already registered',
    });
  });

  it('rejects a malformed success response instead of claiming success', async () => {
    post.mockResolvedValueOnce(response({message: '', user: {}}));

    await expect(
      authService.register({
        fullName: 'Ada Lovelace',
        email: 'ada@neighbr.app',
        password: 'correct horse battery staple',
      }),
    ).rejects.toMatchObject({
      kind: 'server',
      message: 'The server returned an unexpected response. Please try again.',
    });
  });
});

describe('authService.login', () => {
  it('maps the API response and normalises the email address', async () => {
    post.mockResolvedValueOnce(
      response({
        token: 'signed.jwt.token',
        user: {
          id: 'user-1',
          full_name: 'Ada Lovelace',
          email: 'ada@neighbr.app',
        },
      }),
    );

    await expect(
      authService.login({
        email: '  Ada@Neighbr.App ',
        password: 'correct horse battery staple',
      }),
    ).resolves.toEqual({
      token: 'signed.jwt.token',
      user: {
        id: 'user-1',
        fullName: 'Ada Lovelace',
        email: 'ada@neighbr.app',
        createdAt: null,
      },
    });

    expect(post).toHaveBeenCalledWith('/auth/login', {
      email: 'ada@neighbr.app',
      password: 'correct horse battery staple',
    });
  });

  it('surfaces invalid credentials as an unauthorised ApiError', async () => {
    post.mockRejectedValueOnce(httpError(401, 'Invalid email or password'));

    await expect(
      authService.login({email: 'ada@neighbr.app', password: 'wrong'}),
    ).rejects.toMatchObject({
      name: 'ApiError',
      kind: 'unauthorized',
      status: 401,
      message: 'Invalid email or password',
    });
  });

  it('surfaces connectivity problems as a network ApiError', async () => {
    post.mockRejectedValueOnce(networkError());

    await expect(
      authService.login({email: 'ada@neighbr.app', password: 'secret'}),
    ).rejects.toMatchObject({
      kind: 'network',
      message:
        "We can't reach Neighbr right now. Check your connection and try again.",
    });
  });

  it('rejects a malformed success response instead of fabricating a session', async () => {
    post.mockResolvedValueOnce(response({token: '', user: {}}));

    await expect(
      authService.login({email: 'ada@neighbr.app', password: 'secret'}),
    ).rejects.toMatchObject({
      kind: 'server',
      message: 'The server returned an unexpected response. Please try again.',
    });
  });
});

describe('authService.getCurrentUser', () => {
  it('maps the profile returned by /auth/me', async () => {
    get.mockResolvedValueOnce(
      response({
        user: {
          id: 'user-1',
          full_name: 'Ada Lovelace',
          email: 'ada@neighbr.app',
          created_at: '2026-10-29T10:00:00.000Z',
        },
      }),
    );

    await expect(authService.getCurrentUser()).resolves.toEqual({
      id: 'user-1',
      fullName: 'Ada Lovelace',
      email: 'ada@neighbr.app',
      createdAt: '2026-10-29T10:00:00.000Z',
    });
  });

  it('propagates an expired token as a 401', async () => {
    get.mockRejectedValueOnce(httpError(401, 'Invalid or expired token'));

    await expect(authService.getCurrentUser()).rejects.toMatchObject({
      kind: 'unauthorized',
      status: 401,
    });
  });
});
