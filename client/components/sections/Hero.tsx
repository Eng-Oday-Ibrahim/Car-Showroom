'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';

const images = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png',
  '/images/hero-4.jpg',
];

export default function Hero() {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-black h-screen overflow-hidden w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[index]})` }}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative h-full max-w-6xl mx-auto px-6 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs tracking-[0.35em] text-white/70 uppercase">{t('hero.tagline')}</p>
          <h2 className="text-5xl md:text-6xl font-light text-white mt-6 leading-tight">
            {t('hero.title')}
          </h2>
          <p className="text-white/70 mt-6">{t('hero.description')}</p>

          <div className="flex gap-4 mt-10">
            <button className="relative px-6 py-3 bg-[#C8A24A] text-white overflow-hidden group transition duration-200 ease-out hover:-translate-y-[1px] active:scale-[0.97]">
              <Link href="/cars">
                <span className="relative z-10">{t('hero.carsButton')}</span>
              </Link>
              <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-200" />
            </button>

            <button className="relative px-6 py-3 border border-white/40 text-white overflow-hidden group transition duration-200 ease-out hover:-translate-y-[1px] active:scale-[0.97]">
              <Link href="/about">
                <span className="relative z-10">{t('hero.aboutButton')}</span>
              </Link>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-200" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
