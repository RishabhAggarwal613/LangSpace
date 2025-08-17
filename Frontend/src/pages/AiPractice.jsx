import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx";

const scenarios = [
  {
    id: 1,
    question: "Colleague: Could you join the meeting at 3 PM?",
    keywords: ["meeting", "join", "send", "agenda", "3", "pm"],
    expectTime: true,
    expectYesNo: true,
  },
  {
    id: 2,
    question: "Barista: What would you like to drink?",
    keywords: [
      "coffee",
      "tea",
      "latte",
      "cappuccino",
      "water",
      "juice",
      "milkshake",
      "espresso",
    ],
  },
  {
    id: 3,
    question: "Interviewer: Tell me about a project you're proud of.",
    keywords: [
      "project",
      "built",
      "developed",
      "created",
      "designed",
      "implemented",
      "improved",
      "because",
    ],
  },
  {
    id: 4,
    question: "Friend: Can we reschedule our call to tomorrow?",
    keywords: ["reschedule", "call", "tomorrow", "busy", "available", "later", "confirm"],
    expectTime: true,
    expectYesNo: true,
  },
  {
    id: 5,
    question: "Tourist: How do I get to the railway station?",
    keywords: ["go", "straight", "left", "right", "block", "signal", "road", "landmark", "station"],
  },
];

const fillers = ["um", "uh", "er", "erm", "like", "you know", "hmm"];

function ScoreDonut({ value = 0, label = "" }) {
  const clamped = Math.max(0, Math.min(100, value));
  const deg = (clamped / 100) * 360;
  let ring = "bg-[conic-gradient(var(--tw-ring)_0deg,var(--tw-ring)_0deg)]";
  // We'll inject the conic gradient via style for compatibility
  const bg = {
    background: `conic-gradient(currentColor ${deg}deg, rgba(255,255,255,0.12) ${deg}deg)`,
  };
  return (
    <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-full text-white" style={bg}>
      <div className="absolute inset-[8px] rounded-full bg-background/80 backdrop-blur" />
      <div className="relative text-center">
        <div className="text-xl font-bold">{clamped}%</div>
        <div className="text-[11px] opacity-70">{label}</div>
      </div>
    </div>
  );
}

