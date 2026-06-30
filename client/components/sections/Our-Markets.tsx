"use client";

import { motion } from "framer-motion";

const markets = [
  {
    region: "Africa",
    countries: [
      "Benin", "Nigeria", "Burkina Faso", "Ghana", "Gabon",
      "Ivory Coast", "DR Congo", "Guinea", "Mali",
      "Rwanda", "Algeria", "Tunisia",
    ],
  },
  {
    region: "South America",
    countries: ["Costa Rica", "Venezuela", "Chile"],
  },
  {
    region: "Asia",
    countries: [
      "Philippines", "Cambodia", "Kazakhstan", "Azerbaijan",
      "Russia", "Armenia", "Turkmenistan", "Tajikistan", "Uzbekistan",
    ],
  },
  {
    region: "Europe",
    countries: ["Germany", "Belgium", "Georgia"],
  },
];

export default function OurMarkets() {
  return (
    <section className="bg-white py-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-24">
          <p className="text-xs tracking-[0.35em] text-neutral-400 uppercase">
            Global presence
          </p>

          <h2 className="text-5xl font-light text-neutral-900 mt-4">
            Our Markets
          </h2>

          <div className="w-24 h-[2px] bg-[#C8A24A] mt-6" />

          <p className="mt-8 text-neutral-500 max-w-2xl leading-relaxed">
            We operate across multiple continents, delivering automotive
            trading, logistics, and operational services in key global markets.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-16">

          {markets.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6"
            >

              {/* Region title */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-[2px] bg-[#C8A24A]" />
                <h3 className="text-xl font-light text-neutral-900">
                  {group.region}
                </h3>
              </div>

              {/* Countries */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 pl-14">
                {group.countries.map((country, idx) => (
                  <span
                    key={idx}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition"
                  >
                    {country}
                    <span className="text-neutral-300 ml-2">•</span>
                  </span>
                ))}
              </div>

            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}