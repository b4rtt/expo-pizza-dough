import { useEffect, useMemo, useState } from 'react';
import { ScrollView, Share, StyleSheet, View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { radius, spacing, typography } from '@/constants/theme';
import { Field } from '@/components/Field';
import { GlassCard } from '@/components/GlassCard';
import { ResultRow } from '@/components/ResultRow';
import { ScreenBackground } from '@/components/ScreenBackground';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Typography } from '@/components/Typography';
import {
  FORM_STORAGE_KEY,
  PizzaStyle,
  SAVED_RECIPES_KEY,
  YeastType,
  calculatePizza,
  defaultPizzaInput,
  recipeDefaults,
} from '@/lib/pizzaCalculator';
import { useTranslation } from '@/providers/LocalizationProvider';
import { useThemeColors } from '@/providers/ThemeProvider';

type FormState = {
  style: PizzaStyle;
  yeastType: YeastType;
  number: string;
  gramsPerPizza: string;
  hydration: string;
  saveName: string;
};

const styleOptions: PizzaStyle[] = ['neapolitan', 'new-york', 'sicilian', 'pan'];
const yeastOptions: YeastType[] = ['fresh', 'dry'];

export default function CalculatorScreen() {
  const { t, language } = useTranslation();
  const { colors } = useThemeColors();
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    style: defaultPizzaInput.style,
    yeastType: defaultPizzaInput.yeastType,
    number: String(defaultPizzaInput.number),
    gramsPerPizza: String(defaultPizzaInput.gramsPerPizza),
    hydration: String(recipeDefaults[defaultPizzaInput.style].waterShare),
    saveName: '',
  });
  const [hydrated, setHydrated] = useState(false);

  useFocusEffect(
    useMemo(
      () => () => {
        const hydrate = async () => {
          try {
            const raw = await AsyncStorage.getItem(FORM_STORAGE_KEY);
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
            const number =
              parsed.number && /^\d+$/.test(parsed.number) ? parsed.number : `${defaultPizzaInput.number}`;
            const gramsPerPizza =
              parsed.gramsPerPizza && /^\d+$/.test(parsed.gramsPerPizza)
                ? parsed.gramsPerPizza
                : `${defaultPizzaInput.gramsPerPizza}`;
            const hydration =
              parsed.hydration && /^\d+$/.test(parsed.hydration)
                ? parsed.hydration
                : `${recipeDefaults[style].waterShare}`;
            setForm({
              style,
              yeastType,
              number,
              gramsPerPizza,
              hydration,
              saveName: parsed.saveName ?? '',
            });
          } catch (_) {
            // ignore hydration errors
          } finally {
            setHydrated(true);
          }
        };
        hydrate();
      },
      []
    )
  );

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form)).catch(() => undefined);
  }, [form, hydrated]);

  const parsed = {
    style: form.style,
    yeastType: form.yeastType,
    number: Math.max(1, parseInt(form.number || '0', 10) || 0),
    gramsPerPizza: Math.max(1, parseInt(form.gramsPerPizza || '0', 10) || 0),
    waterShare: Math.max(45, Math.min(90, parseInt(form.hydration || '0', 10) || recipeDefaults[form.style].waterShare)),
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
      hydration: String(defaults.waterShare),
    }));
  };

  const setYeast = async (value: YeastType) => {
    await Haptics.selectionAsync();
    setForm((prev) => ({ ...prev, yeastType: value }));
  };

  const saveRecipe = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const payload = calculatePizza(parsed);
    const entry = {
      id: `${Date.now()}`,
      title:
        form.saveName.trim() ||
        `${t(`style_${payload.style.replace('-', '_')}`)} • ${parsed.number}×${parsed.gramsPerPizza}g`,
      createdAt: Date.now(),
      result: payload,
    };
    try {
      const raw = await AsyncStorage.getItem(SAVED_RECIPES_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      await AsyncStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(list.slice(0, 30)));
    } catch (_) {
      // ignore
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View style={{ flex: 1 }}>
            <Typography variant="display">{t('appTitle')}</Typography>
            <Typography variant="subtitle" color={colors.muted} style={{ marginTop: 4 }}>
              {t('appSubtitle')}
            </Typography>
          </View>
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [
              styles.iconButton,
              { opacity: pressed ? 0.7 : 1, backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <Feather name="settings" size={22} color={colors.text} />
          </Pressable>
        </View>

        <GlassCard style={styles.heroCard} intensity={85}>
          <View style={styles.heroRow}>
            <View style={{ flex: 1 }}>
              <Typography variant="label" color={colors.muted}>
                {t('summaryTitle')}
              </Typography>
              <Typography variant="title" style={{ marginTop: 4 }}>
                {t(`style_${result.style.replace('-', '_')}`)}
              </Typography>
            </View>
            <View
              style={[
                styles.metric,
                { backgroundColor: colors.glassSurface, borderColor: colors.glassStroke },
              ]}>
              <Typography variant="label" color={colors.muted}>
                {t('totalWeight')}
              </Typography>
              <Typography variant="title">{formatWeight(result.totalWeight)} g</Typography>
            </View>
            <View
              style={[
                styles.metric,
                { backgroundColor: colors.glassSurface, borderColor: colors.glassStroke },
              ]}>
              <Typography variant="label" color={colors.muted}>
                {t('hydration')}
              </Typography>
              <Typography variant="title">{result.hydration}%</Typography>
            </View>
          </View>
        </GlassCard>

        <GlassCard style={{ marginTop: spacing.md }}>
          <Typography variant="label" color={colors.muted} style={{ marginBottom: 8 }}>
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
              <Typography variant="label" color={colors.muted} style={{ marginBottom: 8 }}>
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

          <View style={[styles.row, { marginTop: spacing.sm }]}>
            <View style={{ flex: 1 }}>
              <Field
                keyboardType="number-pad"
                label={t('hydrationInput')}
                suffix="%"
                value={form.hydration}
                onChangeText={(text) =>
                  setForm((prev) => ({
                    ...prev,
                    hydration: text.replace(/\D/g, '').slice(0, 2),
                  }))
                }
                helper="45-90%"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                label={t('recipeName')}
                value={form.saveName}
                onChangeText={(text) => setForm((prev) => ({ ...prev, saveName: text }))}
                placeholder={t(`style_${form.style.replace('-', '_')}`)}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={resetForm}
              style={({ pressed }) => [
                styles.secondaryButton,
                { opacity: pressed ? 0.7 : 1, borderColor: colors.border },
              ]}>
              <ButtonLabel icon="rotate-ccw" text={t('reset')} color={colors.text} />
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.primaryButton,
                { opacity: pressed ? 0.85 : 1, backgroundColor: colors.tint },
              ]}>
              <ButtonLabel icon="share-2" text={t('share')} color="#0A1024" />
            </Pressable>
            <Pressable
              onPress={saveRecipe}
              style={({ pressed }) => [
                styles.secondaryButton,
                { opacity: pressed ? 0.7 : 1, borderColor: colors.tint },
              ]}>
              <ButtonLabel icon="bookmark" text={t('save')} color={colors.tint} />
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
            <Typography variant="label" color={colors.muted}>
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
    minWidth: 110,
    borderWidth: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

function ButtonLabel({
  icon,
  text,
  color,
}: {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  color: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <Feather name={icon} size={16} color={color} />
      <Typography variant="button" color={color}>
        {text}
      </Typography>
    </View>
  );
}
