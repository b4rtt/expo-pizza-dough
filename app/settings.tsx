import { useEffect } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useNavigation } from 'expo-router';
import Constants from 'expo-constants';

import { spacing } from '@/constants/theme';
import { GlassCard } from '@/components/GlassCard';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Typography } from '@/components/Typography';
import { Language } from '@/lib/i18n';
import { useTranslation } from '@/providers/LocalizationProvider';
import { useThemeColors } from '@/providers/ThemeProvider';

type LanguageOption = Language | 'device';
type ThemeOption = 'system' | 'light' | 'dark';

export default function SettingsScreen() {
  const { t, preference, setLanguage, useDeviceLanguage } = useTranslation();
  const { colors, mode, setMode } = useThemeColors();
  const navigation = useNavigation();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: t('settings'),
      headerTintColor: colors.text,
    });
  }, [navigation, t, colors.text]);

  const options: { label: string; value: LanguageOption }[] = [
    { label: t('settingsSystem'), value: 'device' },
    { label: t('settingsCs'), value: 'cs' },
    { label: t('settingsEn'), value: 'en' },
  ];

  const themeOptions: { label: string; value: ThemeOption }[] = [
    { label: t('settingsThemeSystem'), value: 'system' },
    { label: t('settingsThemeLight'), value: 'light' },
    { label: t('settingsThemeDark'), value: 'dark' },
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
        <GlassCard style={{ marginTop: spacing.xl }}>
          <Typography variant="label" color={colors.muted} style={{ marginBottom: 8 }}>
            {t('settingsLanguage')}
          </Typography>
          <SegmentedControl options={options} value={preference} onChange={handleChange} />
        </GlassCard>

        <GlassCard style={{ marginTop: spacing.md }}>
          <Typography variant="label" color={colors.muted} style={{ marginBottom: 8 }}>
            {t('settingsTheme')}
          </Typography>
          <SegmentedControl options={themeOptions} value={mode} onChange={setMode} fullWidth />
        </GlassCard>

        <GlassCard style={{ marginTop: spacing.md }}>
          <Typography variant="title">{t('settingsAbout')}</Typography>
          <Typography variant="body" color={colors.muted} style={{ marginTop: 6 }}>
            {t('footerCredit')}
          </Typography>
          <View style={{ marginTop: spacing.md, gap: 8 }}>
            <View style={styles.metaRow}>
              <Typography variant="label" color={colors.muted}>
                {t('settingsVersion')}
              </Typography>
              <Typography variant="label">{version}</Typography>
            </View>
            <View style={styles.metaRow}>
              <Typography variant="label" color={colors.muted}>
                {t('settingsOriginal')}
              </Typography>
              <Typography
                variant="label"
                style={[styles.link, { color: colors.tint }]}
                onPress={() => Linking.openURL('https://pizza.trojanischeresel.de/')}>
                {t('settingsOpenLink')}
              </Typography>
            </View>
          </View>
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {},
});
