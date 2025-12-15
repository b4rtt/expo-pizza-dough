import { StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import { typography } from '@/constants/theme';
import { Typography } from './Typography';

type Props = {
  label: string;
  value: number;
  unit?: string;
  formatter?: (value: number) => string;
};

export function ResultRow({ label, value, unit = 'g', formatter }: Props) {
  const displayValue = formatter ? formatter(value) : value.toString();
  return (
    <View style={styles.row}>
      <Typography variant="body" style={styles.label} color={Colors.light.muted}>
        {label}
      </Typography>
      <Typography variant="body" style={styles.value}>
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
    borderBottomColor: Colors.light.border,
  },
  label: {
    fontFamily: typography.medium,
  },
  value: {
    fontFamily: typography.bold,
  },
});
