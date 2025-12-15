import { useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';

import Colors from '@/constants/Colors';
import { spacing } from '@/constants/theme';
import { GlassCard } from '@/components/GlassCard';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Typography } from '@/components/Typography';
import { Language } from '@/lib/i18n';
import { useTranslation } from '@/providers/LocalizationProvider';

type LanguageOption = Language | 'device';

export default function SettingsScreen() {
  const { t, preference, setLanguage, useDeviceLanguage } = useTranslation();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: t('settings'),
      headerTintColor: Colors.light.text,
    });
  }, [navigation, t]);

  const options: { label: string; value: LanguageOption }[] = [
    { label: t('settingsSystem'), value: 'device' },
    { label: t('settingsCs'), value: 'cs' },
    { label: t('settingsEn'), value: 'en' },
  ];

  const handleChange = async (value: LanguageOption) => {
    await Haptics.selectionAsync();
    if (value === 'device') {
      await useDeviceLanguage();
    } else {
      await setLanguage(value);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Typography variant="display" style={{ marginTop: spacing.lg }}>
          {t('settings')}
        </Typography>
        <Typography variant="subtitle" color={Colors.light.muted} style={{ marginTop: 6 }}>
          {t('settingsLanguage')}
        </Typography>

        <GlassCard style={{ marginTop: spacing.lg }}>
          <Typography variant="label" color={Colors.light.muted} style={{ marginBottom: 8 }}>
            {t('settingsLanguage')}
          </Typography>
          <SegmentedControl options={options} value={preference} onChange={handleChange} />
        </GlassCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 120,
  },
});
