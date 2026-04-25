"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {name: "Home", link: "/"},
  { name: "About", link: "#about" },
  { name: "Services", link: "#services" },
  { name: "Our Cars", link: "/cars" },
  { name: "Contact", link: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-300
        ${
          scrolled
            ? "top-0 left-0 right-0 px-2 bg-white shadow-md border border-neutral-200"
            : "top-4 left-4 right-4 px-4 rounded bg-white/15 backdrop-blur-md border-none"
        }`}
    >
      <div className="container mx-auto py-2 flex items-center justify-between">

        {/* Logo */}
        <img
          src="/images/logo.jpg"
          alt="logo"
          className="h-10 w-10 object-contain rounded"
        />

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 text-sm">
          {navItems.map((item, i) => (
            <a
              key={i}
              href={item.link}
              className={`relative group transition duration-200
                ${scrolled ? "text-neutral-600 hover:text-neutral-900" : "text-white hover:text-white"}
              `}
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#C8A24A] transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-3">

          {/* CTA */}
          <button
            className={`relative outline-none rounded text-sm px-5 py-2 border overflow-hidden group transition duration-200 active:scale-[0.97]
              ${
                scrolled
                  ? "border-[#C8A24A] text-[#C8A24A]"
                  : "border-white/30 text-white"
              }
            `}
          >
            <span className="relative z-10 group-hover:text-white transition">
              Get in touch
            </span>
            <span className="absolute inset-0 bg-[#C8A24A] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-200" />
          </button>

          {/* Mobile button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1"
          >
            <span className={`w-5 h-[2px] ${scrolled ? "bg-neutral-700" : "bg-white/70"}`} />
            <span className={`w-5 h-[2px] ${scrolled ? "bg-neutral-700" : "bg-white/70"}`} />
            <span className={`w-5 h-[2px] ${scrolled ? "bg-neutral-700" : "bg-white/70"}`} />
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden ${scrolled ? "bg-white" : "bg-white/15"} overflow-hidden border-t border-neutral-100 mb-4 rounded `}
          >
            <div className="flex flex-col px-6 py-6 gap-5 text-sm text-neutral-700">
              {navItems.map((item, i) => (
                <motion.a
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  href={item.link}
                  className="relative group hover:text-black"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-[#C8A24A] group-hover:w-full transition-all" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}