import { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

import Colors from '@/constants/Colors';
import { useTranslation } from '@/providers/LocalizationProvider';

export default function TabLayout() {
  const { t } = useTranslation();
  const glassAvailable = isLiquidGlassAvailable() && Platform.OS === 'ios';

  const glassBackground = () => (
    <GlassView blurTint="systemChromeMaterialDark" intensity={70} style={StyleSheet.absoluteFill}>
      <View style={styles.barOverlay} />
    </GlassView>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: [styles.tabBar, !glassAvailable && styles.tabBarFallback],
        headerShown: false,
        tabBarBackground: glassAvailable ? glassBackground : undefined,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabCalculator'),
          tabBarLabel: t('tabCalculator'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              activeName="calculator"
              inactiveName="calculator-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: t('tabTips'),
          tabBarLabel: t('tabTips'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} activeName="bulb" inactiveName="bulb-outline" />
          ),
        }}
      />
    </Tabs>
  );
}

type TabIconProps = {
  color: string;
  focused: boolean;
  activeName: keyof typeof Ionicons.glyphMap;
  inactiveName: keyof typeof Ionicons.glyphMap;
};

function TabIcon({ color, focused, activeName, inactiveName }: TabIconProps) {
  const scale = useRef(new Animated.Value(focused ? 1.05 : 0.95)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.05 : 0.95,
      useNativeDriver: true,
      friction: 9,
      tension: 120,
    }).start();
  }, [focused, scale]);

  const name = focused ? activeName : inactiveName;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Ionicons name={name} size={24} color={color} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    borderRadius: 22,
    paddingHorizontal: 6,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderColor: Colors.light.glassStroke,
    borderWidth: 1,
  },
  barOverlay: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.light.glassStroke,
  },
  tabBarFallback: {
    backgroundColor: Colors.light.card,
  },
});
