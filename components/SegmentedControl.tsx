import { Pressable, StyleSheet, View } from 'react-native';

import { radius, spacing, typography } from '@/constants/theme';
import { useThemeColors } from '@/providers/ThemeProvider';
import { Typography } from './Typography';

type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  fullWidth?: boolean;
};

export function SegmentedControl<T extends string>({ options, value, onChange, fullWidth }: Props<T>) {
  const { colors } = useThemeColors();
  return (
    <View style={[styles.container, fullWidth && { width: '100%' }]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: active ? colors.tint : 'transparent',
                borderColor: active ? colors.tint : colors.border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <Typography
              variant="label"
              color={active ? '#0A1024' : colors.text}
              style={{ fontFamily: active ? typography.bold : typography.medium }}>
              {opt.label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
