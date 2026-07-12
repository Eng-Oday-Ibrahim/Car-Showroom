'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export default function CTA() {
  const { t } = useI18n();

  return (
    <section className="relative bg-white py-8 my-16 overflow-hidden container mx-auto">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#C8A24A]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-neutral-200 rounded-full blur-3xl" />
      </div>

      <div className="relative px-6 text-center w-full">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-xs tracking-[0.35em] text-neutral-400 uppercase"
        >
          {t('cta.ready')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-4xl md:text-5xl font-light text-neutral-900 leading-tight"
        >
          {t('cta.headline')}
          <span className="block text-[#C8A24A] font-normal">{t('cta.headlineHighlight')}</span>
        </motion.h2>

        <div className="w-20 h-[2px] bg-[#C8A24A] mx-auto mt-4" />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-neutral-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
        >
          {t('cta.description')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="px-8 py-3 bg-[#C8A24A] text-white text-sm tracking-wide hover:opacity-90 transition active:scale-95">
          <a href="/cars">
              {t('cta.primary')}
          </a>
          </button>

          <button className="px-8 py-3 border border-neutral-300 text-neutral-700 text-sm tracking-wide hover:border-[#C8A24A] hover:text-[#C8A24A] transition active:scale-95">
            <a href="/contact">
              {t('cta.secondary')}
            </a>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
