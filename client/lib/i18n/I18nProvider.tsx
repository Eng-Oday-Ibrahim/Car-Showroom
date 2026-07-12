'use client';

import { useEffect, useMemo, useState } from 'react';
import { I18nContext } from './localize';
import { defaultLocale, localeDirections, localeFromString, localeNames, SUPPORTED_LOCALES } from './lang';
import { translate } from './localize';
import type { Locale } from './lang';

const STORAGE_KEY = 'hgm_locale';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale;
  }

  return localeFromString(navigator.language || navigator.languages?.[0]);
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocale(getInitialLocale());
  }, []);

  const dir = localeDirections[locale];
  const localeLabel = localeNames[locale];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale, dir]);

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      dir,
      localeLabel,
      t: (key: string, values?: Record<string, string | number>) => translate(locale, key, values),
    }),
    [locale, dir, localeLabel],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}
