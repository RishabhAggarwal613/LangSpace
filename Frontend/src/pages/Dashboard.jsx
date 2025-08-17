import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx";

const IS_BROWSER = typeof window !== "undefined";
const LS_KEY = "langspace:dashboard:scores"; // written by practice components

function readScores() {
  if (!IS_BROWSER) return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = JSON.parse(raw || "[]");
    // ensure newest first
    return Array.isArray(arr) ? arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];
  } catch {
    return [];
  }
}

function saveScores(scores) {
  if (!IS_BROWSER) return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(scores)); } catch {}
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function computeStreak(scores) {
  if (!scores.length) return 0;
  const days = new Set(scores.map((s) => startOfDay(new Date(s.timestamp))));
  let streak = 0;
  let cursor = startOfDay(new Date());
  while (days.has(cursor)) {
    streak += 1;
    cursor -= 24 * 60 * 60 * 1000; // back 1 day
  }
  return streak;
}

function avg(nums) {
  const valid = nums.filter((n) => Number.isFinite(n));
  if (!valid.length) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

function Donut({ value = 0, size = 112, label = "" }) {
  const v = clamp(Math.round(value), 0, 100);
  const deg = (v / 100) * 360;
  const stroke = 8;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{ background: `conic-gradient(#f59e0b ${deg}deg, rgba(255,255,255,.15) ${deg}deg)` }}
      />
      <div className="absolute" style={{ inset: stroke }}>
        <div className="w-full h-full rounded-full bg-neutral-950/80 backdrop-blur" />
      </div>
      <div className="relative text-center">
        <div className="text-2xl font-bold">{v}%</div>
        <div className="text-[11px] opacity-70">{label}</div>
      </div>
    </div>
  );
}

function Sparkline({ values = [], w = 420, h = 90 }) {
  const pad = 6;
  const data = values.length ? values : [0];
  const max = Math.max(100, ...data);
  const pts = data.map((v, i) => [
    pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1),
    h - pad - (clamp(v, 0, max) / max) * (h - pad * 2),
  ]);
  const path = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[90px]" role="img" aria-label="Progress over time">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={w} height={h} rx="10" className="fill-neutral-900/60" />
      <path d={path} fill="none" stroke="url(#g)" strokeWidth="3" />
      {last && <circle cx={last[0]} cy={last[1]} r="3.5" className="fill-white" />}
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth) || {};
  const name = user?.name || "Learner";

  const [scores, setScores] = useState(() => readScores());

  // Live updates from practice pages
  useEffect(() => {
    function onScore(e) {
      const payload = e?.detail;
      if (!payload) return;
      setScores((prev) => {
        const next = [payload, ...prev];
        saveScores(next);
        return next;
      });
    }
    window.addEventListener("practice:score", onScore);
    return () => window.removeEventListener("practice:score", onScore);
  }, []);

  // Derive metrics
  const sessions = scores.length;
  const accuracy = Math.round(avg(scores.map((s) => s.score || 0)));
  const streak = computeStreak(scores);
  const xp = 1000 + sessions * 15 + Math.round((accuracy / 100) * 200); // lightweight formula

  const recent = useMemo(() => {
    if (!scores.length) return [
      { id: 1, title: "Pronunciation: /θ/ vs /t/", result: "82%" },
      { id: 2, title: "Dialogue: Cafe ordering", result: "A-" },
      { id: 3, title: "Quick Game: Word Rush", result: "910 pts" },
    ];
    return scores.slice(0, 6).map((r, i) => ({
      id: i,
      title: r.mode || "Practice Session",
      result: `${Math.round(r.score)}%`,
      timestamp: r.timestamp,
    }));
  }, [scores]);

  const series = useMemo(() => {
    const last = scores.slice(0, 10).reverse(); // oldest → newest
    return last.map((s) => clamp(Math.round(s.score || 0), 0, 100));
  }, [scores]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10 grid gap-4 sm:gap-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Welcome back, {name} 👋</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5">
          <CardTitle className="opacity-70 text-xs sm:text-sm">XP</CardTitle>
          <div className="mt-2 text-2xl sm:text-3xl font-bold">{xp}</div>
          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-600 to-amber-500" style={{ width: `${clamp((xp % 1000) / 10, 5, 100)}%` }} />
          </div>
        </Card>
        <Card className="p-4 sm:p-5">
          <CardTitle className="opacity-70 text-xs sm:text-sm">Streak</CardTitle>
          <div className="mt-2 text-2xl sm:text-3xl font-bold">{streak} day{streak === 1 ? "" : "s"}</div>
          <div className="text-[11px] opacity-60">Keep it going daily</div>
        </Card>
        <Card className="p-4 sm:p-5">
          <CardTitle className="opacity-70 text-xs sm:text-sm">Sessions</CardTitle>
          <div className="mt-2 text-2xl sm:text-3xl font-bold">{sessions}</div>
          <div className="text-[11px] opacity-60">All-time</div>
        </Card>
        <Card className="p-4 sm:p-5 flex items-center justify-between gap-3">
          <div>
            <CardTitle className="opacity-70 text-xs sm:text-sm">Accuracy</CardTitle>
            <div className="mt-2 text-2xl sm:text-3xl font-bold">{accuracy}%</div>
          </div>
          <Donut value={accuracy} label="avg" />
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Progress overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {series.length ? (
              <div className="grid gap-3">
                <Sparkline values={series} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg border border-white/10 p-2">
                    Avg: <span className="font-semibold">{accuracy}%</span>
                  </div>
                  <div className="rounded-lg border border-white/10 p-2">
                    Best: <span className="font-semibold">{Math.max(...series)}%</span>
                  </div>
                  <div className="rounded-lg border border-white/10 p-2 col-span-2 sm:col-span-1">
                    Last: <span className="font-semibold">{series[series.length - 1]}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-40 grid place-items-center opacity-70 text-sm border rounded-xl">
                No data yet — play a game or finish a practice to see progress.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length ? (
              <ul className="space-y-3">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm truncate">{r.title}</div>
                      {r.timestamp && (
                        <div className="text-[11px] opacity-60">{new Date(r.timestamp).toLocaleString()}</div>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/10">
                      {r.result}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-40 grid place-items-center opacity-70 text-sm border rounded-xl">
                Nothing here yet — try a practice session.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
