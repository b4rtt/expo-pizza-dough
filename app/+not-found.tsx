import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { GlassCard } from '@/components/GlassCard';
import { ScreenBackground } from '@/components/ScreenBackground';
import { Typography } from '@/components/Typography';

export default function NotFoundScreen() {
  return (
    <ScreenBackground>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <GlassCard style={styles.card}>
          <Typography variant="title">Tady nic není.</Typography>
          <Link href="/" style={styles.link}>
            <Typography variant="button">Zpět na hlavní obrazovku</Typography>
          </Link>
        </GlassCard>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  link: {
    marginTop: 12,
  },
  card: {
    padding: 20,
  },
});
