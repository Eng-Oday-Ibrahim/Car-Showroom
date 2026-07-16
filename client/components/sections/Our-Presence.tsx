'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const presence = [
  { key: 'iraq', locations: ['erbil', 'baghdad', 'salahAlDin'] },
  { key: 'syria', locations: ['jointFreeZone'] },
  { key: 'uae', locations: ['dubai'] },
  { key: 'jordan', locations: ['zarqaFreeZone'] },
  { key: 'mauritania', locations: ['nouakchott'] },
];

export default function OurPresence() {
  const { t } = useI18n();

  return (
    <section className="container mx-auto py-32">
      <div className="px-6">
        <div className="mb-24">
          <p className="text-xs tracking-[0.35em] text-neutral-400 uppercase">{t('presence.tagline')}</p>
          <h2 className="text-5xl font-light text-neutral-900 mt-4">{t('presence.title')}</h2>
          <div className="w-24 h-[2px] bg-[#C8A24A] mt-6" />
          <p className="mt-8 text-neutral-500 max-w-2xl leading-relaxed">{t('presence.description') ?? ''}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          {presence.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.08 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-[#C8A24A]" />
                <h3 className="text-xl font-light text-neutral-900">{t(`presence.countries.${item.key}`)}</h3>
              </div>
              <div className="pl-14 space-y-2">
                {item.locations.map((loc) => (
                  <p key={loc} className="text-neutral-500 text-sm md:text-base hover:text-neutral-900 transition">
                    {t(`presence.locations.${loc}`)}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
