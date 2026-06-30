'use client';
import { useState } from "react";

const faqs = [
  { q: "Do you provide international car shipping?",   a: "Yes. We manage full export and import operations including documentation, logistics, and global delivery coordination." },
  { q: "Can I rent luxury cars for short periods?",    a: "Yes. Our fleet includes luxury, sports, and economy vehicles available for flexible rental durations." },
  { q: "Do you supply genuine spare parts?",           a: "We source only verified original parts from certified global suppliers and manufacturers." },
  { q: "Do you manage international showrooms?",       a: "Yes. We operate full showroom systems including sales, logistics, and operational management." },
];

export default function FAQ() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-5xl font-light text-neutral-900">
            Frequently Asked Questions
          </h2>
          <div className="w-24 h-[2px] bg-[#C8A24A] mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* LEFT — question list */}
          <div className="md:sticky md:top-24 space-y-6">
            {faqs.map((item, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="w-full text-left outline-none"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className={`text-sm md:text-base transition-colors duration-200 ${
                    active === i ? "text-neutral-900 font-medium" : "text-neutral-400"
                  }`}>
                    {item.q}
                  </p>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-200 ${
                    active === i ? "bg-[#C8A24A]" : "bg-neutral-200"
                  }`} />
                </div>
                <div className={`h-[1px] mt-3 bg-[#C8A24A] transition-all duration-300 ${
                  active === i ? "w-full" : "w-0"
                }`} />
              </button>
            ))}
          </div>

          {/* RIGHT — answer */}
          <div className="md:sticky md:top-24 min-h-[200px] flex items-center">
            <div
              key={active}
              className="max-w-xl animate-fadeSlideUp"
            >
              <p className="text-xs tracking-[0.3em] text-neutral-400 uppercase">
                Answer
              </p>
              <h3 className="text-2xl md:text-3xl font-light text-neutral-900 mt-4 leading-relaxed">
                {faqs[active].a}
              </h3>
              <div className="w-16 h-[2px] bg-[#C8A24A] mt-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}