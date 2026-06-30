"use client";

import { motion } from "framer-motion";
import {
  siTesla, siBmw, siAudi, siVolkswagen, siToyota,
  siHonda, siHyundai, siNissan, siFord, siChevrolet,
  siPorsche, siFerrari, siLamborghini, siMaserati,
  siBugatti, siPeugeot
} from "simple-icons/icons";

export default function OurBrands() {
  const brands = [
    { name: "Tesla", icon: siTesla },
    { name: "BMW", icon: siBmw },
    { name: "Audi", icon: siAudi },
    { name: "Volkswagen", icon: siVolkswagen },
    { name: "Toyota", icon: siToyota },
    { name: "Honda", icon: siHonda },
    { name: "Hyundai", icon: siHyundai },
    { name: "Nissan", icon: siNissan },
    { name: "Ford", icon: siFord },
    { name: "Chevrolet", icon: siChevrolet },
    { name: "Porsche", icon: siPorsche },
    { name: "Ferrari", icon: siFerrari },
    { name: "Lamborghini", icon: siLamborghini },
    { name: "Maserati", icon: siMaserati },
    { name: "Bugatti", icon: siBugatti },
    { name: "Peugeot", icon: siPeugeot },
  ];

  return (
    <section className="bg-white py-28 container mx-auto">
      <div className="px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.35em] text-neutral-400 uppercase">
            Automotive partners
          </p>

          <h2 className="text-4xl md:text-5xl font-light text-neutral-900 mt-4">
            Our Brands
          </h2>

          <div className="w-24 h-[2px] bg-[#C8A24A] mx-auto mt-6" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.03 }}
              className="group relative flex flex-col items-center justify-center 
                         p-10 rounded-xl
                         bg-neutral-100
                         hover:bg-gradient-to-br hover:from-neutral-100 hover:to-neutral-200
                         transition duration-300"
            >


              {/* icon */}
              <svg
                viewBox="0 0 24 24"
                width={44}
                height={44}
                className="text-neutral-600 group-hover:text-[#C8A24A] group-hover:scale-110 transition duration-300 relative"
              >
                <path d={brand.icon.path} fill="currentColor" />
              </svg>

              {/* label */}
              <p className="mt-5 text-sm text-neutral-600 group-hover:text-[#C8A24A] group-hover:scale-110 transition duration-300 relative">
                {brand.name}
              </p>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}