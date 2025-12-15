const primary = '#FF385C';
const secondary = '#00A699';

const darkPalette = {
  text: '#EDEFEF',
  background: '#000000',
  tint: primary,
  muted: '#9CA3AF',
  tabIconDefault: '#6B7280',
  tabIconSelected: primary,
  border: 'rgba(255, 255, 255, 0.08)',
  card: 'rgba(255, 255, 255, 0.05)',
  glassStroke: 'rgba(255, 255, 255, 0.06)',
  glassSurface: 'rgba(255, 255, 255, 0.03)',
  secondary,
};

const lightPalette = {
  text: '#1F2937',
  background: '#FFFFFF',
  tint: primary,
  muted: '#6B7280',
  tabIconDefault: '#9CA3AF',
  tabIconSelected: primary,
  border: '#E5E7EB',
  card: '#FFFFFF',
  glassStroke: 'rgba(0, 0, 0, 0.04)',
  glassSurface: 'rgba(0, 0, 0, 0.02)',
  secondary,
};

export default {
  light: lightPalette,
  dark: darkPalette,
};
