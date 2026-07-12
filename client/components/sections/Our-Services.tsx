'use client';

import { motion } from 'framer-motion';
import { Car, Truck, Key, Wrench, Building2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const services = [
  { key: 'trading', icon: Car },
  { key: 'shipping', icon: Truck },
  { key: 'rental', icon: Key },
  { key: 'parts', icon: Wrench },
  { key: 'showrooms', icon: Building2 },
];

export default function OurServices() {
  const { t } = useI18n();

  return (
    <section className="bg-white py-32" id="services">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-24">
          <p className="text-xs tracking-[0.35em] text-neutral-400 uppercase">{t('services.tagline')}</p>
          <h2 className="text-5xl font-light text-neutral-900 mt-4">{t('services.title')}</h2>
          <div className="w-24 h-[2px] bg-[#C8A24A] mt-6" />
          <p className="mt-8 text-neutral-500 max-w-2xl leading-relaxed">{t('services.description')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-neutral-600 text-base leading-relaxed">{t('services.description')}</p>
            <div className="w-16 h-[2px] bg-neutral-200" />
            <p className="text-sm text-neutral-500">{t('services.note')}</p>
          </motion.div>

          <div className="space-y-10">
            {services.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-start gap-4"
              >
                <item.icon className="w-6 h-6 text-[#C8A24A]" />
                <p className="text-neutral-700 text-base leading-relaxed group-hover:text-neutral-900 transition">
                  {t(`services.items.${item.key}`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
