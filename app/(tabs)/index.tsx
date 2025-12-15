import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Field } from "@/components/Field";
import { GlassCard } from "@/components/GlassCard";
import { HydrationSlider } from "@/components/HydrationSlider";
import { ResultRow } from "@/components/ResultRow";
import { ScreenBackground } from "@/components/ScreenBackground";
import { Stepper } from "@/components/Stepper";
import { Typography } from "@/components/Typography";
import { radius, spacing } from "@/constants/theme";
import {
  FORM_STORAGE_KEY,
  PizzaStyle,
  SAVED_RECIPES_KEY,
  YeastType,
  calculatePizza,
  defaultPizzaInput,
  recipeDefaults,
} from "@/lib/pizzaCalculator";
import { useTranslation } from "@/providers/LocalizationProvider";
import { useThemeColors } from "@/providers/ThemeProvider";

type FormState = {
  style: PizzaStyle;
  yeastType: YeastType;
  number: string;
  gramsPerPizza: string;
  hydration: string;
  saveName: string;
};

const styleOptions: PizzaStyle[] = [
  "neapolitan",
  "new-york",
  "sicilian",
  "pan",
];
const yeastOptions: YeastType[] = ["fresh", "dry"];
type SheetType = "style" | "yeast" | "count" | null;
type Option = {
  key: string;
  label: string;
  description?: string;
  icon?: keyof typeof Feather.glyphMap;
};

