"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    year: "1985",
    title: "Foundation",
    desc: "Founded in Samarra, Iraq marking the beginning of our automotive journey.",
  },
  {
    year: "1999",
    title: "Baghdad Expansion",
    desc: "Al-Fakhama Road showroom opened in Baghdad.",
  },
  {
    year: "2004–2007",
    title: "Regional Expansion",
    desc: "Expansion into Erbil, Amman Free Zone, and joint free zones with shipping operations.",
  },
  {
    year: "2022–2024",
    title: "Global Growth",
    desc: "Dubai branches, Guangzhou office, and Nouakchott showroom established.",
  },
  {
    year: "2025",
    title: "Fleet Scaling",
    desc: "600+ vehicle rental fleet launched in Dubai.",
  },
  {
    year: "2026",
    title: "Diversification",
    desc: "Entry into auto parts market under HG Spare Parts.",
  },
];

export default function About() {
  return (
    <section className="container mx-auto bg-white py-32" id="about">
      <div className="px-6">

        {/* Header */}
        <div className="text-center mb-28">
          <h2 className="text-5xl font-light text-neutral-900">
            About Us
          </h2>
          <div className="w-24 h-[2px] bg-[#C8A24A] mx-auto mt-6" />
        </div>

        {/* Timeline wrapper */}
        <div className="relative">

          {/* vertical line (desktop center / mobile left) */}
          <div className="absolute md:left-1/2 left-4 top-0 bottom-0 w-[1px] bg-neutral-200" />
          <div className="absolute md:left-1/2 left-4 top-0 bottom-0 w-[1px] bg-[#C8A24A]/40" />

          <div className="space-y-20">

            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.08 }}
                  className="relative flex"
                >

                  {/* DOT */}
                  <div className="absolute md:left-1/2 left-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#C8A24A]" />

                  {/* CONTENT */}
                  <div
                    className={`
                      w-full md:w-1/2 pl-12 md:pl-0
                      ${isLeft ? "md:pr-16 md:text-right md:mr-auto" : "md:pl-16 md:ml-auto"}
                    `}
                  >

                    <p className="text-xs md:text-md tracking-[0.3em] text-[#C8A24A]">
                      {item.year}
                    </p>

                    <h3 className="text-xl md:text-3xl font-light text-neutral-900 mt-2">
                      {item.title}
                    </h3>

                    <p className="text-sm md:text-xl text-neutral-500 mt-3 leading-relaxed ">
                      {item.desc}
                    </p>

                  </div>

                </motion.div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
}