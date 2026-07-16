'use client';

import { motion, type Variants } from 'framer-motion';
import { CarCard } from './car-card';
import type { Car } from '@/types/car.types';

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export function AnimatedCarGrid({ cars }: { cars: Car[] }) {
  return (
<motion.div
  variants={container}
  initial="hidden"
  animate="show"
  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10"
>
      {cars.map((car, index) => (
        <motion.div key={car.id} variants={item}>
          <CarCard car={car} priority={index < 6} />
        </motion.div>
      ))}
    </motion.div>
  );
}