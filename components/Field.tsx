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
  const dynamicInputStyle = {
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
  };
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
          style={[styles.input, dynamicInputStyle, style]}
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
    gap: 8,
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
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    color: '#000',
    fontFamily: typography.medium,
    fontSize: 15,
  },
  suffix: {
    position: 'absolute',
    right: spacing.md,
  },
});
