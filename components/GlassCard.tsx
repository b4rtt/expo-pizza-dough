import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { PropsWithChildren } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";

import Colors from "@/constants/Colors";
import { radius } from "@/constants/theme";

type Props = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
}>;

export function GlassCard({ children, style, intensity = 60 }: Props) {
  const canUseGlass = isLiquidGlassAvailable() && Platform.OS === "ios";
  const clampedIntensity = Math.max(0, Math.min(100, intensity));
  // expo-glass-effect doesn't expose a numeric "intensity"; approximate by tint opacity.
  const tintOpacity = 0.08 + (clampedIntensity / 100) * 0.22; // 0.08 -> 0.30
  const tintColor = `rgba(0,0,0,${tintOpacity.toFixed(3)})`;

  if (!canUseGlass) {
    return (
      <View style={[styles.card, styles.fallback, style]}>{children}</View>
    );
  }

  return (
    <GlassView
      glassEffectStyle="regular"
      tintColor={tintColor}
      style={[styles.card, style]}
    >
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
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
