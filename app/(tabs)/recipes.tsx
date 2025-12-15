import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";

import { GlassCard } from "@/components/GlassCard";
import { ScreenBackground } from "@/components/ScreenBackground";
import { Typography } from "@/components/Typography";
import { radius, spacing } from "@/constants/theme";
import { SAVED_RECIPES_KEY, SavedRecipe } from "@/lib/pizzaCalculator";
import { useTranslation } from "@/providers/LocalizationProvider";
import { useThemeColors } from "@/providers/ThemeProvider";

export default function RecipesScreen() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const { colors } = useThemeColors();
  const [items, setItems] = useState<SavedRecipe[]>([]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(language === "cs" ? "cs-CZ" : "en-US", {
        maximumFractionDigits: 1,
      }),
    [language]
  );

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const raw = await AsyncStorage.getItem(SAVED_RECIPES_KEY);
          setItems(raw ? JSON.parse(raw) : []);
        } catch (_) {
          setItems([]);
        }
      };
      load();
    }, [])
  );

  const shareRecipe = async (recipe: SavedRecipe) => {
    await Haptics.selectionAsync();
    const { result } = recipe;
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
  };

  const deleteRecipe = async (id: string) => {
    await Haptics.selectionAsync();
    Alert.alert(t("delete"), "", [
      { text: "Cancel", style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          const filtered = items.filter((r) => r.id !== id);
          setItems(filtered);
          try {
            await AsyncStorage.setItem(
              SAVED_RECIPES_KEY,
              JSON.stringify(filtered)
            );
          } catch (_) {
            // ignore
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: SavedRecipe }) => (
    <GlassCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Typography variant="title">{item.title}</Typography>
          <Typography
            variant="label"
            color={colors.muted}
            style={{ marginTop: 6 }}
          >
            {t(`style_${item.result.style.replace("-", "_")}`)} •{" "}
            {formatter.format(item.result.totalWeight)} g
          </Typography>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={() => shareRecipe(item)}
            style={({ pressed }) => [
              styles.iconButton,
              {
                opacity: pressed ? 0.6 : 1,
                backgroundColor: colors.glassSurface,
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="share-2" size={18} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={() => deleteRecipe(item.id)}
            style={({ pressed }) => [
              styles.iconButton,
              {
                opacity: pressed ? 0.6 : 1,
                backgroundColor: colors.glassSurface,
                borderColor: colors.border,
              },
            ]}
          >
            <Feather name="trash-2" size={18} color={colors.tint} />
          </Pressable>
        </View>
      </View>
      <View style={styles.tags}>
        <Tag
          icon="droplet"
          label={`${item.result.hydration}%`}
          color={colors.secondary}
        />
        <Tag
          icon={item.result.yeastType === "fresh" ? "zap" : "package"}
          label={t(
            item.result.yeastType === "fresh" ? "freshYeast" : "dryYeast"
          )}
        />
      </View>
      <View style={styles.row}>
        <Typography variant="body" color={colors.muted}>
          {t("flour")}
        </Typography>
        <Typography variant="body">
          {formatter.format(item.result.flour)} g
        </Typography>
      </View>
      {item.result.semolina ? (
        <View style={styles.row}>
          <Typography variant="body" color={colors.muted}>
            {t("semolina")}
          </Typography>
          <Typography variant="body">
            {formatter.format(item.result.semolina)} g
          </Typography>
        </View>
      ) : null}
      <View style={styles.row}>
        <Typography variant="body" color={colors.muted}>
          {t("water")}
        </Typography>
        <Typography variant="body">
          {formatter.format(item.result.water)} g
        </Typography>
      </View>
      <View style={styles.row}>
        <Typography variant="body" color={colors.muted}>
          {t("salt")}
        </Typography>
        <Typography variant="body">
          {formatter.format(item.result.salt)} g
        </Typography>
      </View>
      <View style={styles.row}>
        <Typography variant="body" color={colors.muted}>
          {t("yeast")}
        </Typography>
        <Typography variant="body">
          {formatter.format(item.result.yeast)} g
        </Typography>
      </View>
    </GlassCard>
  );

  const emptyState = (
    <GlassCard style={styles.card}>
      <Typography variant="title" style={{ marginBottom: spacing.md }}>
        {t("savedEmpty")}
      </Typography>
      <Pressable
        onPress={() => router.push("/")}
        style={({ pressed }) => [
          {
            marginTop: spacing.sm,
            opacity: pressed ? 0.85 : 1,
            backgroundColor: colors.tint,
            borderRadius: radius.lg,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            alignItems: "center",
          },
        ]}
      >
        <Typography variant="button" color="#FFFFFF">
          {t("savedGoCalc")}
        </Typography>
      </Pressable>
    </GlassCard>
  );

  return (
    <ScreenBackground>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ marginBottom: spacing.lg }}>
            <Typography variant="display">{t("savedRecipes")}</Typography>
            <Typography
              variant="subtitle"
              color={colors.muted}
              style={{ marginTop: 8 }}
            >
              {t("appSubtitle")}
            </Typography>
          </View>
        }
        renderItem={renderItem}
        ListEmptyComponent={emptyState}
        ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: spacing.lg,
    paddingBottom: 140,
  },
  card: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});

function Tag({
  label,
  icon,
  color,
}: {
  label: string;
  icon?: keyof typeof Feather.glyphMap;
  color?: string;
}) {
  const { colors } = useThemeColors();
  const tagColor = color || colors.text;
  return (
    <View
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderWidth: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.xs,
      }}
    >
      {icon && <Feather name={icon} size={14} color={tagColor} />}
      <Typography variant="label" color={tagColor}>
        {label}
      </Typography>
    </View>
  );
}
