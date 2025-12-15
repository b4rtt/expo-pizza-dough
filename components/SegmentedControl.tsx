import { Pressable, StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import { radius, spacing, typography } from '@/constants/theme';
import { Typography } from './Typography';

type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.pill,
              {
                backgroundColor: active ? Colors.light.tint : 'transparent',
                borderColor: active ? Colors.light.tint : Colors.light.border,
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <Typography
              variant="label"
              color={active ? '#0A1024' : Colors.light.text}
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
