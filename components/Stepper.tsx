import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";

import { radius, spacing } from "@/constants/theme";
import { useThemeColors } from "@/providers/ThemeProvider";
import { Typography } from "./Typography";

type Props = {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

export function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  suffix,
}: Props) {
  const { colors } = useThemeColors();

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const change = async (delta: number) => {
    const next = clamp(value + delta);
    if (next === value) return;
    await Haptics.selectionAsync();
    onChange(next);
  };

  return (
    <View
      style={[
        styles.container,
        { borderColor: colors.border, backgroundColor: colors.card },
      ]}
    >
      <Typography
        variant="label"
        color={colors.muted}
        style={{ marginBottom: 8 }}
      >
        {label}
      </Typography>
      <View style={styles.row}>
        <Pressable
          onPress={() => change(-step)}
          style={({ pressed }) => [
            styles.button,
            {
              borderColor: colors.border,
              backgroundColor: colors.glassSurface,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
        >
          <Feather name="minus" size={16} color={colors.text} />
        </Pressable>
        <View style={styles.valueBox}>
          <Typography variant="title">
            {value}
            {suffix ? ` ${suffix}` : ""}
          </Typography>
        </View>
        <Pressable
          onPress={() => change(step)}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.tint,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="plus" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  valueBox: {
    flex: 1,
    alignItems: "center",
  },
});
