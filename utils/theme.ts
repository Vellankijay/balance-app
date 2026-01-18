export const Colors = {
  light: {
    background: '#F0EFE7',
    surface: '#FFFFFF',
    border: '#E8EAF0',
    text: {
      primary: '#1A202C',
      secondary: '#718096',
      tertiary: '#A0AEC0',
    },
    primary: {
      mental: '#7C83FD',
      physical: '#2DD4A4',
    },
    semantic: {
      success: '#2DD4A4',
      warning: '#F6AD55',
      error: '#F56565',
    },
  },
  dark: {
    background: '#1A1F2E',
    surface: '#252D3D',
    border: '#3A4452',
    text: {
      primary: '#E2E8F0',
      secondary: '#A0AEC0',
      tertiary: '#718096',
    },
    primary: {
      mental: '#9BA3FF',
      physical: '#5AE5C1',
    },
    semantic: {
      success: '#5AE5C1',
      warning: '#FFA500',
      error: '#FF6B6B',
    },
  },
};

export const getColors = (mode: 'light' | 'dark') => {
  return Colors[mode];
};

export const Typography = {
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    small: 14,
    xs: 12,
  },
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};