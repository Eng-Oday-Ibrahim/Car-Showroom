import type { Locale } from '../lang';
import ar from './ar.json';
import en from './en.json';
import fr from './fr.json';
import ru from './ru.json';
import zh from './zh.json';

const messages = {
  en,
  fr,
  ru,
  zh,
  ar,
} as const;

export type Messages = typeof messages;

export function getMessages(locale: Locale) {
  return messages[locale] ?? messages.en;
}
