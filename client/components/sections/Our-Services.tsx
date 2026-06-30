"use client";

import { motion } from "framer-motion";
import {Car, Truck, Key, Wrench , Building2 } from "lucide-react";

const services = [
  { name: "Car trading, import and export", icon: Car },
  { name: "Shipping and logistics services", icon: Truck },
  { name: "Car rental with a comprehensive fleet", icon: Key },
  { name: "Supply of genuine auto parts", icon: Wrench },
  { name: "Management and operation of international showrooms", icon: Building2 },
];


export default function OurServices() {
  return (
    <section className="bg-white py-32" id="services">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-24">
          <p className="text-xs tracking-[0.35em] text-neutral-400 uppercase">
            What we offer
          </p>

          <h2 className="text-5xl font-light text-neutral-900 mt-4">
            Our Services
          </h2>

          <div className="w-24 h-[2px] bg-[#C8A24A] mt-6" />
        </div>

        {/* Layout */}
        <div className="grid md:grid-cols-2 gap-20 items-start">

          {/* LEFT — Brand statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="text-neutral-600 text-base leading-relaxed">
              We operate across the full automotive ecosystem — connecting
              trade, logistics, rental operations, and global showroom management
              into a unified system.
            </p>

            <div className="w-16 h-[2px] bg-neutral-200" />

            <p className="text-sm text-neutral-500">
              Built for precision, scale, and long-term operational trust.
            </p>
          </motion.div>

          {/* RIGHT — Minimal list (NOT cards) */}
          <div className="space-y-10">

            {services.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-start gap-4"
              >


                {/* icon + name */}
                <item.icon className="w-6 h-6 text-[#C8A24A]" />  
                <p className="text-neutral-700 text-base leading-relaxed group-hover:text-neutral-900 transition">
                  {item.name}
                </p>

              </motion.div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
}