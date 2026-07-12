'use client';

import { useI18n } from './localize';

interface TranslateProps {
  id: string;
  values?: Record<string, string | number>;
}

export function Translate({ id, values }: TranslateProps) {
  const { t } = useI18n();
  return <>{t(id, values)}</>;
}