export default function CalculatorScreen() {
  const { t, language } = useTranslation();
  const { colors } = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [sheet, setSheet] = useState<SheetType>(null);
  const styleAnim = useRef(new Animated.Value(1)).current;
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [form, setForm] = useState<FormState>({
    style: defaultPizzaInput.style,
    yeastType: defaultPizzaInput.yeastType,
    number: String(defaultPizzaInput.number),
    gramsPerPizza: String(defaultPizzaInput.gramsPerPizza),
    hydration: String(recipeDefaults[defaultPizzaInput.style].waterShare),
    saveName: "",
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
            const yeastType = yeastOptions.includes(
              parsed.yeastType as YeastType
            )
              ? (parsed.yeastType as YeastType)
              : defaultPizzaInput.yeastType;
            const number =
              parsed.number && /^\d+$/.test(parsed.number)
                ? parsed.number
                : `${defaultPizzaInput.number}`;
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
              saveName: parsed.saveName ?? "",
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
    AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form)).catch(
      () => undefined
    );
  }, [form, hydrated]);

  const parsed = {
    style: form.style,
    yeastType: form.yeastType,
    number: Math.max(1, parseInt(form.number || "0", 10) || 0),
    gramsPerPizza: Math.max(1, parseInt(form.gramsPerPizza || "0", 10) || 0),
    waterShare: Math.max(
      45,
      Math.min(
        90,
        parseInt(form.hydration || "0", 10) ||
          recipeDefaults[form.style].waterShare
      )
    ),
  };

  const result = useMemo(() => calculatePizza(parsed), [parsed]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(language === "cs" ? "cs-CZ" : "en-US", {
        maximumFractionDigits: 1,
      }),
    [language]
  );

  const handleShare = async () => {
    await Haptics.selectionAsync();
    const text = [
      `${t("appTitle")} – ${t(`style_${result.style.replace("-", "_")}`)}`,
      `${t("numberLabel")}: ${parsed.number}`,
      `${t("gramsLabel")}: ${parsed.gramsPerPizza} g`,
      `${t("flour")}: ${result.flour} g`,
      `${t("water")}: ${result.water} g`,
      `${t("salt")}: ${result.salt} g`,
      `${t("yeast")}: ${result.yeast} g`,
      result.sugar ? `${t("sugar")}: ${result.sugar} g` : null,
      result.oil ? `${t("oil")}: ${result.oil} g` : null,
      result.semolina ? `${t("semolina")}: ${result.semolina} g` : null,
    ]
      .filter(Boolean)
      .join("\n");
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
      hydration: String(defaults.waterShare),
      saveName: "",
    });
  };

  const formatWeight = (value: number) => formatter.format(value);

  const setStyle = async (value: PizzaStyle) => {
    await Haptics.selectionAsync();
    const defaults = recipeDefaults[value];
    Animated.sequence([
      Animated.timing(styleAnim, { toValue: 0.92, duration: 120, useNativeDriver: true }),
      Animated.spring(styleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start();
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
    if (saving) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);
    const payload = calculatePizza(parsed);
    const entry = {
      id: `${Date.now()}`,
      title:
        form.saveName.trim() ||
        `${t(`style_${payload.style.replace("-", "_")}`)} • ${parsed.number}×${
          parsed.gramsPerPizza
        }g`,
      createdAt: Date.now(),
      result: payload,
    };
    try {
      const raw = await AsyncStorage.getItem(SAVED_RECIPES_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(entry);
      await AsyncStorage.setItem(
        SAVED_RECIPES_KEY,
        JSON.stringify(list.slice(0, 30))
      );
    } catch (_) {
      // ignore
    } finally {
      setSaving(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topRow, styles.maxWidth]}>
          <View style={{ flex: 1 }}>
            <Typography variant="display">{t("appTitle")}</Typography>
            <Typography
              variant="subtitle"
              color={colors.muted}
              style={{ marginTop: 6 }}
            >
              {t("appSubtitle")}
            </Typography>
          </View>
          <Pressable
            onPress={() => router.push("/settings")}
            style={({ pressed }) => [
              styles.iconButton,
              {
                opacity: pressed ? 0.6 : 1,
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="settings" size={20} color={colors.text} />
          </Pressable>
        </View>

        <Animated.View style={{ transform: [{ scale: styleAnim }] }}>
          <GlassCard style={styles.heroCard} intensity={85}>
            <Typography variant="label" color={colors.muted} style={{ marginBottom: spacing.xs }}>
              {t("summaryTitle")}
            </Typography>
            <Typography variant="display" style={{ marginBottom: spacing.lg }}>
              {t(`style_${result.style.replace("-", "_")}`)}
            </Typography>
            <View style={styles.heroMetrics}>
              <View style={styles.metricBox}>
                <Typography variant="label" color={colors.muted} style={{ marginBottom: spacing.xs }}>
                  {t("totalWeight")}
                </Typography>
                <Typography variant="title">
                  {formatWeight(result.totalWeight)} g
                </Typography>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricBox}>
                <Typography variant="label" color={colors.muted} style={{ marginBottom: spacing.xs }}>
                  {t("hydration")}
                </Typography>
                <Typography variant="title">
                  {result.hydration}%
                </Typography>
              </View>
            </View>
          </GlassCard>
        </Animated.View>

        <GlassCard style={[styles.card, { marginTop: spacing.lg }]}>
          <FieldButton
            label={t("styleLabel")}
            value={t(`style_${form.style.replace("-", "_")}`)}
            icon="pizza"
            onPress={() => setSheet("style")}
          />

          <View style={{ marginTop: spacing.md }}>
            <FieldButton
              label={t("yeastLabel")}
              value={form.yeastType === "fresh" ? t("freshYeast") : t("dryYeast")}
              icon="droplet"
              onPress={() => setSheet("yeast")}
            />
          </View>

          <View style={{ marginTop: spacing.md }}>
            <FieldButton
              label={t("numberLabel")}
              value={`${parsed.number}`}
              icon="hash"
              onPress={() => setSheet("count")}
            />
          </View>

          <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
            <Stepper
              label={t("numberLabel")}
              value={parsed.number}
              min={1}
              max={50}
              onChange={(num) =>
                setForm((prev) => ({ ...prev, number: String(num) }))
              }
            />
            <Stepper
              label={t("gramsLabel")}
              value={parsed.gramsPerPizza}
              min={80}
              max={800}
              step={10}
              suffix="g"
              onChange={(num) =>
                setForm((prev) => ({ ...prev, gramsPerPizza: String(num) }))
              }
            />
          </View>

          <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
            <HydrationSlider
              label={t("hydrationInput")}
              value={parsed.waterShare}
              min={45}
              max={90}
              onChange={(num) =>
                setForm((prev) => ({ ...prev, hydration: String(num) }))
              }
              helper="45–90%"
            />
            <Field
              label={t("recipeName")}
              value={form.saveName}
              onChangeText={(text) =>
                setForm((prev) => ({ ...prev, saveName: text }))
              }
              placeholder={t(`style_${form.style.replace("-", "_")}`)}
            />
          </View>

        <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
          <Typography variant="label" color={colors.muted}>
            Quick presets
          </Typography>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
            {[
              { label: "🍕 2 × 230g", number: 2, grams: 230 },
              { label: "👨‍👩‍👧‍👦 4 × 260g", number: 4, grams: 260 },
              { label: "🎉 8 × 250g", number: 8, grams: 250 },
            ].map((preset) => (
              <Pressable
                key={preset.label}
                onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setForm((prev) => ({
                    ...prev,
                    number: String(preset.number),
                    gramsPerPizza: String(preset.grams),
                  }));
                  }}
                  style={({ pressed }) => [
                    styles.pill,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.glassSurface,
                      opacity: pressed ? 0.6 : 1,
                    },
                  ]}
                >
                  <Typography variant="label">{preset.label}</Typography>
                </Pressable>
              ))}
            </View>
          </View>
        </GlassCard>

        <GlassCard style={[styles.card, { marginTop: spacing.xl }]}>
          <Typography variant="title" style={{ marginBottom: spacing.md }}>
            {t("resultsTitle")}
          </Typography>
          <View
            style={{
              flexDirection: width > 720 ? "row" : "column",
              flexWrap: "wrap",
              gap: spacing.md,
            }}
          >
            <View style={[styles.resultColumn, { flex: 1 }]}>
              <ResultRow
                label={t("flour")}
                value={result.flour}
                formatter={formatWeight}
              />
              {result.semolina ? (
                <ResultRow
                  label={t("semolina")}
                  value={result.semolina}
                  formatter={formatWeight}
                />
              ) : null}
              <ResultRow
                label={t("water")}
                value={result.water}
                formatter={formatWeight}
              />
            </View>
            <View style={[styles.resultColumn, { flex: 1 }]}>
              <ResultRow
                label={t("salt")}
                value={result.salt}
                formatter={formatWeight}
              />
              <ResultRow
                label={t("yeast")}
                value={result.yeast}
                formatter={formatWeight}
              />
              {result.sugar ? (
                <ResultRow
                  label={t("sugar")}
                  value={result.sugar}
                  formatter={formatWeight}
                />
              ) : null}
              {result.oil ? (
                <ResultRow
                  label={t("oil")}
                  value={result.oil}
                  formatter={formatWeight}
                />
              ) : null}
            </View>
          </View>
          <View style={styles.footerNote}>
            <Typography variant="label" color={colors.muted}>
              {t("footerCredit")}
            </Typography>
          </View>
        </GlassCard>

        <GlassCard style={[styles.card, { marginTop: spacing.xl }]}>
          <Typography variant="title" style={{ marginBottom: spacing.lg }}>
            Actions
          </Typography>
          <View style={styles.actionButtons}>
            <Pressable
              onPress={resetForm}
              style={({ pressed }) => [
                styles.actionButton,
                { 
                  opacity: pressed ? 0.6 : 1, 
                  borderColor: colors.border,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <Feather name="rotate-ccw" size={20} color={colors.text} style={{ marginBottom: spacing.xs }} />
              <Typography variant="label" color={colors.text}>
                {t("reset")}
              </Typography>
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  opacity: pressed ? 0.85 : 1,
                  backgroundColor: parsed.number > 0 ? colors.tint : colors.border,
                  borderColor: parsed.number > 0 ? colors.tint : colors.border,
                },
              ]}
              disabled={parsed.number <= 0}
            >
              <Feather name="share-2" size={20} color="#FFFFFF" style={{ marginBottom: spacing.xs }} />
              <Typography variant="label" color="#FFFFFF">
                {t("share")}
              </Typography>
            </Pressable>
            <Pressable
              onPress={saveRecipe}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  opacity: pressed ? 0.6 : 1,
                  borderColor: saving ? colors.border : colors.tint,
                  backgroundColor: saving ? colors.glassSurface : colors.card,
                },
              ]}
              disabled={saving}
            >
              <Feather name="bookmark" size={20} color={saving ? colors.muted : colors.tint} style={{ marginBottom: spacing.xs }} />
              <Typography variant="label" color={saving ? colors.muted : colors.tint}>
                {saving ? "…" : t("save")}
              </Typography>
            </Pressable>
          </View>
          {savedFlash ? (
            <View style={[styles.flashRow, { marginTop: spacing.md }]}>
              <Feather name="check" size={16} color={colors.tint} />
              <Typography variant="body" color={colors.tint} style={{ marginLeft: spacing.sm }}>
                {t("saved")}
              </Typography>
            </View>
          ) : null}
        </GlassCard>
      </ScrollView>

      <OptionSheet
        visible={sheet === "style"}
        title={t("styleLabel")}
        selected={form.style}
        options={styleOptions.map((value) => ({
          key: value,
          label: t(`style_${value.replace("-", "_")}`),
          description:
            value === "neapolitan"
              ? "65% hydratace, lehký cornicione"
              : value === "new-york"
                ? "Cukr/olej, delší pečení"
                : value === "sicilian"
                  ? "Plech, křupavý spodek v oleji"
                  : "Nadýchaný střed, olej",
          icon: "pizza",
        }))}
        onSelect={async (key) => {
          await Haptics.selectionAsync();
          setStyle(key as PizzaStyle);
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        visible={sheet === "yeast"}
        title={t("yeastLabel")}
        selected={form.yeastType}
        options={[
          { key: "fresh", label: t("freshYeast"), icon: "droplet", description: "Rychlejší start, potřeba chlad" },
          { key: "dry", label: t("dryYeast"), icon: "cloud-drizzle", description: "Poloviční dávka čerstvého" },
        ]}
        onSelect={async (key) => {
          await Haptics.selectionAsync();
          setYeast(key as YeastType);
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
      <OptionSheet
        visible={sheet === "count"}
        title={t("numberLabel")}
        selected={form.number}
        options={[
          { key: "2", label: "🍕 2", description: "Rychlá večeře" },
          { key: "4", label: "🔥 4", description: "Rodinná porce" },
          { key: "6", label: "🎉 6", description: "Party mix" },
          { key: "8", label: "🥳 8", description: "Více hladových" },
        ]}
        onSelect={async (key) => {
          await Haptics.selectionAsync();
          setForm((prev) => ({ ...prev, number: key }));
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing.xxl,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  heroCard: {
    marginTop: spacing.md,
    padding: spacing.lg,
  },
  heroMetrics: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricBox: {
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    minHeight: 80,
  },
  footerNote: {
    marginTop: spacing.lg,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  flashRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
  },
  maxWidth: {
    width: "100%",
  },
  fieldButton: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  resultColumn: {
    minWidth: 200,
    flex: 1,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: "hidden",
  },
  sheetItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  sheetClose: {
    padding: spacing.lg,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
});

const ButtonLabel = memo(function ButtonLabel({
  icon,
  text,
  color,
}: {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  color: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Feather name={icon} size={16} color={color} />
      <Typography variant="button" color={color}>
        {text}
      </Typography>
    </View>
  );
});

function FieldButton({
  label,
  value,
  icon,
  onPress,
}: {
  label: string;
  value: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}) {
  const { colors } = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fieldButton,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
        <Feather name={icon} size={20} color={colors.muted} />
        <View style={{ flex: 1 }}>
          <Typography variant="label" color={colors.muted}>
            {label}
          </Typography>
          <Typography variant="title" style={{ marginTop: 4 }}>{value}</Typography>
        </View>
        <Feather name="chevron-right" size={20} color={colors.muted} />
      </View>
    </Pressable>
  );
}

function OptionSheet({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: Option[];
  selected?: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const { colors } = useThemeColors();
  const { t } = useTranslation();
  const translate = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translate, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translate, {
        toValue: 300,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translate]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              transform: [{ translateY: translate }],
            },
          ]}
        >
          <View style={{ padding: spacing.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
            <Typography variant="title">{title}</Typography>
          </View>
          {options.map((opt) => {
            const active = selected === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => onSelect(opt.key)}
                style={({ pressed }) => [
                  styles.sheetItem,
                  {
                    backgroundColor: pressed ? colors.glassSurface : colors.card,
                  },
                ]}
              >
                <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center", flex: 1 }}>
                  {opt.icon ? <Feather name={opt.icon} size={18} color={colors.muted} /> : null}
                  <View style={{ flex: 1 }}>
                    <Typography variant="title">{opt.label}</Typography>
                    {opt.description ? (
                      <Typography variant="label" color={colors.muted}>
                        {opt.description}
                      </Typography>
                    ) : null}
                  </View>
                </View>
                {active ? <Feather name="check" size={16} color={colors.tint} /> : null}
              </Pressable>
            );
          })}
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.sheetClose,
              { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Typography variant="button">{t("reset")}</Typography>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
