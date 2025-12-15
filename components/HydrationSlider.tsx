import { useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { radius, spacing, typography } from '@/constants/theme';
import { Typography } from '@/components/Typography';
import { useThemeColors } from '@/providers/ThemeProvider';

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  label: string;
  helper?: string;
};

export function HydrationSlider({
  value,
  min = 45,
  max = 90,
  onChange,
  label,
  helper,
}: Props) {
  const { colors } = useThemeColors();
  const widthRef = useRef(1);
  const [pressed, setPressed] = useState(false);

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const handleLayout = (e: LayoutChangeEvent) => {
    widthRef.current = e.nativeEvent.layout.width;
  };

  const handlePress = async (evt: any) => {
    const x = evt.nativeEvent.locationX;
    const percent = x / widthRef.current;
    const next = clamp(Math.round(min + (max - min) * percent));
    if (next !== value) {
      await Haptics.selectionAsync();
      onChange(next);
    }
  };

  const progress = (value - min) / (max - min);
  const knobLeft = `${Math.max(0, Math.min(1, progress)) * 100}%`;

  return (
    <View>
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
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={handlePress}
        onLayout={handleLayout}
        style={[
          styles.track,
          {
            backgroundColor: colors.glassSurface,
            borderColor: colors.border,
          },
        ]}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress * 100}%`,
              backgroundColor: colors.tint,
              opacity: 0.8,
            },
          ]}
        />
        <View
          style={[
            styles.knob,
            {
              left: knobLeft,
              borderColor: colors.glassStroke,
              backgroundColor: colors.card,
              transform: [{ translateX: -12 }],
              shadowOpacity: pressed ? 0.4 : 0.25,
            },
          ]}
        />
      </Pressable>
      <View style={styles.valueRow}>
        <Typography variant="title">{value}%</Typography>
        <Typography variant="label" color={colors.muted}>
          {min}% - {max}%
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  track: {
    height: 14,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  knob: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: -5,
    borderWidth: 1,
    shadowColor: '#000',
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  valueRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
