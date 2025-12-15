import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { radius, spacing, typography } from '@/constants/theme';
import { useThemeColors } from '@/providers/ThemeProvider';
import { Typography } from './Typography';

type Props = TextInputProps & {
  label: string;
  suffix?: string;
  helper?: string;
};

export const Field = forwardRef<TextInput, Props>(({ label, suffix, helper, style, ...rest }, ref) => {
  const { colors } = useThemeColors();
  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Typography variant="label" color={colors.muted}>
          {label}
        </Typography>
        {helper ? (
          <Typography variant="label" color={colors.muted}>
            {helper}
          </Typography>
        ) : null}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.muted}
          {...rest}
        />
        {suffix ? (
          <Typography variant="label" color={colors.muted} style={styles.suffix}>
            {suffix}
          </Typography>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#1E2436',
    backgroundColor: '#0F172A',
    color: '#E7ECF7',
    fontFamily: typography.medium,
    fontSize: 16,
  },
  suffix: {
    position: 'absolute',
    right: spacing.md,
  },
});
