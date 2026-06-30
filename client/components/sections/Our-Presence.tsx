"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const presence = [
  {
    country: "Iraq",
    locations: ["Erbil", "Baghdad", "Salah al-Din"],
  },
  {
    country: "Syria",
    locations: ["Joint Free Zone"],
  },
  {
    country: "UAE",
    locations: ["Dubai"],
  },
  {
    country: "Jordan",
    locations: ["Zarqa – Free Zone"],
  },
  {
    country: "Mauritania",
    locations: ["Nouakchott"],
  },
];

export default function OurPresence() {
  return (
    <section className="bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 rounded-md container mx-auto py-32">
      <div className="px-6">

        {/* Header */}
        <div className="mb-24">
          <p className="text-xs tracking-[0.35em] text-neutral-400 uppercase">
            Global network
          </p>

          <h2 className="text-5xl font-light text-neutral-900 mt-4">
            Our Presence
          </h2>

          <div className="w-24 h-[2px] bg-[#C8A24A] mt-6" />

          <p className="mt-8 text-neutral-500 max-w-2xl leading-relaxed">
            We operate through strategically positioned branches and
            showrooms across key automotive trade routes.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-16">

          {presence.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.08 }}
              className="space-y-6"
            >

              {/* Country header */}
              <div className="flex items-center gap-4">     
                <MapPin className="w-5 h-5 text-[#C8A24A]" />
                <h3 className="text-xl font-light text-neutral-900">
                  {item.country}
                </h3>
              </div>

              {/* Locations */}
              <div className="pl-14 space-y-2">
                {item.locations.map((loc, idx) => (
                  <p
                    key={idx}
                    className="text-neutral-500 text-sm md:text-base hover:text-neutral-900 transition"
                  >
                    {loc}
                  </p>
                ))}
              </div>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}