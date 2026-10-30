import React from 'react';
import ReactTestRenderer, {
  type ReactTestInstance,
  type ReactTestRenderer as Renderer,
} from 'react-test-renderer';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthProvider} from '../src/auth/AuthContext';
import type {AuthStackParamList} from '../src/navigation/types';
import LoginScreen from '../src/views/screens/auth/LoginScreen';

type LoginProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const createProps = (params?: LoginProps['route']['params']) => {
  const navigation = {
    navigate: jest.fn(),
  } as unknown as LoginProps['navigation'];
  const route = {
    key: 'Login-1',
    name: 'Login',
    params,
  } as LoginProps['route'];

  return {navigation, route};
};

const findByLabel = (renderer: Renderer, label: string): ReactTestInstance => {
  const matches = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === label &&
      typeof node.props.onPress === 'function',
  );

  if (matches.length === 0) {
    throw new Error(`Could not find control labelled "${label}"`);
  }

  return matches[0];
};

const renderScreen = async (
  navigation: LoginProps['navigation'],
  route: LoginProps['route'],
): Promise<Renderer> => {
  let renderer!: Renderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <AuthProvider>
        <LoginScreen navigation={navigation} route={route} />
      </AuthProvider>,
    );
  });

  return renderer;
};

describe('LoginScreen registration entry point', () => {
  it('opens the registration route from the create account action', async () => {
    const {navigation, route} = createProps();
    const renderer = await renderScreen(navigation, route);

    await ReactTestRenderer.act(async () => {
      findByLabel(renderer, 'Create an account').props.onPress();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('shows the registration success notice and prefills the email', async () => {
    const {navigation, route} = createProps({
      registrationSuccess:
        'Registration successful. Sign in with ananya@neighbr.app to continue.',
      registeredEmail: 'ananya@neighbr.app',
    });
    const renderer = await renderScreen(navigation, route);

    expect(
      renderer.root.findAll(
        node =>
          node.props.children ===
          'Registration successful. Sign in with ananya@neighbr.app to continue.',
      ),
    ).not.toHaveLength(0);
    expect(
      renderer.root.findAll(
        node =>
          node.props.accessibilityLabel === 'Email address' &&
          node.props.value === 'ananya@neighbr.app',
      ),
    ).not.toHaveLength(0);
  });
});
