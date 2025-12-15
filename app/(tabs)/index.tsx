import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Share, StyleSheet, View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '@/constants/Colors';
import { radius, spacing, typography } from '@/constants/theme';
import { Field } from '@/components/Field';
import { GlassCard } from '@/components/GlassCard';
import { ResultRow } from '@/components/ResultRow';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Typography } from '@/components/Typography';
import {
  PizzaStyle,
  YeastType,
  calculatePizza,
  defaultPizzaInput,
  recipeDefaults,
} from '@/lib/pizzaCalculator';
import { useTranslation } from '@/providers/LocalizationProvider';

type FormState = {
  style: PizzaStyle;
  yeastType: YeastType;
  number: string;
  gramsPerPizza: string;
};

const styleOptions: PizzaStyle[] = ['neapolitan', 'new-york', 'sicilian', 'pan'];
const yeastOptions: YeastType[] = ['fresh', 'dry'];
const STORAGE_KEY = '@pizza-form-v1';

export default function CalculatorScreen() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    style: defaultPizzaInput.style,
    yeastType: defaultPizzaInput.yeastType,
    number: String(defaultPizzaInput.number),
    gramsPerPizza: String(defaultPizzaInput.gramsPerPizza),
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setHydrated(true);
          return;
        }
        const parsed = JSON.parse(raw) as Partial<FormState>;
        const style = styleOptions.includes(parsed.style as PizzaStyle)
          ? (parsed.style as PizzaStyle)
          : defaultPizzaInput.style;
        const yeastType = yeastOptions.includes(parsed.yeastType as YeastType)
          ? (parsed.yeastType as YeastType)
          : defaultPizzaInput.yeastType;
        const number = parsed.number && /^\d+$/.test(parsed.number) ? parsed.number : `${defaultPizzaInput.number}`;
        const gramsPerPizza =
          parsed.gramsPerPizza && /^\d+$/.test(parsed.gramsPerPizza)
            ? parsed.gramsPerPizza
            : `${defaultPizzaInput.gramsPerPizza}`;
        setForm({ style, yeastType, number, gramsPerPizza });
      } catch (_) {
        // ignore hydration errors
      } finally {
        setHydrated(true);
      }
    };
    hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(form)).catch(() => undefined);
  }, [form, hydrated]);

  const parsed = {
    style: form.style,
    yeastType: form.yeastType,
    number: Math.max(1, parseInt(form.number || '0', 10) || 0),
    gramsPerPizza: Math.max(1, parseInt(form.gramsPerPizza || '0', 10) || 0),
  };

  const result = useMemo(() => calculatePizza(parsed), [parsed]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(language === 'cs' ? 'cs-CZ' : 'en-US', {
        maximumFractionDigits: 1,
      }),
    [language]
  );

  const handleShare = async () => {
    await Haptics.selectionAsync();
    const text = [
      `${t('appTitle')} – ${t(`style_${result.style.replace('-', '_')}`)}`,
      `${t('numberLabel')}: ${parsed.number}`,
      `${t('gramsLabel')}: ${parsed.gramsPerPizza} g`,
      `${t('flour')}: ${result.flour} g`,
      `${t('water')}: ${result.water} g`,
      `${t('salt')}: ${result.salt} g`,
      `${t('yeast')}: ${result.yeast} g`,
      result.sugar ? `${t('sugar')}: ${result.sugar} g` : null,
      result.oil ? `${t('oil')}: ${result.oil} g` : null,
      result.semolina ? `${t('semolina')}: ${result.semolina} g` : null,
    ]
      .filter(Boolean)
      .join('\n');
    Share.share({ message: text });
  };

  const resetForm = async () => {
    await Haptics.selectionAsync();
    const defaults = recipeDefaults[form.style];
    setForm({
      style: defaults.type,
      yeastType: defaults.yeastType,
      number: String(defaults.number),
      gramsPerPizza: String(defaults.gramsPerPizza),
    });
  };

  const formatWeight = (value: number) => formatter.format(value);

  const setStyle = async (value: PizzaStyle) => {
    await Haptics.selectionAsync();
    const defaults = recipeDefaults[value];
    setForm((prev) => ({
      ...prev,
      style: value,
      number: String(defaults.number),
      gramsPerPizza: String(defaults.gramsPerPizza),
      yeastType: defaults.yeastType,
    }));
  };

  const setYeast = async (value: YeastType) => {
    await Haptics.selectionAsync();
    setForm((prev) => ({ ...prev, yeastType: value }));
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Typography variant="display">{t('appTitle')}</Typography>
            <Typography variant="subtitle" color={Colors.light.muted} style={{ marginTop: 4 }}>
              {t('appSubtitle')}
            </Typography>
          </View>
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.7 : 1 }]}>
            <Feather name="settings" size={22} color={Colors.light.text} />
          </Pressable>
        </View>

        <GlassCard style={styles.heroCard} intensity={85}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Typography variant="label" color={Colors.light.muted}>
                {t('summaryTitle')}
              </Typography>
              <Typography variant="title" style={{ marginTop: 4 }}>
                {t(`style_${result.style.replace('-', '_')}`)}
              </Typography>
            </View>
            <View style={styles.metric}>
              <Typography variant="label" color={Colors.light.muted}>
                {t('totalWeight')}
              </Typography>
              <Typography variant="title">{formatWeight(result.totalWeight)} g</Typography>
            </View>
            <View style={styles.metric}>
              <Typography variant="label" color={Colors.light.muted}>
                {t('hydration')}
              </Typography>
              <Typography variant="title">{result.hydration}%</Typography>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: spacing.md }}>
          <Typography variant="label" color={Colors.light.muted} style={{ marginBottom: 8 }}>
            {t('styleLabel')}
          </Typography>
          <SegmentedControl
            options={styleOptions.map((style) => ({
              label: t(`style_${style.replace('-', '_')}`),
              value: style,
            }))}
            value={form.style}
            onChange={setStyle}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Typography variant="label" color={Colors.light.muted} style={{ marginBottom: 8 }}>
                {t('yeastLabel')}
              </Typography>
              <SegmentedControl
                options={yeastOptions.map((opt) => ({
                  label: opt === 'fresh' ? t('freshYeast') : t('dryYeast'),
                  value: opt,
                }))}
                value={form.yeastType}
                onChange={setYeast}
              />
            </View>
          </View>

          <View style={[styles.row, { marginTop: spacing.md }]}>
            <View style={{ flex: 1, marginRight: spacing.sm }}>
              <Field
                keyboardType="number-pad"
                label={t('numberLabel')}
                value={form.number}
                onChangeText={(text) => setForm((prev) => ({ ...prev, number: text.replace(/\D/g, '') }))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Field
                keyboardType="number-pad"
                label={t('gramsLabel')}
                suffix="g"
                value={form.gramsPerPizza}
                onChangeText={(text) =>
                  setForm((prev) => ({ ...prev, gramsPerPizza: text.replace(/\D/g, '') }))
                }
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={resetForm}
              style={({ pressed }) => [
                styles.secondaryButton,
                { opacity: pressed ? 0.7 : 1, borderColor: Colors.light.border },
              ]}>
              <Typography variant="button" color={Colors.light.text}>
                {t('reset')}
              </Typography>
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.85 : 1, backgroundColor: Colors.light.tint },
              ]}>
              <Typography variant="button" color="#0A1024">
                {t('share')}
              </Typography>
            </Pressable>
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: spacing.lg }}>
          <Typography variant="title" style={{ marginBottom: spacing.sm }}>
            {t('resultsTitle')}
          </Typography>
          <ResultRow label={t('flour')} value={result.flour} formatter={formatWeight} />
          {result.semolina ? (
            <ResultRow label={t('semolina')} value={result.semolina} formatter={formatWeight} />
          ) : null}
          <ResultRow label={t('water')} value={result.water} formatter={formatWeight} />
          <ResultRow label={t('salt')} value={result.salt} formatter={formatWeight} />
          <ResultRow label={t('yeast')} value={result.yeast} formatter={formatWeight} />
          {result.sugar ? (
            <ResultRow label={t('sugar')} value={result.sugar} formatter={formatWeight} />
          ) : null}
          {result.oil ? (
            <ResultRow label={t('oil')} value={result.oil} formatter={formatWeight} />
          ) : null}
          <View style={styles.footerNote}>
            <Typography variant="label" color={Colors.light.muted}>
              {t('footerCredit')}
            </Typography>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 120,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  heroCard: {
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metric: {
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.06)',
    minWidth: 110,
    borderWidth: 1,
    borderColor: Colors.light.glassStroke,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  footerNote: {
    marginTop: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
});
