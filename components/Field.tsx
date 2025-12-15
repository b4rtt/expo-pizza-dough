import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import Colors from '@/constants/Colors';
import { radius, spacing, typography } from '@/constants/theme';
import { Typography } from './Typography';

type Props = TextInputProps & {
  label: string;
  suffix?: string;
  helper?: string;
};

export const Field = forwardRef<TextInput, Props>(({ label, suffix, helper, style, ...rest }, ref) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Typography variant="label" color={Colors.light.muted}>
          {label}
        </Typography>
        {helper ? (
          <Typography variant="label" color={Colors.light.muted}>
            {helper}
          </Typography>
        ) : null}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={Colors.light.muted}
          {...rest}
        />
        {suffix ? (
          <Typography variant="label" color={Colors.light.muted} style={styles.suffix}>
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
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
    color: Colors.light.text,
    fontFamily: typography.medium,
    fontSize: 16,
  },
  suffix: {
    position: 'absolute',
    right: spacing.md,
  },
});
