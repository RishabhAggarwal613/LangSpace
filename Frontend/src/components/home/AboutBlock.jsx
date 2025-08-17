// src/components/home/AboutBlock.jsx
import React from "react";

export default function AboutBlock() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl md:text-3xl font-semibold">
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Why LangSpace?
            </span>
          </h2>

          <p className="mt-4 text-neutral-300">
            We combine conversation, coaching, and play into a single flow, so you
            stay motivated while building real speaking confidence.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
              Personalized feedback and goals
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
              Practice that fits busy schedules
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
              Gamified streaks and XP for momentum
            </li>
          </ul>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-white/10 bg-neutral-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-700 opacity-60" />
            <div className="absolute inset-0 mix-blend-overlay [mask-image:radial-gradient(ellipse_at_top,white_0%,transparent_60%)] bg-white/20" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl px-4 py-3 bg-neutral-900/70 backdrop-blur ring-1 ring-white/10 text-neutral-100">
              <p className="text-sm">Built for real-world speaking confidence ✨</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
