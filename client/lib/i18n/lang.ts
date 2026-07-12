export const SUPPORTED_LOCALES = ['en', 'fr', 'ru', 'zh', 'ar'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  ru: 'Русский',
  zh: '中文',
  ar: 'العربية',
};

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  fr: 'ltr',
  ru: 'ltr',
  zh: 'ltr',
  ar: 'rtl',
};

export function localeFromString(value: string | undefined): Locale {
  if (!value) return defaultLocale;
  const code = value.slice(0, 2).toLowerCase();
  return SUPPORTED_LOCALES.includes(code as Locale) ? (code as Locale) : defaultLocale;
}
