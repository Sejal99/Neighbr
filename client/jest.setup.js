/* eslint-env jest */
jest.mock('@react-native-vector-icons/ionicons', () => {
  const React = require('react');
  const {Text} = require('react-native');

  function MockIcon({name, ...props}) {
    return React.createElement(Text, props, name);
  }

  return {__esModule: true, default: MockIcon};
});

jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
  },
  STORAGE_TYPE: {
    AES_GCM_NO_AUTH: 'KeystoreAESGCM_NoAuth',
  },
  getGenericPassword: jest.fn(async () => false),
  setGenericPassword: jest.fn(async () => ({
    service: 'mock',
    storage: 'KeystoreAESGCM_NoAuth',
  })),
  resetGenericPassword: jest.fn(async () => true),
}));
