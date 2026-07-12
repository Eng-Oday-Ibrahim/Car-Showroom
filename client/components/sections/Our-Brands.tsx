'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import {
  siTesla, siBmw, siAudi, siVolkswagen, siToyota,
  siHonda, siHyundai, siNissan, siFord, siChevrolet,
  siPorsche, siFerrari, siLamborghini, siMaserati,
  siBugatti, siPeugeot,
} from 'simple-icons/icons';

export default function OurBrands() {
  const { t } = useI18n();
  const brands = [
    { nameKey: 'brands.names.tesla', icon: siTesla },
    { nameKey: 'brands.names.bmw', icon: siBmw },
    { nameKey: 'brands.names.audi', icon: siAudi },
    { nameKey: 'brands.names.volkswagen', icon: siVolkswagen },
    { nameKey: 'brands.names.toyota', icon: siToyota },
    { nameKey: 'brands.names.honda', icon: siHonda },
    { nameKey: 'brands.names.hyundai', icon: siHyundai },
    { nameKey: 'brands.names.nissan', icon: siNissan },
    { nameKey: 'brands.names.ford', icon: siFord },
    { nameKey: 'brands.names.chevrolet', icon: siChevrolet },
    { nameKey: 'brands.names.porsche', icon: siPorsche },
    { nameKey: 'brands.names.ferrari', icon: siFerrari },
    { nameKey: 'brands.names.lamborghini', icon: siLamborghini },
    { nameKey: 'brands.names.maserati', icon: siMaserati },
    { nameKey: 'brands.names.bugatti', icon: siBugatti },
    { nameKey: 'brands.names.peugeot', icon: siPeugeot },
  ];

  return (
    <section className="bg-white py-28 container mx-auto">
      <div className="px-6">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.35em] text-neutral-400 uppercase">{t('brands.tagline')}</p>
          <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mt-4">{t('brands.title')}</h2>
          <div className="w-24 h-[2px] bg-[#C8A24A] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.03 }}
              className="group relative flex flex-col items-center justify-center p-10 rounded-xl bg-neutral-100 hover:bg-gradient-to-br hover:from-neutral-100 hover:to-neutral-200 transition duration-300"
            >
              <svg viewBox="0 0 24 24" width={44} height={44} className="text-neutral-600 group-hover:text-[#C8A24A] group-hover:scale-110 transition duration-300 relative">
                <path d={brand.icon.path} fill="currentColor" />
              </svg>
              <p className="mt-5 text-sm text-neutral-600 group-hover:text-[#C8A24A] group-hover:scale-110 transition duration-300 relative">{t(brand.nameKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
