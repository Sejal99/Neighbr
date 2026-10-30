import {Platform} from 'react-native';

/**
 * Neighbr design tokens.
 *
 * The palette is deliberately warm and grounded: an ivory canvas, a deep
 * forest brand colour and a muted brass accent. Keeping these values in one
 * place avoids one-off colours drifting across screens.
 */
export const colors = {
  canvas: '#F4F2EC',
  canvasDeep: '#EAE6DC',
  surface: '#FFFFFF',
  surfaceMuted: '#F8F7F2',
  surfaceSunken: '#EFEDE5',

  ink: '#17251E',
  inkSoft: '#445148',
  muted: '#5E6C63',
  mutedLight: '#8A958D',

  brand: '#1C4A38',
  brandDeep: '#113325',
  brandSoft: '#E4EDE6',

  accent: '#A97C3F',
  accentInk: '#7E5928',
  accentSoft: '#F1E7D5',

  border: '#DFE3DB',
  borderStrong: '#C7CEC5',

  error: '#A93A34',
  errorDeep: '#822A25',
  errorSoft: '#FAEFEE',

  success: '#2A6B4F',
  successSoft: '#E8F2EC',
  white: '#FFFFFF',
  transparent: 'transparent',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  giant: 64,
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 26,
  xxl: 32,
  pill: 999,
} as const;

export const fontFamilies = {
  display: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
} as const;

export const fontSizes = {
  micro: 10,
  caption: 12,
  small: 13,
  body: 15,
  bodyLarge: 16,
  title: 22,
  heading: 34,
  display: 40,
} as const;

export const lineHeights = {
  tight: 1.1,
  heading: 1.15,
  body: 1.55,
} as const;

export const motion = {
  pressOpacity: 0.72,
} as const;
