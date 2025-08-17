import React from "react";

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
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold">What you can do</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <a
              key={f.title}
              href={f.to}
              className="group rounded-2xl border p-5 hover:shadow-lg transition"
            >
              <div className="size-10 grid place-items-center rounded-xl border mb-4">
                {f.icon}
              </div>
              <h3 className="font-medium">{f.title}</h3>
              <p className="text-sm opacity-80 mt-1">{f.desc}</p>
              <span className="mt-3 inline-block text-sm opacity-80 group-hover:opacity-100">
                Explore →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
