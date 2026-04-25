"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/images/bg-hero-1.jpg",
  "/images/bg-hero-2.jpg",
  "/images/bg-hero-3.jpg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // auto change
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-black h-screen overflow-hidden w-full rounded">

      {/* Background carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[index]})` }}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </AnimatePresence>

      {/* overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* content */}
      <div className="relative h-full max-w-6xl mx-auto px-6 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <p className="text-xs tracking-[0.35em] text-white/70 uppercase">
            Automotive excellence
          </p>

          <h2 className="text-5xl md:text-6xl font-light text-white mt-6 leading-tight">
            Global Car Trading & Premium Automotive Solutions
          </h2>

          <p className="text-white/70 mt-6">
            Import, export, logistics, rentals, and showroom operations.
          </p>

          <div className="flex gap-4 mt-10">

            {/* Primary */}
            <button className="relative rounded px-6 py-3 bg-[#C8A24A] text-white overflow-hidden group transition duration-200 ease-out hover:-translate-y-[1px] active:scale-[0.97]">
              <span className="relative z-10">Explore Services</span>
              <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-200" />
            </button>

            {/* Secondary */}
            <button className="relative rounded px-6 py-3 border border-white/40 text-white overflow-hidden group transition duration-200 ease-out hover:-translate-y-[1px] active:scale-[0.97]">
              <span className="relative z-10">Our Network</span>
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-200" />
            </button>

          </div>
        </motion.div>
      </div>
    </section>
  );
}