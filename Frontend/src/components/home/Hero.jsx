import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Hero() {
  const { user } = useSelector((s) => s.auth);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
          <defs>
            <radialGradient id="g" cx="50%" cy="10%" r="80%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#g)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Speak confidently in any language.
          </h1>
          <p className="mt-4 text-base md:text-lg opacity-80">
            Chat with AI, get instant feedback on pronunciation, and level up with
            games and guided practice—everything in one place.
          </p>

          {!user ? (
            <div className="mt-8 flex gap-3">
              <Link to="/auth/login" className="px-5 py-3 rounded-2xl">
                Get Started
              </Link>
              <a
                href="#features"
                className="px-5 py-3 rounded-2xl border"
              >
                Explore features
              </a>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link to="/ai-chat" className="px-4 py-3 rounded-xl border text-center">
                AI Chat
              </Link>
              <Link to="/ai-tutor" className="px-4 py-3 rounded-xl border text-center">
                AI Tutor
              </Link>
              <Link to="/ai-practice" className="px-4 py-3 rounded-xl border text-center">
                AI Practice
              </Link>
              <Link to="/ai-game" className="px-4 py-3 rounded-xl border text-center">
                AI Game
              </Link>
              <Link to="/dashboard" className="px-4 py-3 rounded-xl border text-center">
                Dashboard
              </Link>
            </div>
          )}
        </div>

        <div className="relative">
          <img
            src="/illustrations/placeholder.png"
            alt="Practice with AI"
            className="w-full rounded-3xl shadow-xl"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow p-4">
            <p className="text-sm">Live feedback • Pronunciation • Fluency</p>
          </div>
        </div>
      </div>
    </section>
  );
}
