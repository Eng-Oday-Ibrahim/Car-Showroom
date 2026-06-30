"use client";

import { motion } from "framer-motion";

const timeline = [
  {
    year: "1985",
    title: "Samarra Showroom",
    desc: "Establishment of the showroom in Samarra, Iraq. The beginning of Hussein Ghulam Motors' journey.",
  },
  {
    year: "1999",
    title: "Baghdad Branch",
    desc: "Al-Fakhama Road branch opened in Baghdad, expanding presence in the domestic market.",
  },
  {
    year: "2004",
    title: "Erbil Branch",
    desc: "Opening of the Erbil branch in the Kurdistan Region, strengthening regional presence.",
  },
  {
    year: "2006",
    title: "Amman Branch",
    desc: "Launch of the Amman Free Zone branch, marking the first step toward international expansion.",
  },
  {
    year: "2007",
    title: "Syrian–Jordanian Free Zone",
    desc: "Opening of the branch in the Syrian–Jordanian Free Zone to expand cross-border operations.",
  },
  {
    year: "2007",
    title: "Al-Ghulam Shipping Company",
    desc: "Establishment of Al-Ghulam Shipping Company and entry into the logistics services sector.",
  },
  {
    year: "2022",
    title: "Dubai Branch",
    desc: "Launch of Hussein Ghulam Motors branch in Dubai, UAE.",
  },
  {
    year: "2023",
    title: "Square Motors",
    desc: "Opening of the second UAE branch in Dubai under the name Square Motors.",
  },
  {
    year: "2024",
    title: "Guangzhou Office",
    desc: "Opening of the Guangzhou office in China (Fanko), expanding the global supply network.",
  },
  {
    year: "2024",
    title: "Car Rental Company",
    desc: "Launch of the Dubai car rental company with a fleet of 600 vehicles.",
  },
  {
    year: "2026",
    title: "HG Spare Parts",
    desc: "Entry into the spare parts market under the HG Spare Parts brand.",
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