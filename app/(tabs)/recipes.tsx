import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, Share, StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/Colors';
import { radius, spacing } from '@/constants/theme';
import { GlassCard } from '@/components/GlassCard';
import { ScreenBackground } from '@/components/ScreenBackground';
import { Typography } from '@/components/Typography';
import { SAVED_RECIPES_KEY, SavedRecipe } from '@/lib/pizzaCalculator';
import { useTranslation } from '@/providers/LocalizationProvider';

export default function RecipesScreen() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const [items, setItems] = useState<SavedRecipe[]>([]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(language === 'cs' ? 'cs-CZ' : 'en-US', {
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
      `${t('appTitle')} – ${t(`style_${result.style.replace('-', '_')}`)}`,
      `${t('numberLabel')}: ${result.number}`,
      `${t('gramsLabel')}: ${result.gramsPerPizza} g`,
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

  const deleteRecipe = async (id: string) => {
    await Haptics.selectionAsync();
    Alert.alert(t('delete'), '', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          const filtered = items.filter((r) => r.id !== id);
          setItems(filtered);
          try {
            await AsyncStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(filtered));
          } catch (_) {
            // ignore
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: SavedRecipe }) => (
    <GlassCard style={styles.card}>
      <View style={styles.cardTop}>
        <View style={{ flex: 1 }}>
          <Typography variant="title">{item.title}</Typography>
          <Typography variant="label" color={Colors.light.muted} style={{ marginTop: 4 }}>
            {t(`style_${item.result.style.replace('-', '_')}`)} • {formatter.format(item.result.totalWeight)} g
          </Typography>
        </View>
        <View style={styles.actions}>
          <Pressable onPress={() => shareRecipe(item)} style={({ pressed }) => [styles.pill, { opacity: pressed ? 0.7 : 1 }]}>
            <Typography variant="label" color={Colors.light.text}>
              {t('share')}
            </Typography>
          </Pressable>
          <Pressable onPress={() => deleteRecipe(item.id)} style={({ pressed }) => [styles.pill, { opacity: pressed ? 0.7 : 1 }]}>
            <Typography variant="label" color={Colors.light.tint}>
              {t('delete')}
            </Typography>
          </Pressable>
        </View>
      </View>
      <View style={styles.row}>
        <Typography variant="body" color={Colors.light.muted}>
          {t('flour')}
        </Typography>
        <Typography variant="body">{formatter.format(item.result.flour)} g</Typography>
      </View>
      {item.result.semolina ? (
        <View style={styles.row}>
          <Typography variant="body" color={Colors.light.muted}>
            {t('semolina')}
          </Typography>
          <Typography variant="body">{formatter.format(item.result.semolina)} g</Typography>
        </View>
      ) : null}
      <View style={styles.row}>
        <Typography variant="body" color={Colors.light.muted}>
          {t('water')}
        </Typography>
        <Typography variant="body">{formatter.format(item.result.water)} g</Typography>
      </View>
      <View style={styles.row}>
        <Typography variant="body" color={Colors.light.muted}>
          {t('salt')}
        </Typography>
        <Typography variant="body">{formatter.format(item.result.salt)} g</Typography>
      </View>
      <View style={styles.row}>
        <Typography variant="body" color={Colors.light.muted}>
          {t('yeast')}
        </Typography>
        <Typography variant="body">{formatter.format(item.result.yeast)} g</Typography>
      </View>
    </GlassCard>
  );

  const emptyState = (
    <GlassCard style={styles.card}>
      <Typography variant="title">{t('savedEmpty')}</Typography>
      <Pressable
        onPress={() => router.push('/')}
        style={({ pressed }) => [styles.pill, { marginTop: spacing.md, opacity: pressed ? 0.7 : 1 }]}>
        <Typography variant="label" color={Colors.light.tint}>
          {t('savedGoCalc')}
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
          <View style={{ marginBottom: spacing.md }}>
            <Typography variant="display">{t('savedRecipes')}</Typography>
            <Typography variant="subtitle" color={Colors.light.muted} style={{ marginTop: 6 }}>
              {t('appSubtitle')}
            </Typography>
          </View>
        }
        renderItem={renderItem}
        ListEmptyComponent={emptyState}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 18,
    paddingTop: spacing.md,
    paddingBottom: 140,
  },
  card: {
    padding: spacing.md,
  },
  cardTop: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
  },
});
