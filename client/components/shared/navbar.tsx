'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { getStoredAuth } from '../../lib/auth/auth';
import { User, Menu, X } from 'lucide-react';
import { useI18n, localeNames, type Locale } from '@/lib/i18n';

const navItems = [
  { nameKey: 'navbar.home', link: '/' },
  { nameKey: 'navbar.about', link: '/about' },
  { nameKey: 'navbar.cars', link: '/cars' },
  { nameKey: 'navbar.contact', link: '/contact' },
];

const languages: Array<{ code: Locale; label: string }> = [
  { code: 'en', label: localeNames.en },
  { code: 'fr', label: localeNames.fr },
  { code: 'ru', label: localeNames.ru },
  { code: 'zh', label: localeNames.zh },
  { code: 'ar', label: localeNames.ar },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [auth, setAuth] = useState<ReturnType<typeof getStoredAuth> | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const { t, locale, setLocale } = useI18n();

  useEffect(() => {
    setAuth(getStoredAuth());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/90 backdrop-blur-md py-3 shadow-[0_1px_0_rgba(200,162,74,0.15)]'
          : 'bg-gradient-to-b from-[#050505]/70 to-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/images/logo.jpg"
            alt="logo"
            className="h-11 w-11 object-contain rounded-full transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.link}
              className="relative text-[13px] font-medium tracking-[0.18em] uppercase text-neutral-300 hover:text-white transition-colors duration-300 group"
            >
              {t(item.nameKey)}
              <span className="absolute left-0 -bottom-2 h-px w-0 bg-[#C8A24A] transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <select
            aria-label={t('navbar.language')}
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="hidden md:inline-flex border border-neutral-700 bg-[#050505]/80 px-3 py-2 text-xs text-neutral-200 outline-none transition focus:ring-2 focus:ring-[#C8A24A]/50"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code} className="bg-[#050505] text-white">
                {lang.label}
              </option>
            ))}
          </select>

          {isHydrated && auth?.user ? (
            <Link href="/profile" passHref>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent hover:bg-transparent border-neutral-700 text-neutral-200 hover:border-[#C8A24A] hover:text-[#C8A24A] transition-colors"
              >
                <User className="w-4 h-4" />
              </Button>
            </Link>
          ) : isHydrated ? (
            <Link href="/login" passHref>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent hover:bg-transparent border-neutral-700 text-neutral-200 tracking-wide hover:border-[#C8A24A] hover:text-[#C8A24A] transition-colors"
              >
                {t('navbar.login')}
              </Button>
            </Link>
          ) : null}

          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden relative w-9 h-9 flex items-center justify-center"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-neutral-200" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-neutral-200" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-0 bg-black/60 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="md:hidden relative bg-[#050505] overflow-hidden border-t border-neutral-800"
            >
              <div className="flex flex-col px-6 py-8 gap-1">
                {navItems.map((item, i) => (
                  <motion.a
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
                    href={item.link}
                    onClick={() => setOpen(false)}
                    className="py-3 text-[15px] font-medium tracking-[0.12em] uppercase text-neutral-300 hover:text-[#C8A24A] transition-colors border-b border-neutral-900 last:border-none"
                  >
                    {t(item.nameKey)}
                  </motion.a>
                ))}
                <div className="pt-4">
                  <label className="text-xs uppercase tracking-[0.3em] text-neutral-500">{t('navbar.language')}</label>
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as Locale)}
                    className="mt-2 w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-200"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
