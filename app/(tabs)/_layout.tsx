import { Ionicons } from "@expo/vector-icons";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";

import { useTranslation } from "@/providers/LocalizationProvider";
import { useThemeColors } from "@/providers/ThemeProvider";

export default function TabLayout() {
  const { t } = useTranslation();
  const { colors } = useThemeColors();

  return (
    <NativeTabs
      disableTransparentOnScrollEdge
      tintColor={colors.tint}
      labelStyle={{ color: Platform.OS === "ios" ? undefined : colors.muted }}
    >
      <NativeTabs.Trigger name="index">
        {Platform.select({
          ios: (
            <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
          ),
          default: <VectorIcon family={Ionicons} name="calculator-outline" />,
        })}
        <Label>{t("tabCalculator")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="tips">
        {Platform.select({
          ios: <Icon sf={{ default: "sparkles", selected: "sparkles" }} />,
          default: <VectorIcon family={Ionicons} name="bulb-outline" />,
        })}
        <Label>{t("tabTips")}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="recipes">
        {Platform.select({
          ios: <Icon sf={{ default: "bookmark", selected: "bookmark.fill" }} />,
          default: <VectorIcon family={Ionicons} name="bookmark-outline" />,
        })}
        <Label>{t("savedRecipes")}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
