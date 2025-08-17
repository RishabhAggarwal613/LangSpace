// src/components/home/Hero.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Typewriter({ words = ["confidently"], speed = 80, pause = 1200 }) {
  const safeWords =
    Array.isArray(words) && words.length > 0 ? words : ["confidently"];

  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [del, setDel] = useState(false);

  const maxLen = useMemo(
    () => Math.max(...safeWords.map((w) => (w || "").length), 1),
    [safeWords]
  );

  useEffect(() => {
    const word = safeWords[i % safeWords.length];
    if (!word) return;

    if (!del && j >= word.length) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && j <= 0) {
      setDel(false);
      setI((v) => (v + 1) % safeWords.length);
      return;
    }

    const t = setTimeout(
      () => setJ((v) => v + (del ? -1 : 1)),
      del ? speed / 2 : speed
    );
    return () => clearTimeout(t);
  }, [i, j, del, safeWords, speed, pause]);

  return (
    <span
      className="font-mono inline-block align-baseline whitespace-nowrap"
      style={{ width: `${maxLen}ch` }} // prevents layout shift
    >
      {safeWords[i % safeWords.length].slice(0, j)}
      <span className="inline-block w-[1ch] -mb-1 animate-pulse">▌</span>
    </span>
  );
}

export default function Hero() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(user ? "/ai-chat" : "/auth/login");
  };

  return (
    <section className="relative overflow-hidden bg-neutral-950">
      {/* orange/black glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-30 bg-orange-500" />
        <div className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full blur-3xl opacity-20 bg-amber-500" />
      </div>

      <div className="max-w-7xl mx-auto px-4 min-h-[75vh] grid place-items-center">
        <div className="max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ring-1 ring-white/10 bg-white/10 text-neutral-100 backdrop-blur">
            🚀 New: Real-time pronunciation scoring
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-neutral-100">
            Speak{" "}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 bg-clip-text text-transparent whitespace-nowrap">
              <Typewriter words={["confidently", "fluently", "naturally"]} />
            </span>{" "}
            in any language.
          </h1>

          <p className="mt-4 text-base md:text-lg text-neutral-300">
            Chat with AI, get instant feedback on pronunciation, and level up with
            games and guided practice—everything in one place.
          </p>

          <button
            onClick={handleStart}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white shadow-md bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            aria-label="Get started with LangSpace"
          >
            Get Started
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
