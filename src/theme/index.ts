import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary Colors
  primary: '#FF4B3A',
  primaryDark: '#E63B2A',
  primaryLight: '#FF7B6A',

  // Secondary Colors
  secondary: '#40AA54',
  secondaryDark: '#308B42',
  secondaryLight: '#60CC74',

  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8C8C8C',
  lightGray: '#F5F5F5',
  darkGray: '#4A4A4A',

  // Status Colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',

  // Background Colors
  background: '#FFFFFF',
  card: '#FFFFFF',
  modal: '#FFFFFF',

  // Text Colors
  text: '#1A1A1A',
  textLight: '#757575',
  textDark: '#000000',

  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  borderDark: '#BDBDBD',

  // Social Colors
  facebook: '#3B5998',
  google: '#DB4437',
  apple: '#000000',
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // Font sizes
  largeTitle: 40,
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  body1: 16,
  body2: 14,
  body3: 12,
  small: 10,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  largeTitle: {
    fontFamily: 'System',
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: { fontFamily: 'System', fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: 'System', fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: 'System', fontSize: SIZES.h3, lineHeight: 26 },
  h4: { fontFamily: 'System', fontSize: SIZES.h4, lineHeight: 22 },
  h5: { fontFamily: 'System', fontSize: SIZES.h5, lineHeight: 20 },
  body1: {
    fontFamily: 'System',
    fontSize: SIZES.body1,
    lineHeight: 22,
  },
  body2: {
    fontFamily: 'System',
    fontSize: SIZES.body2,
    lineHeight: 20,
  },
  body3: {
    fontFamily: 'System',
    fontSize: SIZES.body3,
    lineHeight: 18,
  },
  small: {
    fontFamily: 'System',
    fontSize: SIZES.small,
    lineHeight: 16,
  },
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
};

export const LAYOUT = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
};

export default {
  COLORS,
  SIZES,
  FONTS,
  SHADOWS,
  LAYOUT,
};