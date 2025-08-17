import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function AboutBlock() {
  const [mode, setMode] = useState("chat"); // chat | coach | game

  const tabs = [
    { id: "chat", label: "Chat" },
    { id: "coach", label: "Coach" },
    { id: "game", label: "Game" },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        {/* Left column */}
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl md:text-3xl font-semibold">
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Why LangSpace?
            </span>
          </h2>
          <p className="mt-3 text-neutral-300 max-w-prose">
            Conversation, coaching, and play — all in one flow. We help you practice daily,
            get quick feedback, and keep momentum with bite‑size games.
          </p>

          {/* Feature grid */}
          <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li className="flex items-start gap-3 rounded-2xl p-3 ring-1 ring-white/10 bg-white/5">
              <span className="inline-grid place-items-center size-8 rounded-xl bg-gradient-to-br from-orange-600 to-amber-500 text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M2 5h20v2H2zM2 11h20v2H2zM2 17h20v2H2z"/></svg>
              </span>
              <div>
                <div className="font-medium">Real conversation</div>
                <div className="text-sm opacity-80">Voice or text with instant AI replies</div>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl p-3 ring-1 ring-white/10 bg-white/5">
              <span className="inline-grid place-items-center size-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 14l10 5 10-5-10-5Z"/></svg>
              </span>
              <div>
                <div className="font-medium">Actionable coaching</div>
                <div className="text-sm opacity-80">Pronunciation hints & grammar nudges</div>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl p-3 ring-1 ring-white/10 bg-white/5">
              <span className="inline-grid place-items-center size-8 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-500 text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </span>
              <div>
                <div className="font-medium">Games & streaks</div>
                <div className="text-sm opacity-80">Stay motivated with XP and mini‑wins</div>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl p-3 ring-1 ring-white/10 bg-white/5">
              <span className="inline-grid place-items-center size-8 rounded-xl bg-gradient-to-br from-rose-600 to-pink-500 text-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.53L12 21.35z"/></svg>
              </span>
              <div>
                <div className="font-medium">Built for busy days</div>
                <div className="text-sm opacity-80">Short sessions that fit your schedule</div>
              </div>
            </li>
          </ul>

          {/* Micro‑stats */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { k: "Avg session", v: "6 min" },
              { k: "Daily streaks", v: "1k+" },
              { k: "Voice ready", v: "TTS/STT" },
              { k: "Learners", v: "Worldwide" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl ring-1 ring-white/10 bg-white/5 p-3">
                <div className="text-xs opacity-70">{s.k}</div>
                <div className="text-lg font-semibold">{s.v}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-wrap gap-2">
            <a href="/ai-chat" className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white ring-1 ring-white/10">Try a demo</a>
            <a href="/ai-practice" className="px-4 py-2 rounded-xl ring-1 ring-white/15 bg-white/5 hover:bg-white/10">Go to Practice</a>
          </div>
        </div>

        {/* Right column — interactive showcase */}
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-white/10 bg-neutral-950">
            {/* Ambient gradient */}
            <motion.div
              aria-hidden
              className="absolute -inset-40 bg-[conic-gradient(from_180deg_at_50%_50%,#f97316,transparent_30%,#f59e0b,transparent_60%)] opacity-40"
              animate={{ rotate: [0, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Tab pill */}
            <div className="absolute top-3 left-3 right-3 mx-auto w-fit rounded-full bg-neutral-900/70 backdrop-blur ring-1 ring-white/10 px-1 py-1 flex gap-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setMode(t.id)}
                  className={`text-xs px-3 py-1.5 rounded-full transition ${
                    mode === t.id
                      ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white"
                      : "text-neutral-300 hover:bg-white/10"
                  }`}
                  aria-pressed={mode === t.id}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Scenes */}
            <div className="absolute inset-0 p-4 sm:p-6 grid place-items-center">
              {mode === "chat" && <ShowChat />}
              {mode === "coach" && <ShowCoach />}
              {mode === "game" && <ShowGame />}
            </div>

            {/* Bottom caption */}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl px-4 py-3 bg-neutral-900/70 backdrop-blur ring-1 ring-white/10 text-neutral-100">
              <p className="text-sm">
                {mode === "chat" && "Speak naturally. The AI keeps the conversation going."}
                {mode === "coach" && "Instant hints: pronunciation, stress, and grammar focus."}
                {mode === "game" && "Mini games that grade you and send scores to the dashboard."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Visual scenes (pure UI, no data fetching) ---------- */
function Shell({ children, title, accent = "from-orange-600 to-amber-500" }) {
  return (
    <div className="w-full max-w-[560px]">
      <div className="rounded-2xl ring-1 ring-white/10 bg-white/5 overflow-hidden">
        <div className={`h-10 flex items-center gap-2 px-3 text-sm font-medium bg-gradient-to-r ${accent} text-white`}>
          <div className="size-2.5 rounded-full bg-white/90" /> {title}
        </div>
        <div className="p-3 sm:p-4">{children}</div>
      </div>
    </div>
  );
}

function ShowChat() {
  const msgs = useMemo(() => [
    { role: "ai", text: "Hi! Tell me about your morning routine." },
    { role: "you", text: "I wake up at 7 and make coffee." },
    { role: "ai", text: "Nice! Do you exercise before work?" },
  ], []);
  return (
    <Shell title="Conversation" accent="from-sky-600 to-indigo-500">
      <ul className="space-y-2">
        {msgs.map((m, i) => (
          <li key={i} className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.role === "you" ? "ml-auto bg-gradient-to-r from-orange-600 to-amber-500 text-white" : "bg-white/10"}`}>
            {m.text}
          </li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-2 items-center">
        <input readOnly value="Type or speak…" className="px-3 py-2 rounded-xl bg-neutral-950/60 ring-1 ring-white/10 text-xs text-neutral-300" />
        <button className="px-3 py-2 rounded-xl ring-1 ring-white/10 bg-white/5 text-xs">🎤 Mic</button>
        <button className="px-3 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs">Send</button>
      </div>
    </Shell>
  );
}

function ShowCoach() {
  const chips = ["Stress on syllable 2", "Present simple for habits", "/θ/ not /t/"];
  return (
    <Shell title="Coaching" accent="from-emerald-600 to-teal-500">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl ring-1 ring-white/10 p-3 bg-white/5">
          <div className="text-xs opacity-70">Pronunciation</div>
          <div className="mt-2">
            <div className="text-sm">“think” → /θɪŋk/</div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: "78%" }} />
            </div>
          </div>
        </div>
        <div className="rounded-xl ring-1 ring-white/10 p-3 bg-white/5">
          <div className="text-xs opacity-70">Grammar Focus</div>
          <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
            <li>Habit statement: “I <b>drink</b> coffee at 7.”</li>
            <li>3rd person: “She <b>drinks</b> coffee.”</li>
          </ul>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span key={c} className="text-xs px-2 py-1 rounded-lg bg-white/10 ring-1 ring-white/10">{c}</span>
        ))}
      </div>
    </Shell>
  );
}

function ShowGame() {
  return (
    <Shell title="Grammar Game" accent="from-rose-600 to-pink-500">
      <div className="grid sm:grid-cols-[auto,1fr] gap-3 items-center">
        <div className="grid place-items-center">
          {/* Donut */}
          <div className="relative size-24">
            <div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(#f97316 270deg, rgba(255,255,255,.2) 0)" }} />
            <div className="absolute inset-2 rounded-full bg-neutral-950/80" />
            <div className="absolute inset-0 grid place-items-center text-white text-lg font-bold">90%</div>
          </div>
        </div>
        <div className="rounded-xl ring-1 ring-white/10 p-3 bg-white/5 text-sm">
          <div className="opacity-70">Fill the blank</div>
          <div className="mt-1 font-medium">I ____ coffee every morning.</div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {["drink", "drank", "drunk"].map((w, i) => (
              <span key={w} className={`px-2 py-1 rounded-full ring-1 ring-white/10 ${i === 0 ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white" : "bg-white/10"}`}>{w}</span>
            ))}
          </div>
          <div className="mt-2 text-xs opacity-70">Auto‑graded • Score synced to dashboard</div>
        </div>
      </div>
    </Shell>
  );
}

