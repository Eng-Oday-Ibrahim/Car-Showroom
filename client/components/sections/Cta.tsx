"use client";

import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="relative bg-white py-8 my-16 overflow-hidden container mx-auto rounded-md">
      
      {/* subtle background accent */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#C8A24A]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-neutral-200 rounded-full blur-3xl" />
      </div>

      <div className="relative px-6 text-center w-full">

        {/* small label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-xs tracking-[0.35em] text-neutral-400 uppercase"
        >
          Ready to start
        </motion.p>

        {/* headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-4xl md:text-5xl font-light text-neutral-900 leading-tight"
        >
          Build your automotive experience  
          <span className="block text-[#C8A24A] font-normal">
            with confidence and precision
          </span>
        </motion.h2>

        {/* line */}
        <div className="w-20 h-[2px] bg-[#C8A24A] mx-auto mt-4" />

        {/* description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-neutral-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
        >
          From car trading to logistics, rentals, and showroom operations — 
          we deliver end-to-end automotive solutions designed for scale.
        </motion.p>

        {/* buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="px-8 py-3 rounded bg-[#C8A24A] text-white text-sm tracking-wide hover:opacity-90 transition active:scale-95">
            Get Started
          </button>

          <button className="px-8 py-3 rounded border border-neutral-300 text-neutral-700 text-sm tracking-wide hover:border-[#C8A24A] hover:text-[#C8A24A] transition active:scale-95">
            Contact Us
          </button>
        </motion.div>

      </div>
    </section>
  );
}