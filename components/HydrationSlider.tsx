import { useRef, useState } from 'react';
import { GestureResponderEvent, LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
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

  const handlePress = async (evt: GestureResponderEvent) => {
    const x = evt.nativeEvent.locationX;
    const percent = x / widthRef.current;
    const next = clamp(Math.round(min + (max - min) * percent));
    if (next !== value) {
      await Haptics.selectionAsync();
      onChange(next);
    }
  };

  const handleMove = (evt: GestureResponderEvent) => {
    const x = evt.nativeEvent.locationX;
    const percent = Math.max(0, Math.min(1, x / widthRef.current));
    const next = clamp(Math.round(min + (max - min) * percent));
    if (next !== value) {
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
      <View style={{ paddingVertical: spacing.sm, paddingHorizontal: spacing.sm }}>
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={handlePress}
          onResponderMove={handleMove}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
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
                opacity: 0.95,
              },
            ]}
          />
          <View
            style={[
              styles.knob,
              {
                left: knobLeft,
                borderColor: colors.tint,
                backgroundColor: "#FFFFFF",
                transform: [{ translateX: -14 }, { scale: pressed ? 1.1 : 1 }],
                shadowOpacity: pressed ? 0.3 : 0.2,
              },
            ]}
          />
        </Pressable>
      </View>
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
    marginBottom: 8,
  },
  track: {
    height: 8,
    borderRadius: 999,
    borderWidth: 0,
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: 999,
  },
  knob: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    top: -10,
    borderWidth: 3,
    shadowColor: '#000',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  valueRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
