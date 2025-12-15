import { ScrollView, StyleSheet, View } from 'react-native';

import Colors from '@/constants/Colors';
import { spacing } from '@/constants/theme';
import { GlassCard } from '@/components/GlassCard';
import { ScreenBackground } from '@/components/ScreenBackground';
import { Typography } from '@/components/Typography';
import { useTranslation } from '@/providers/LocalizationProvider';

export default function TipsScreen() {
  const { t } = useTranslation();
  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Typography variant="display" style={{ marginTop: spacing.md }}>
          {t('tipsTitle')}
        </Typography>
        <Typography variant="subtitle" color={Colors.light.muted} style={{ marginTop: 6 }}>
          {t('appSubtitle')}
        </Typography>

        <GlassCard style={{ marginTop: spacing.lg }}>
          <TipBlock title={t('tipHydrationTitle')} body={t('tipHydrationBody')} />
          <Divider />
          <TipBlock title={t('tipFermentationTitle')} body={t('tipFermentationBody')} />
          <Divider />
          <TipBlock title={t('tipBakingTitle')} body={t('tipBakingBody')} />
        </GlassCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

function TipBlock({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ gap: 6 }}>
      <Typography variant="title">{title}</Typography>
      <Typography variant="body" color={Colors.light.muted}>
        {body}
      </Typography>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 120,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: spacing.md,
  },
});
