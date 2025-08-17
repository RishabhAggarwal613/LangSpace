import React, { useMemo, useState } from "react";

export default function AboutBlock() {
  const [tab, setTab] = useState("chat");

  const tabs = useMemo(
    () => [
      { id: "chat", label: "AI Chat" },
      { id: "coach", label: "Pronunciation Coach" },
      { id: "game", label: "Practice Game" },
    ],
    []
  );

  const activeIndex = tabs.findIndex((t) => t.id === tab);
  const indicatorStyle = {
    width: `${100 / tabs.length}%`,
    transform: `translateX(${activeIndex * 100}%)`,
  };

  return (
    <section id="about" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left: Intro */}
        <div className="order-2 lg:order-1">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Why LangSpace?
            </span>
          </h2>

          <p className="mt-4 text-sm md:text-base text-slate-300">
            LangSpace is an AI-powered language studio. Speak with an{" "}
            <span className="text-amber-400 font-medium">AI conversation partner</span>, polish your{" "}
            <span className="text-amber-400 font-medium">pronunciation & accent</span>, and level up through{" "}
            <span className="text-amber-400 font-medium">gamified challenges</span>. Your progress is
            tracked on a personal dashboard so practice becomes a habit.
          </p>

          <ul className="mt-6 space-y-3">
            <Feature
              title="Real conversations"
              desc="Context-aware chats with instant feedback on fluency, grammar, and word choice."
              icon="chat"
            />
            <Feature
              title="Pronunciation scoring"
              desc="Per-phoneme scoring, stress hints, and slow-down playback to copy native rhythm."
              icon="graph"
            />
            <Feature
              title="Play to practice"
              desc="Timed prompts, streaks, and XP that make short sessions surprisingly addictive."
              icon="bolt"
            />
            <Feature
              title="Built for busy people"
              desc="Bite-sized lessons, notes, and quick goals you can finish in minutes."
              icon="clock"
            />
          </ul>

          {/* CTAs (anchors to avoid Router dependency) */}
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/chat"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-black font-semibold shadow hover:opacity-95 transition"
            >
              Start a Conversation →
            </a>
            <a
              href="/practice"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 border border-slate-700 text-slate-200 hover:bg-slate-800/60 transition"
            >
              Try a Quick Drill
            </a>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Also available: <a href="/tutor" className="underline decoration-amber-400/60 hover:text-amber-300">AI Tutor</a> ·{" "}
            <a href="/dashboard" className="underline decoration-amber-400/60 hover:text-amber-300">Dashboard</a>
          </p>
        </div>

        {/* Right: Tabs + preview */}
        <div className="order-1 lg:order-2">
          <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-black p-3 shadow-lg">
            {/* Tabs */}
            <div className="relative rounded-xl bg-slate-900/60 p-1 border border-slate-800 flex">
              {/* Slider */}
              <span
                className="absolute inset-y-1 left-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-400 transition-transform duration-300"
                style={indicatorStyle}
              />
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative z-10 flex-1 text-sm md:text-base rounded-lg px-3 py-2 font-medium transition ${
                    tab === t.id ? "text-black" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Preview area */}
            <div className="mt-4">
              {tab === "chat" && <ChatPreview />}
              {tab === "coach" && <CoachPreview />}
              {tab === "game" && <GamePreview />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Subcomponents ---------- */

function Feature({ title, desc, icon }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 inline-grid place-items-center rounded-lg bg-orange-500/15 text-amber-300 p-2 border border-orange-500/30">
        {icon === "chat" && (
          <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M3 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8l-5 4V7a2 2 0 0 1 2-2z" fill="currentColor"/></svg>
        )}
        {icon === "graph" && (
          <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M3 12h2l2 6 2-12 2 8 2-4 2 6 2-10h2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
        {icon === "bolt" && (
          <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M6 3h12l-6 9h6l-10 9 3-9H6z" fill="currentColor"/></svg>
        )}
        {icon === "clock" && (
          <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 8v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </span>
      <div>
        <p className="text-slate-100 font-medium">{title}</p>
        <p className="text-slate-400 text-sm">{desc}</p>
      </div>
    </li>
  );
}

function ChatPreview() {
  return (
    <div className="rounded-xl border border-slate-800 p-4 bg-slate-950/60">
      <div className="space-y-3">
        <Bubble who="ai" text="Hey! Let’s talk about your day 👋 Tell me one highlight." />
        <Bubble who="you" text="I presented a demo—felt nervous but it went well!" />
        <Bubble who="ai" text="Nice! Try “landed well” or “was a hit” for a stronger tone." />
      </div>
    </div>
  );
}

function CoachPreview() {
  const bars = [8, 16, 12, 20, 10, 18, 6, 14, 22, 9, 15];
  return (
    <div className="rounded-xl border border-slate-800 p-4 bg-slate-950/60">
      <p className="text-slate-300 text-sm">
        Say: <span className="text-white font-medium">“schedule”</span>
      </p>
      <div className="mt-3 h-16 rounded-lg border border-slate-800 overflow-hidden">
        <div className="flex items-end gap-1 h-full px-2">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-1.5 bg-amber-400/80 rounded-t animate-pulse"
              style={{ height: h }}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-400">
        Feedback: /sked-jool/ ✓ • stress on <span className="text-amber-300">sched</span> • soften the “d”.
      </div>
    </div>
  );
}

function GamePreview() {
  return (
    <div className="rounded-xl border border-slate-800 p-4 bg-slate-950/60">
      <div className="flex items-center justify-between">
        <p className="text-slate-200 font-medium">Speed Speak — Round 2</p>
        <span className="text-xs text-amber-300">00:18</span>
      </div>
      <p className="mt-2 text-lg font-semibold text-white">
        “I’ll circle back with an update by tomorrow.”
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-slate-400">Accuracy</span>
        <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-[width] duration-700" style={{ width: "78%" }} />
        </div>
        <span className="text-xs text-amber-300">78%</span>
      </div>
    </div>
  );
}

function Bubble({ who, text }) {
  const isAI = who === "ai";
  return (
    <div className={`flex ${isAI ? "" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isAI
            ? "bg-slate-800/70 text-slate-100 border border-slate-700"
            : "bg-gradient-to-r from-orange-500 to-amber-400 text-black"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

