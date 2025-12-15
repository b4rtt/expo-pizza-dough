import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { Platform, StyleSheet, View } from 'react-native';

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
            <Feather name={focused ? 'pie-chart' : 'pie-chart'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: t('tabTips'),
          tabBarLabel: t('tabTips'),
          tabBarIcon: ({ color }) => <Feather name="wind" size={22} color={color} />,
        }}
      />
    </Tabs>
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
