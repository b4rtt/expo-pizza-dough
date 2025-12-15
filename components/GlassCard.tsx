import { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

import Colors from '@/constants/Colors';
import { radius } from '@/constants/theme';

type Props = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
}>;

export function GlassCard({ children, style, intensity = 60 }: Props) {
  const canUseGlass = isLiquidGlassAvailable() && Platform.OS === 'ios';

  if (!canUseGlass) {
    return (
      <View style={[styles.card, styles.fallback, style]}>
        {children}
      </View>
    );
  }

  return (
    <GlassView
      blurTint="systemUltraThinMaterialDark"
      intensity={intensity}
      style={[styles.card, style]}>
      {children}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: Colors.light.glassStroke,
    backgroundColor: Colors.light.glassSurface,
    padding: 16,
  },
  fallback: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
});
