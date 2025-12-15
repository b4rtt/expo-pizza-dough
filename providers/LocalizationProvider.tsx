import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import { Language, supportedLanguages, translations } from '@/lib/i18n';

type LocalizationContextValue = {
  language: Language;
  preference: Language | 'device';
  setLanguage: (lang: Language) => Promise<void>;
  useDeviceLanguage: () => Promise<void>;
  t: (key: string) => string;
  isReady: boolean;
};

const STORAGE_KEY = '@pizza-lang';

const LocalizationContext = createContext<LocalizationContextValue>({
  language: 'en',
  preference: 'device',
  setLanguage: async () => {},
  useDeviceLanguage: async () => {},
  t: (key: string) => translations.en[key] ?? key,
  isReady: false,
});

const getBestDeviceLanguage = (): Language => {
  const locales = Localization.getLocales();
  const first = locales && locales.length ? locales[0] : undefined;
  const code = first?.languageCode?.toLowerCase();
  if (code && supportedLanguages.includes(code as Language)) {
    return code as Language;
  }
  return 'en';
};

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [preference, setPreference] = useState<Language | 'device'>('device');
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && supportedLanguages.includes(stored as Language)) {
          setPreference(stored as Language);
          setLanguageState(stored as Language);
          setReady(true);
          return;
        }
      } catch (_) {
        // ignore
      }
      setLanguageState(getBestDeviceLanguage());
      setPreference('device');
      setReady(true);
    };
    hydrate();
  }, []);

  const setLanguage = async (lang: Language) => {
    setPreference(lang);
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore storage errors
    }
  };

  const useDeviceLanguage = async () => {
    const best = getBestDeviceLanguage();
    setPreference('device');
    setLanguageState(best);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const value = useMemo(
    () => ({
      language,
      preference,
      setLanguage,
      useDeviceLanguage,
      t: (key: string) => translations[language][key] ?? key,
      isReady,
    }),
    [language, preference, isReady]
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export const useTranslation = () => useContext(LocalizationContext);
