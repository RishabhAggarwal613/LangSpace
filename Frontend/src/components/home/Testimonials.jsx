// src/components/home/Testimonials.jsx
import React from "react";

const items = [
  { name: "Aarav", quote: "I finally enjoy speaking practice every day!" },
  { name: "Mira", quote: "The AI chat feels natural and helps me fix mistakes." },
  { name: "Kenji", quote: "Games and streaks keep me motivated." },
];

export default function Testimonials() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold">
          <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
            Loved by learners
          </span>
        </h2>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {items.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-2xl p-[1px] bg-gradient-to-br from-orange-600/60 to-amber-500/60"
            >
              <div className="rounded-2xl p-5 bg-neutral-900/70 backdrop-blur ring-1 ring-white/10">
                <div className="mb-3 flex items-center gap-3">
                  <div className="size-9 rounded-full text-white grid place-items-center text-sm font-semibold bg-gradient-to-br from-orange-600 to-amber-500 ring-1 ring-white/10">
                    {t.name[0]}
                  </div>
                  <span className="text-sm text-neutral-300">— {t.name}</span>
                </div>
                <p className="text-neutral-100">“{t.quote}”</p>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
