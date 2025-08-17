// src/components/home/FeatureGrid.jsx
import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Conversation",
    desc: "Talk to a friendly AI partner that adapts to your level and goals.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 8h10M7 12h6" />
        <path d="M5 20v-4H4a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6l-6 4z" />
      </svg>
    ),
    to: "/ai-chat",
    tint: "from-orange-600 to-amber-500",
  },
  {
    title: "Pronunciation Coach",
    desc: "Get instant feedback on phonemes, stress, and pacing.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 10v4a8 8 0 0 0 16 0v-4" />
        <rect x="9" y="2" width="6" height="10" rx="3" />
      </svg>
    ),
    to: "/ai-practice",
    tint: "from-amber-600 to-orange-500",
  },
  {
    title: "Tutor Path",
    desc: "Structured lessons tailored to your target language.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M21 10l-9 4-9-4" />
        <path d="M21 14l-9 4-9-4" />
      </svg>
    ),
    to: "/ai-tutor",
    tint: "from-orange-500 to-amber-400",
  },
  {
    title: "Games",
    desc: "Turn learning into streaks, points, and quick challenges.",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 20v-7a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v7" />
        <path d="M8 12v-2a4 4 0 0 1 8 0v2" />
      </svg>
    ),
    to: "/ai-game",
    tint: "from-amber-500 to-orange-600",
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold">
          <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
            What you can do
          </span>
        </h2>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <Link key={f.title} to={f.to} className="group focus:outline-none">
              <div className={`rounded-2xl p-[1px] bg-gradient-to-br ${f.tint} shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5`}>
                <div className="rounded-2xl p-5 bg-neutral-900/70 backdrop-blur ring-1 ring-white/10 group-hover:bg-neutral-900/80 transition-colors">
                  <div
                    className={`size-10 grid place-items-center rounded-xl mb-4 text-white bg-gradient-to-br ${f.tint} ring-1 ring-white/10`}
                    aria-hidden="true"
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-neutral-100">{f.title}</h3>
                  <p className="text-sm text-neutral-300 mt-1">{f.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm text-amber-300/90 group-hover:text-amber-200 transition-colors">
                    Explore
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
