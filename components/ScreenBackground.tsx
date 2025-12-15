import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useThemeColors } from '@/providers/ThemeProvider';

export function ScreenBackground({ children }: PropsWithChildren) {
  const { effective } = useThemeColors();
  const isLight = effective === 'light';
  const bgColor = isLight ? '#FFFFFF' : '#000000';
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: bgColor }]}
      edges={['top', 'left', 'right', 'bottom']}>
      <LinearGradient
        colors={
          isLight
            ? ['#FFFFFF', '#F9FAFB', '#F3F4F6']
            : ['#000000', '#000000', '#000000']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});
