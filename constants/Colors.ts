const primary = '#FF5A5F';
const secondary = '#3EE0B1';

const darkPalette = {
  text: '#E7ECF7',
  background: '#0C1224',
  tint: primary,
  muted: '#A9B4C7',
  tabIconDefault: '#A9B4C7',
  tabIconSelected: primary,
  border: '#1E2436',
  card: '#0F172A',
  glassStroke: 'rgba(255, 255, 255, 0.12)',
  glassSurface: 'rgba(255, 255, 255, 0.08)',
  secondary,
};

const lightPalette = {
  text: '#0B1224',
  background: '#F5F7FB',
  tint: primary,
  muted: '#5B667A',
  tabIconDefault: '#7B8599',
  tabIconSelected: primary,
  border: '#E4E8F1',
  card: '#FFFFFF',
  glassStroke: 'rgba(12, 18, 36, 0.08)',
  glassSurface: 'rgba(255, 255, 255, 0.7)',
  secondary,
};

export default {
  light: lightPalette,
  dark: darkPalette,
};
