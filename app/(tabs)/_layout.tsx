import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';

import Colors from '@/constants/Colors';
import { useTranslation } from '@/providers/LocalizationProvider';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <NativeTabs
      disableTransparentOnScrollEdge
      appearance={Platform.OS === 'ios' ? 'glass' : 'floating'}
      tintColor={Platform.OS === 'ios' ? undefined : Colors.light.tint}
      labelStyle={{ color: Platform.OS === 'ios' ? undefined : Colors.light.muted }}>
      <NativeTabs.Trigger name="index">
        {Platform.select({
          ios: <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />,
          default: <VectorIcon family={Ionicons} name="calculator-outline" />,
        })}
        <Label>{t('tabCalculator')}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tips">
        {Platform.select({
          ios: <Icon sf={{ default: 'sparkles', selected: 'sparkles' }} />,
          default: <VectorIcon family={Ionicons} name="bulb-outline" />,
        })}
        <Label>{t('tabTips')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
