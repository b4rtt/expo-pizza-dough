import { Pressable, ScrollView, Share, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { spacing } from "@/constants/theme";
import { GlassCard } from "@/components/GlassCard";
import { ScreenBackground } from "@/components/ScreenBackground";
import { Typography } from "@/components/Typography";
import { FORM_STORAGE_KEY, calculatePizza, defaultPizzaInput } from "@/lib/pizzaCalculator";
import { useTranslation } from "@/providers/LocalizationProvider";
import { useThemeColors } from "@/providers/ThemeProvider";

export default function TipsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useThemeColors();

  const handleReset = async () => {
    await Haptics.selectionAsync();
    await AsyncStorage.removeItem(FORM_STORAGE_KEY);
    router.push("/");
  };

  const handleShare = async () => {
    await Haptics.selectionAsync();
    try {
      const raw = await AsyncStorage.getItem(FORM_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : defaultPizzaInput;
      const result = calculatePizza({
        style: parsed.style ?? defaultPizzaInput.style,
        yeastType: parsed.yeastType ?? defaultPizzaInput.yeastType,
        number: parsed.number ? parseInt(parsed.number, 10) : defaultPizzaInput.number,
        gramsPerPizza: parsed.gramsPerPizza
          ? parseInt(parsed.gramsPerPizza, 10)
          : defaultPizzaInput.gramsPerPizza,
      });
      const text = [
        `${t("appTitle")} – ${t(`style_${result.style.replace("-", "_")}`)}`,
        `${t("numberLabel")}: ${result.number}`,
        `${t("gramsLabel")}: ${result.gramsPerPizza} g`,
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
    } catch {
      // ignore
    }
  };

  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Typography variant="display" style={{ marginTop: spacing.md }}>
          {t("tipsTitle")}
        </Typography>
        <Typography variant="subtitle" color={colors.muted} style={{ marginTop: 6 }}>
          {t("appSubtitle")}
        </Typography>

        <GlassCard style={{ marginTop: spacing.lg }}>
          <TipBlock title={t("tipHydrationTitle")} body={t("tipHydrationBody")} />
          <Divider />
          <TipBlock title={t("tipFermentationTitle")} body={t("tipFermentationBody")} />
          <Divider />
          <TipBlock title={t("tipBakingTitle")} body={t("tipBakingBody")} />
        </GlassCard>

        <GlassCard style={{ marginTop: spacing.lg }}>
          <Typography variant="title" style={{ marginBottom: spacing.sm }}>
            {t("tipActionsTitle")}
          </Typography>
          <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm }}>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.pill,
                { opacity: pressed ? 0.7 : 1, borderColor: colors.border },
              ]}
            >
              <Typography variant="button" color={colors.tint}>
                {t("tipShare")}
              </Typography>
            </Pressable>
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                styles.pill,
                { opacity: pressed ? 0.7 : 1, borderColor: colors.border },
              ]}
            >
              <Typography variant="button" color={colors.text}>
                {t("tipReset")}
              </Typography>
            </Pressable>
            <Pressable
              onPress={() => router.push("/recipes")}
              style={({ pressed }) => [
                styles.pill,
                { opacity: pressed ? 0.7 : 1, borderColor: colors.border },
              ]}
            >
              <Typography variant="button" color={colors.text}>
                {t("tipSaved")}
              </Typography>
            </Pressable>
          </View>
        </GlassCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

function TipBlock({ title, body }: { title: string; body: string }) {
  const { colors } = useThemeColors();
  return (
    <View style={{ gap: 6 }}>
      <Typography variant="title">{title}</Typography>
      <Typography variant="body" color={colors.muted}>
        {body}
      </Typography>
    </View>
  );
}

function Divider() {
  const { colors } = useThemeColors();
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 120,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  pill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
});
