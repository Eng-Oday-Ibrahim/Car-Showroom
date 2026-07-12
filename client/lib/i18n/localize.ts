"use client"
import { createContext, useContext } from 'react';
import { getMessages } from './messages';
import type { Locale } from './lang';

export interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
  localeLabel: string;
}

export const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

function getValue(source: unknown, key: string): unknown {
  return key.split('.').reduce((current: any, part) => {
    if (current === undefined || current === null) return undefined;
    return current[part];
  }, source as any);
}

function interpolate(value: string, values?: Record<string, string | number>) {
  if (!values) return value;
  return Object.entries(values).reduce(
    (current, [key, replacement]) => current.replaceAll(`{${key}}`, String(replacement)),
    value,
  );
}

export function translate(locale: Locale, key: string, values?: Record<string, string | number>) {
  const messages = getMessages(locale);
  let text = getValue(messages, key) as string | undefined;

  if (!text) {
    text = getValue(getMessages('en'), key) as string | undefined;
  }

  return typeof text === 'string' ? interpolate(text, values) : key;
}
