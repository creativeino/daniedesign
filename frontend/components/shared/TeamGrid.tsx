"use client";

import { motion } from "framer-motion";

const team = [
  { role: "Creative Direction", initials: "DD", note: "Sets the visual north star for every engagement." },
  { role: "Brand Design", initials: "BD", note: "Identities, guidelines and design systems that scale." },
  { role: "Product Design", initials: "PD", note: "Research, interfaces and prototypes for digital products." },
  { role: "Development", initials: "DV", note: "Websites and applications built to perform." },
  { role: "Digital Marketing", initials: "DM", note: "Strategy, search and social programs that grow." },
  { role: "Project Delivery", initials: "PM", note: "Planning, communication and launch discipline." },
];

export default function TeamGrid() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 md:px-10">
      <p className="eyebrow mb-6">Team</p>
      <h2 className="display mb-10 max-w-2xl text-3xl font-medium leading-[1.05] tracking-tight md:text-5xl">
        A multidisciplinary crew of dedicated specialists.
      </h2>
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-paper/10 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, i) => (
          <motion.li
            key={member.role}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="group flex flex-col gap-6 bg-panel p-8 transition-colors hover:bg-card"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-sm font-extrabold tracking-widest text-accent transition-colors group-hover:bg-accent group-hover:text-[#0e0e0e]">
              {member.initials}
            </span>
            <div>
              <h3 className="text-lg font-bold text-ink">{member.role}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{member.note}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}