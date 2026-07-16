'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

const markets = [
  {
    key: 'africa',
    countries: ['benin', 'nigeria', 'burkinaFaso', 'ghana', 'gabon', 'ivoryCoast', 'drCongo', 'guinea', 'mali', 'rwanda', 'algeria', 'tunisia'],
  },
  {
    key: 'southAmerica',
    countries: ['costaRica', 'venezuela', 'chile'],
  },
  {
    key: 'asia',
    countries: ['philippines', 'cambodia', 'kazakhstan', 'azerbaijan', 'russia', 'armenia', 'turkmenistan', 'tajikistan', 'uzbekistan'],
  },
  {
    key: 'europe',
    countries: ['germany', 'belgium', 'georgia'],
  },
];

export default function OurMarkets() {
  const { t } = useI18n();

  return (
    <section className="bg-white py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-24">
          <p className="text-xs tracking-[0.35em] text-neutral-400 uppercase">{t('markets.tagline')}</p>
          <h2 className="text-5xl font-light text-neutral-900 mt-4">{t('markets.title')}</h2>
          <div className="w-24 h-[2px] bg-[#C8A24A] mt-6" />
          <p className="mt-8 text-neutral-500 max-w-2xl leading-relaxed">{t('markets.description') ?? ''}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {markets.map((group, i) => (
            <motion.div
              key={group.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-[2px] bg-[#C8A24A]" />
                <h3 className="text-xl font-light text-neutral-900">{t(`markets.regions.${group.key}`)}</h3>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 pl-14">
                {group.countries.map((country) => (
                  <span key={country} className="text-sm text-neutral-500 hover:text-neutral-900 transition">
                    {t(`markets.countries.${country}`)}
                    <span className="text-neutral-300 ml-2">•</span>
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
