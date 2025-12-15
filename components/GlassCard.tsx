import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { PropsWithChildren } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";

import { radius } from "@/constants/theme";
import { useThemeColors } from "@/providers/ThemeProvider";

type Props = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
}>;

export function GlassCard({ children, style, intensity = 60 }: Props) {
  const { colors } = useThemeColors();
  const canUseGlass = isLiquidGlassAvailable() && Platform.OS === "ios";
  const clampedIntensity = Math.max(0, Math.min(100, intensity));
  const tintOpacity = 0.08 + (clampedIntensity / 100) * 0.22;
  const tintColor = `rgba(0,0,0,${tintOpacity.toFixed(3)})`;

  if (!canUseGlass) {
    return (
      <View
        style={[
          styles.card,
          {
            borderColor: colors.glassStroke,
            backgroundColor: colors.glassSurface,
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <GlassView
      glassEffectStyle="regular"
      tintColor={tintColor}
      style={[
        styles.card,
        {
          borderColor: colors.glassStroke,
          backgroundColor: colors.glassSurface,
        },
        style,
      ]}
    >
      {children}
    </GlassView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 16,
  },
});
