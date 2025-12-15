import { StyleSheet, View } from 'react-native';

import { typography } from '@/constants/theme';
import { useThemeColors } from '@/providers/ThemeProvider';
import { Typography } from './Typography';

type Props = {
  label: string;
  value: number;
  unit?: string;
  formatter?: (value: number) => string;
};

export function ResultRow({ label, value, unit = 'g', formatter }: Props) {
  const { colors } = useThemeColors();
  const displayValue = formatter ? formatter(value) : value.toString();
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Typography variant="body" style={styles.label} color={colors.muted}>
        {label}
      </Typography>
      <Typography variant="body" style={styles.value} color={colors.text}>
        {displayValue}
        {unit ? ` ${unit}` : ''}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontFamily: typography.medium,
  },
  value: {
    fontFamily: typography.bold,
  },
});
