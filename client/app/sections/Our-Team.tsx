"use client";

import { motion } from "framer-motion";

const founder = {
  name: "Hussein Ghulam",
  role: "Founder",
  img: "/images/team/default.jpg",
};

const board = [
  {
    name: "Muhi Hussein Ghulam",
    role: "CEO",
    img: "/images/team/default.jpg",
  },
  {
    name: "Ali Hussein Ghulam",
    role: "COO",
    img: "/images/team/default.jpg",
  },
];

const management = [
  { name: "Maen Al-Madkhil Allah", role: "Accounts Manager", img: "/images/team/default.jpg" },
  { name: "Ahmed Magdy", role: "Sales Manager", img: "/images/team/default.jpg" },
  { name: "Ibtisam Adam", role: "Logistics Manager", img: "/images/team/default.jpg" },
  { name: "Muadh Saber", role: "Marketing Manager", img: "/images/team/default.jpg" },
];

const staffRow1 = [
  { name: "Ahmed Badawi", role: "Accountant", img: "/images/team/default.jpg" },
  { name: "Mohammed Irfan", role: "Accountant", img: "/images/team/default.jpg" },
  { name: "Abdullah Al-Faouri", role: "Accountant", img: "/images/team/default.jpg" },
];

const staffRow2 = [
  { name: "Mohammed Abdulqadoos", role: "Sales Supervisor", img: "/images/team/default.jpg" },
  { name: "Ahmed Gouda", role: "Sales Supervisor", img: "/images/team/default.jpg" },
];

function Person({ p, level = "staff" }: any) {
  const size =
    level === "founder"
      ? "w-28 h-28"
      : level === "board"
      ? "w-24 h-24"
      : "w-20 h-20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="text-center group"
    >
      <div
        className={`relative mx-auto ${size} rounded overflow-hidden border border-[#C8A24A] shadow-sm group-hover:shadow-md transition duration-200`}
      >
        <img
          src={p.img}
          className="w-full h-full object-cover"
        />

        {/* premium gold ring */}
        <div className="absolute inset-0 rounded border border-[#C8A24A]/40 group-hover:border-[#C8A24A] transition" />
      </div>

      <p className="mt-4 text-neutral-900 text-sm tracking-wide">
        {p.name}
      </p>

      <p className="text-xs text-neutral-500">
        {p.role}
      </p>
    </motion.div>
  );
}

export default function Team() {
  return (
   <section className="container mx-auto bg-white py-32">
  <div className="px-6">

    {/* HEADER */}
    <div className="text-center mb-24">
      <h2 className="text-5xl font-light text-neutral-900">
        Organizational Structure
      </h2>
      <div className="w-24 h-[2px] bg-[#C8A24A] mx-auto mt-6" />
    </div>

    <div className="flex flex-col items-center">

      {/* FOUNDER */}
      <div className="relative mb-20">
        <Person p={founder} level="founder" />
        <div className="w-[2px] h-16 bg-gradient-to-b from-[#C8A24A] to-transparent mx-auto mt-6" />
      </div>

      {/* BOARD */}
      <div className="relative mb-20">
        <div className="flex gap-28">
          {board.map((p, i) => (
            <Person key={i} p={p} level="board" />
          ))}
        </div>

        {/* horizontal connector */}
        <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-[260px] h-[2px] bg-[#C8A24A]/60" />

        {/* vertical line */}
        <div className="w-[2px] h-16 bg-gradient-to-b from-[#C8A24A] to-transparent mx-auto mt-10" />
      </div>

      {/* MANAGEMENT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-16 mb-20">
        {management.map((p, i) => (
          <Person key={i} p={p} level="management" />
        ))}
      </div>

      <div className="w-[2px] h-16 bg-gradient-to-b from-[#C8A24A] to-transparent mb-20" />

      {/* STAFF */}
      <div className="space-y-12">

        <div className="grid grid-cols-3 gap-16">
          {staffRow1.map((p, i) => (
            <Person key={i} p={p} />
          ))}
        </div>

        <div className="flex justify-center gap-16">
          {staffRow2.map((p, i) => (
            <Person key={i} p={p} />
          ))}
        </div>

      </div>

    </div>
  </div>
</section>
  );
}