const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * This project installs its dependencies locally in client/node_modules.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = mergeConfig(getDefaultConfig(__dirname), {});
