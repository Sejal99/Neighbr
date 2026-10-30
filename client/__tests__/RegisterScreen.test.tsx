import React from 'react';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ApiError} from '../src/api/ApiError';
import type {AuthStackParamList} from '../src/navigation/types';
import {authService} from '../src/services/authService';
import RegisterScreen from '../src/views/screens/auth/RegisterScreen';

jest.mock('../src/services/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

type RegisterProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const register = jest.mocked(authService.register);

const createProps = () => {
  const navigation = {
    goBack: jest.fn(),
    popTo: jest.fn(),
  } as unknown as RegisterProps['navigation'];
  const route = {
    key: 'Register-1',
    name: 'Register',
  } as RegisterProps['route'];

  return {navigation, route};
};

const findByLabel = (renderer: Renderer, label: string): ReactTestInstance => {
  const matches = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === label &&
      (typeof node.props.onPress === 'function' ||
        typeof node.props.onChangeText === 'function'),
  );

  if (matches.length === 0) {
    throw new Error(`Could not find control labelled "${label}"`);
  }

  return matches[0];
};

const fillForm = async (renderer: Renderer) => {
  await ReactTestRenderer.act(async () => {
    findByLabel(renderer, 'Full name').props.onChangeText('Ananya Sharma');
    findByLabel(renderer, 'Email address').props.onChangeText(
      ' ananya@neighbr.app ',
    );
    findByLabel(renderer, 'Password').props.onChangeText(
      'correct horse battery staple',
    );
  });
};

const submit = async (renderer: Renderer) => {
  await ReactTestRenderer.act(async () => {
    await findByLabel(renderer, 'Create account').props.onPress();
  });
};

const renderScreen = async (
  navigation: RegisterProps['navigation'],
  route: RegisterProps['route'],
): Promise<Renderer> => {
  let renderer!: Renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <RegisterScreen navigation={navigation} route={route} />,
    );
  });

  return renderer;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('RegisterScreen', () => {
  it('registers, then returns to Login with a success message', async () => {
    register.mockResolvedValueOnce({
      message: 'Registration successful',
      user: {
        id: 'user-2',
        fullName: 'Ananya Sharma',
        email: 'ananya@neighbr.app',
        createdAt: '2026-10-30T09:00:00.000Z',
      },
    });

    const {navigation, route} = createProps();
    const renderer = await renderScreen(navigation, route);

    await fillForm(renderer);
    await submit(renderer);

    expect(register).toHaveBeenCalledWith({
      fullName: 'Ananya Sharma',
      email: 'ananya@neighbr.app',
      password: 'correct horse battery staple',
    });
    expect(navigation.popTo).toHaveBeenCalledWith('Login', {
      registrationSuccess:
        'Registration successful. Sign in with ananya@neighbr.app to continue.',
      registeredEmail: 'ananya@neighbr.app',
    });
  });

  it('shows a meaningful error and stays on screen for a duplicate email', async () => {
    register.mockRejectedValueOnce(
      new ApiError('Email is already registered', {
        kind: 'validation',
        status: 409,
      }),
    );

    const {navigation, route} = createProps();
    const renderer = await renderScreen(navigation, route);

    await fillForm(renderer);
    await submit(renderer);

    expect(navigation.popTo).not.toHaveBeenCalled();
    expect(
      renderer.root.findAll(
        node =>
          node.props.children ===
          'An account with this email already exists. Try signing in instead.',
      ),
    ).not.toHaveLength(0);
  });

  it('blocks submission and shows field errors when the form is empty', async () => {
    const {navigation, route} = createProps();
    const renderer = await renderScreen(navigation, route);

    await submit(renderer);

    expect(register).not.toHaveBeenCalled();
    expect(navigation.popTo).not.toHaveBeenCalled();
    expect(
      renderer.root.findAll(
        node => node.props.children === 'Enter your full name.',
      ),
    ).not.toHaveLength(0);
  });
});
