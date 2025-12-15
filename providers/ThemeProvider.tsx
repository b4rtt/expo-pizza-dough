import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import Colors from '@/constants/Colors';

type Mode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  mode: Mode;
  effective: 'light' | 'dark';
  colors: (typeof Colors)['light'];
  setMode: (mode: Mode) => Promise<void>;
};

const STORAGE_KEY = '@pizza-theme';

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'dark',
  effective: 'dark',
  colors: Colors.dark,
  setMode: async () => {},
});

const getEffective = (mode: Mode) => {
  if (mode === 'system') {
    const system = Appearance.getColorScheme();
    return system === 'light' ? 'light' : 'dark';
  }
  return mode;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('system');

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
          return;
        }
      } catch {
        // ignore
      }
      setModeState('system');
    };
    load();
  }, []);

  const setMode = async (value: Mode) => {
    setModeState(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore storage errors
    }
  };

  const effective = getEffective(mode);
  const value = useMemo(
    () => ({
      mode,
      effective,
      colors: Colors[effective],
      setMode,
    }),
    [mode, effective]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useThemeColors = () => useContext(ThemeContext);
