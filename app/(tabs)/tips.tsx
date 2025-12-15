import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { memo } from "react";
import { ScrollView, Share, StyleSheet, View } from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { ScreenBackground } from "@/components/ScreenBackground";
import { Typography } from "@/components/Typography";
import { getInfoSections } from "@/constants/infoText";
import { radius, spacing } from "@/constants/theme";
import {
  FORM_STORAGE_KEY,
  calculatePizza,
  defaultPizzaInput,
} from "@/lib/pizzaCalculator";
import { useTranslation } from "@/providers/LocalizationProvider";
import { useThemeColors } from "@/providers/ThemeProvider";

export default function TipsScreen() {
  const { t, language } = useTranslation();
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
        number: parsed.number
          ? parseInt(parsed.number, 10)
          : defaultPizzaInput.number,
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="display" style={{ marginTop: spacing.lg }}>
          {t("tipsTitle")}
        </Typography>
        <Typography
          variant="subtitle"
          color={colors.muted}
          style={{ marginTop: 8 }}
        >
          {t("appSubtitle")}
        </Typography>

        <GlassCard style={{ marginTop: spacing.lg }}>
          <TipBlock
            title={t("tipHydrationTitle")}
            body={t("tipHydrationBody")}
          />
          <Divider />
          <TipBlock
            title={t("tipFermentationTitle")}
            body={t("tipFermentationBody")}
          />
          <Divider />
          <TipBlock title={t("tipBakingTitle")} body={t("tipBakingBody")} />
        </GlassCard>

        {/* <GlassCard style={{ marginTop: spacing.xl }}>
          <Typography variant="title" style={{ marginBottom: spacing.md }}>
            {t("tipActionsTitle")}
          </Typography>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.md,
              marginTop: spacing.md,
            }}
          >
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.pill,
                { opacity: pressed ? 0.6 : 1, borderColor: colors.border },
              ]}
            >
              <ButtonLabel
                icon="share-2"
                text={t("tipShare")}
                color={colors.tint}
              />
            </Pressable>
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                styles.pill,
                { opacity: pressed ? 0.6 : 1, borderColor: colors.border },
              ]}
            >
              <ButtonLabel
                icon="rotate-ccw"
                text={t("tipReset")}
                color={colors.text}
              />
            </Pressable>
            <Pressable
              onPress={() => router.push("/recipes")}
              style={({ pressed }) => [
                styles.pill,
                { opacity: pressed ? 0.6 : 1, borderColor: colors.border },
              ]}
            >
              <ButtonLabel
                icon="bookmark"
                text={t("tipSaved")}
                color={colors.text}
              />
            </Pressable>
          </View>
        </GlassCard> */}

        <GlassCard style={{ marginTop: spacing.xl }}>
          <Typography variant="title">{t("moreInfoTitle")}</Typography>
          {getInfoSections(language === "cs" ? "cs" : "en").map((section) => (
            <View key={section.title} style={styles.infoBlock}>
              <Typography variant="subtitle">
                {section.emoji} {section.title}
              </Typography>
              <Typography
                variant="body"
                color={colors.muted}
                style={{ marginTop: spacing.sm }}
              >
                {section.body}
              </Typography>
            </View>
          ))}
        </GlassCard>

        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenBackground>
  );
}

function TipBlock({ title, body }: { title: string; body: string }) {
  const { colors } = useThemeColors();
  return (
    <View style={{ gap: spacing.sm }}>
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
    paddingBottom: 140,
  },
  divider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  pill: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: "center",
  },
  infoBlock: {
    marginTop: spacing.xl,
    gap: spacing.md,
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