export default function AiConversationPractice() {
  const [idx, setIdx] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [typingIdx, setTypingIdx] = useState(0);

  const recRef = useRef(null);
  const synthRef = useRef(null);

  const supportsSR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const supportsTTS = typeof window !== "undefined" && window.speechSynthesis;

  const scenario = scenarios[idx];

  useEffect(() => {
    if (!supportsSR) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const t = e.results?.[0]?.[0]?.transcript || "";
      setTranscript(t);
      setListening(false);
      autoGrade(t);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, [supportsSR]);

  useEffect(() => {
    synthRef.current = supportsTTS ? window.speechSynthesis : null;
  }, [supportsTTS]);

  // Reset view & typewriter when scenario changes
  useEffect(() => {
    setTranscript("");
    setScore(null);
    setBreakdown(null);
    setTypingIdx(0);
    speakQuestion();
  }, [idx]);

  // Typewriter effect for the question text
  useEffect(() => {
    if (typingIdx >= scenario.question.length) return;
    const t = setTimeout(() => setTypingIdx((n) => Math.min(scenario.question.length, n + 2)), 12);
    return () => clearTimeout(t);
  }, [typingIdx, scenario.question.length]);

  function speakQuestion() {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const Utter = window.SpeechSynthesisUtterance || null;
    if (!Utter) return;
    const u = new Utter(scenario.question);
    u.rate = 1;
    u.pitch = 1;
    u.lang = "en-US";
    synthRef.current.speak(u);
  }

  function stopSpeaking() {
    if (synthRef.current) synthRef.current.cancel();
  }

  function startListening() {
    setTranscript("");
    setScore(null);
    setBreakdown(null);
    if (recRef.current) {
      setListening(true);
      recRef.current.start();
    } else {
      setListening(true);
      setTimeout(() => {
        const fallback = "Sure, I can join the meeting at 3 PM. I will be ready with the notes.";
        setTranscript(fallback);
        setListening(false);
        autoGrade(fallback);
      }, 900);
    }
  }

  // --- Scoring helpers ---
  const lower = (s) => s.toLowerCase();
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function countMatches(text, words) {
    const t = lower(text);
    let hits = 0;
    for (const w of words || []) {
      const re = new RegExp(`\\b${escapeRegex(lower(w))}\\b`);
      if (re.test(t)) hits += 1;
    }
    return hits;
  }
  function hasYes(text) {
    return /(\byes\b|\bsure\b|\bok(ay)?\b|\balright\b|\bi can\b|\bi will\b|\bof course\b|\bsounds good\b)/i.test(text);
  }
  function hasNo(text) {
    return /(\bno\b|can't|cannot|won't|not possible|sorry i can't|i'm not able)/i.test(text);
  }
  function hasTime(text) {
    return /(\b\d{1,2}(:\d{2})?\s?(am|pm)\b)|(\btoday\b|\btomorrow\b|\btonight\b|\bthis (evening|afternoon)\b|\blater\b)/i.test(text);
  }
  function wordCount(text) {
    return (text.trim().match(/\b\w+\b/g) || []).length;
  }
  function fillerPenalty(text) {
    const t = lower(text);
    let c = 0;
    for (const f of fillers) {
      const re = new RegExp(`\\b${escapeRegex(f)}\\b`, "g");
      c += (t.match(re) || []).length;
    }
    return Math.min(10, c * 2.5);
  }
  function gradeResponse(response, cfg) {
    const wc = wordCount(response);
    const lengthScore = Math.max(0, Math.min(15, (Math.min(25, wc) / 25) * 15));
    const matched = countMatches(response, cfg.keywords || []);
    const keywordScore = cfg.keywords?.length ? Math.min(40, (matched / cfg.keywords.length) * 40) : 0;
    const timeScore = cfg.expectTime ? (hasTime(response) ? 20 : 0) : 0;
    let yesNoScore = 0;
    if (cfg.expectYesNo && (hasYes(response) || hasNo(response))) yesNoScore = 15;
    const fluencyPenalty = fillerPenalty(response);
    const base = lengthScore + keywordScore + timeScore + yesNoScore;
    const total = Math.max(0, Math.min(100, base - fluencyPenalty));
    const band = total >= 85 ? "Excellent" : total >= 70 ? "Good" : total >= 50 ? "Fair" : "Practice";
    return {
      total: Math.round(total),
      band,
      breakdown: {
        lengthScore: Math.round(lengthScore),
        keywordScore: Math.round(keywordScore),
        timeScore,
        yesNoScore,
        fluencyPenalty: Math.round(fluencyPenalty),
        matchedKeywords: matched,
      },
    };
  }

  function autoGrade(text) {
    if (!text?.trim()) return;
    const g = gradeResponse(text, scenario);
    setScore(g.total);
    setBreakdown(g.breakdown);
  }

  // Auto-grade when user types in fallback textarea (debounced)
  useEffect(() => {
    if (listening) return;
    if (!transcript?.trim()) return;
    const t = setTimeout(() => autoGrade(transcript), 500);
    return () => clearTimeout(t);
  }, [transcript, idx, listening]);

  const progress = useMemo(() => (idx + 1) / scenarios.length, [idx]);
  const bandLabel = score == null ? "" : score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Practice";
  const bandClass = score == null
    ? "border"
    : score >= 85
    ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
    : score >= 70
    ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
    : score >= 50
    ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
    : "bg-rose-500/15 text-rose-500 border-rose-500/30";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 grid gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Conversation Practice</h1>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded-full border ${supportsTTS ? "text-sky-400 border-sky-400/40" : "opacity-60"}`}>{supportsTTS ? "TTS" : "TTS N/A"}</span>
          <span className={`px-2 py-1 rounded-full border ${supportsSR ? "text-emerald-400 border-emerald-400/40" : "opacity-60"}`}>{supportsSR ? "Mic" : "Mic N/A"}</span>
        </div>
      </div>

      {/* Fancy Card */}
      <Card className="overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-slate-800 via-indigo-800 to-sky-700 relative">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(60%_100%_at_50%_0%,white_0,transparent_60%)]" />
          <div className="absolute bottom-2 left-4 right-4">
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div className="h-1.5 rounded-full bg-white/70" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            <div className="mt-1 text-[10px] text-white/80">Scenario {idx + 1} / {scenarios.length}</div>
          </div>
        </div>

        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg">Listen & Reply</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={speakQuestion} disabled={!supportsTTS}>
                {supportsTTS ? "Replay Question" : "TTS Unavailable"}
              </Button>
              <Button variant="ghost" onClick={stopSpeaking} disabled={!supportsTTS}>Stop</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Question with typewriter */}
          <p className="text-lg leading-relaxed min-h-[2.5rem]">
            {scenario.question.slice(0, typingIdx)}
            <span className="opacity-40">{scenario.question.slice(typingIdx)}</span>
          </p>

          {/* Keyword chips */}
          {scenario.keywords?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
              {scenario.keywords.map((k) => (
                <span key={k} className="px-2 py-1 rounded-full border border-white/20 text-white/70 bg-white/5">
                  {k}
                </span>
              ))}
            </div>
          ) : null}

          {/* Controls */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={startListening}
              disabled={listening}
              className={`relative inline-flex items-center justify-center w-14 h-14 rounded-full border transition ${
                listening ? "border-emerald-400/60" : "border-white/20"
              }`}
            >
              <span className={`absolute inset-0 rounded-full ${listening ? "animate-ping bg-emerald-500/20" : ""}`} />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={`${listening ? "text-emerald-400" : "opacity-70"}`}>
                <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Z" />
              </svg>
            </button>
            <Button variant="outline" onClick={() => { setTranscript(""); setScore(null); setBreakdown(null); }}>
              Clear
            </Button>
            <Button variant="outline" onClick={() => setIdx((i) => (i + 1) % scenarios.length)}>
              Next Scenario
            </Button>
            <span className={`px-2 py-1 rounded-full border text-xs ${bandClass}`}>{score == null ? "Awaiting reply" : bandLabel}</span>
          </div>

          {/* User transcript */}
          <div className="mt-4 text-sm opacity-80">
            <div>Your reply (voice → text):</div>
            <div className="rounded-xl border p-3 mt-1 min-h-[3.25rem]">
              {transcript || <span className="opacity-50">—</span>}
            </div>
            {!supportsSR && (
              <div className="mt-2">
                <textarea
                  className="w-full rounded-xl border p-3"
                  rows={3}
                  placeholder="Speech recognition unavailable. Type your reply… grading runs automatically."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Score */}
          {score !== null && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-[auto,1fr] items-center gap-4">
              <div className="flex items-center justify-center">
                <ScoreDonut value={score} label={bandLabel} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg border p-2">Length: {breakdown?.lengthScore}/15</div>
                <div className="rounded-lg border p-2">Keywords: {breakdown?.keywordScore}/40 ({breakdown?.matchedKeywords} hit{(breakdown?.matchedKeywords ?? 0) === 1 ? "" : "s"})</div>
                <div className="rounded-lg border p-2">Time Mention: {breakdown?.timeScore}/20</div>
                <div className="rounded-lg border p-2">Yes/No Intent: {breakdown?.yesNoScore}/15</div>
                <div className="rounded-lg border p-2">Fluency Penalty: -{breakdown?.fluencyPenalty}</div>
              </div>
            </div>
          )}

          <div className="mt-6 text-xs opacity-60">
            Auto‑grading runs after each reply. Tip: answer in complete sentences, include specifics (time/details), and avoid fillers like “um/uh”.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
