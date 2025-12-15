import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColors } from '@/providers/ThemeProvider';

export function ScreenBackground({ children }: PropsWithChildren) {
  const { effective, colors } = useThemeColors();
  const isLight = effective === 'light';
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={
          isLight
            ? ['#F7F9FF', '#EDF2FF', '#E6ECFB']
            : ['#101830', '#0A1024', '#090E1D']
        }
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
});
