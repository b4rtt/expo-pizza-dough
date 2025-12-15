import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, View, ViewStyle } from "react-native";

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
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 260,
      delay: 50,
      useNativeDriver: true,
    }).start();
  }, [fade]);

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
        <Animated.View style={{ opacity: fade }}>{children}</Animated.View>
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
      <Animated.View style={{ opacity: fade }}>{children}</Animated.View>
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
