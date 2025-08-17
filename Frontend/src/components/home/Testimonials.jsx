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
        <h2 className="text-2xl md:text-3xl font-semibold">Loved by learners</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {items.map((t) => (
            <blockquote key={t.name} className="rounded-2xl border p-5">
              <p className="opacity-90">“{t.quote}”</p>
              <footer className="mt-3 text-sm opacity-70">— {t.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
