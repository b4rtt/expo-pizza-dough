import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';

import { radius, spacing, typography } from '@/constants/theme';
import { Typography } from './Typography';
import { useThemeColors } from '@/providers/ThemeProvider';

type Props = {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
};

export function Stepper({ label, value, onChange, min = 0, max = 9999, step = 1, suffix }: Props) {
  const { colors } = useThemeColors();

  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const change = async (delta: number) => {
    const next = clamp(value + delta);
    if (next === value) return;
    await Haptics.selectionAsync();
    onChange(next);
  };

  return (
    <View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.card }]}>
      <Typography variant="label" color={colors.muted} style={{ marginBottom: 6 }}>
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
              opacity: pressed ? 0.7 : 1,
            },
          ]}>
          <Feather name="minus" size={18} color={colors.text} />
        </Pressable>
        <View style={styles.valueBox}>
          <Typography variant="title">
            {value}
            {suffix ? ` ${suffix}` : ''}
          </Typography>
        </View>
        <Pressable
          onPress={() => change(step)}
          style={({ pressed }) => [
            styles.button,
            {
              borderColor: colors.border,
              backgroundColor: colors.tint,
              opacity: pressed ? 0.8 : 1,
            },
          ]}>
          <Feather name="plus" size={18} color="#0A1024" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueBox: {
    flex: 1,
    alignItems: 'center',
  },
});
