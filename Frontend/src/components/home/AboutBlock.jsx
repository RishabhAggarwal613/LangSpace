import React from "react";

export default function AboutBlock() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl md:text-3xl font-semibold">Why LangSpace?</h2>
          <p className="mt-4 opacity-80">
            We combine conversation, coaching, and play into a single flow, so
            you stay motivated while building real speaking confidence.
          </p>
          <ul className="mt-4 space-y-2 text-sm opacity-90">
            <li>• Personalized feedback and goals</li>
            <li>• Practice that fits busy schedules</li>
            <li>• Gamified streaks and XP for momentum</li>
          </ul>
        </div>
        <div className="order-1 lg:order-2">
          <div className="aspect-[4/3] rounded-3xl border grid place-items-center text-sm opacity-80">
            Visual Placeholder
          </div>
        </div>
      </div>
    </section>
  );
}
