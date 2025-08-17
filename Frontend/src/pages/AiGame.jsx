import React, { useEffect, useMemo, useRef, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx";

const QUESTIONS = [
  { id: 1, template: "I ____ coffee every morning.", options: ["drink", "drank", "drunk"], answer: "drink" },
  { id: 2, template: "She ____ to the office by metro.", options: ["goes", "went", "gone"], answer: "goes" },
  { id: 3, template: "They ____ the match yesterday.", options: ["win", "won", "wins"], answer: "won" },
  { id: 4, template: "Please ____ the window.", options: ["open", "opened", "opens"], answer: "open" },
  { id: 5, template: "He is ____ for the exam.", options: ["study", "studying", "studied"], answer: "studying" },
  { id: 6, template: "We will ____ the report tomorrow.", options: ["submit", "submitted", "submits"], answer: "submit" },
  { id: 7, template: "Can you ____ me your pen?", options: ["lend", "lent", "lends"], answer: "lend" },
  { id: 8, template: "The train ____ at 7 AM.", options: ["arrive", "arrived", "arrives"], answer: "arrives" },
  { id: 9, template: "She has ____ her homework.", options: ["finish", "finished", "finishes"], answer: "finished" },
  { id: 10, template: "Let's ____ for a walk.", options: ["go", "went", "gone"], answer: "go" },
];

const norm = (s) => s.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
function levenshtein(a, b) {
  const s = norm(a), t = norm(b);
  const m = s.length, n = t.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}
function similarity(a, b) {
  const A = norm(a), B = norm(b);
  if (!A && !B) return 1;
  const dist = levenshtein(A, B);
  const maxLen = Math.max(A.length, B.length) || 1;
  return 1 - dist / maxLen;
}
function fillBlank(q) {
  return q.template.replace("____", q.answer);
}

async function sendToDashboard(payload) {
  try {
    const key = "langspace:dashboard:scores";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.push(payload);
    localStorage.setItem(key, JSON.stringify(prev));
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent("practice:score", { detail: payload }));
  } catch {}
  try {
    // await fetch("/api/progress/quiz", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
  } catch {}
}

function ScoreDonut({ value = 0, label = "" }) {
  const v = Math.max(0, Math.min(100, value));
  const deg = (v / 100) * 360;
  return (
    <div
      className="relative inline-flex items-center justify-center w-28 h-28 rounded-full text-white"
      style={{ background: `conic-gradient(currentColor ${deg}deg, rgba(255,255,255,0.12) ${deg}deg)` }}
    >
      <div className="absolute inset-[8px] rounded-full bg-background/80 backdrop-blur" />
      <div className="relative text-center">
        <div className="text-xl font-bold">{v}%</div>
        <div className="text-[11px] opacity-70">{label}</div>
      </div>
    </div>
  );
}

export default function AiGame() {
  const [qIndex, setQIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [perQ, setPerQ] = useState([]);
  const [finished, setFinished] = useState(false);

  const recRef = useRef(null);
  const synthRef = useRef(null);

  const supportsSR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const supportsTTS = typeof window !== "undefined" && window.speechSynthesis;

  const question = QUESTIONS[qIndex];
  const expected = useMemo(() => fillBlank(question), [qIndex]);
  const progressPct = useMemo(() => Math.round((qIndex / QUESTIONS.length) * 100), [qIndex]);

  useEffect(() => {
    if (!supportsSR) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const t = e.results?.[0]?.[0]?.transcript || "";
      setListening(false);
      handleAutoGrade(t);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, [supportsSR]);

  useEffect(() => {
    synthRef.current = supportsTTS ? window.speechSynthesis : null;
  }, [supportsTTS]);

  useEffect(() => {
    setTranscript("");
    speakPrompt();
  }, [qIndex]);

  function speakPrompt() {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const Utter = window.SpeechSynthesisUtterance;
    if (!Utter) return;
    const blankRead = question.template.replace("____", "blank");
    const opts = question.options.join(", ");
    const text = `Sentence: ${blankRead}. Options: ${opts}. Please speak the complete sentence.`;
    const u = new Utter(text);
    u.rate = 1;
    u.pitch = 1;
    u.lang = "en-US";
    synthRef.current.speak(u);
  }
  function stopSpeak() {
    if (synthRef.current) synthRef.current.cancel();
  }

  function startListening() {
    setTranscript("");
    if (recRef.current) {
      setListening(true);
      recRef.current.start();
    } else {
      setListening(true);
      setTimeout(() => {
        const fake = expected;
        handleAutoGrade(fake);
        setListening(false);
      }, 800);
    }
  }

  function handleAutoGrade(text) {
    setTranscript(text);
    const sim = similarity(text, expected);
    const scr = Math.round(sim * 100);
    const correct = scr >= 85;
    const entry = { expected, said: text, score: scr, correct, idx: qIndex + 1 };
    const nextPerQ = (() => {
      const copy = [...perQ];
      copy[qIndex] = entry;
      return copy;
    })();
    setPerQ(nextPerQ);

    setTimeout(() => {
      if (qIndex + 1 >= QUESTIONS.length) {
        setFinished(true);
        const total = nextPerQ.reduce((a, x) => a + (x?.score || 0), 0);
        const avg = Math.round(total / QUESTIONS.length);
        const payload = {
          mode: "Grammer game",
          timestamp: new Date().toISOString(),
          score: avg,
          totalQuestions: QUESTIONS.length,
          correctCount: nextPerQ.filter((x) => x?.correct).length,
          details: nextPerQ,
        };
        sendToDashboard(payload);
      } else {
        setQIndex((i) => i + 1);
      }
    }, 600);
  }

  const correctSoFar = perQ.filter((x) => x?.correct).length;
  const answeredCount = perQ.filter((x) => x).length;

  if (finished) {
    const total = perQ.reduce((a, x) => a + (x?.score || 0), 0);
    const avg = Math.round(total / QUESTIONS.length);
    const band = avg >= 90 ? "Outstanding" : avg >= 75 ? "Great" : avg >= 60 ? "Good" : "Keep practicing";

    return (
      <div className="max-w-2xl mx-auto px-4 py-10 grid gap-6">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Grammer game — Result</h1>

        <Card className="overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-slate-800 via-indigo-800 to-sky-700 relative">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(60%_100%_at_50%_0%,white_0,transparent_60%)]" />
            <div className="absolute bottom-2 left-4 right-4">
              <div className="text-[10px] text-white/80">Completed {QUESTIONS.length} / {QUESTIONS.length}</div>
            </div>
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-5">
              <ScoreDonut value={avg} label={band} />
              <div className="grid gap-1 text-sm">
                <div><span className="opacity-70">Correct:</span> <span className="font-semibold">{correctSoFar}</span> / {QUESTIONS.length}</div>
                <div><span className="opacity-70">Avg Score:</span> <span className="font-semibold">{avg}%</span></div>
                <div className="text-xs opacity-60">Score sent to Dashboard.</div>
              </div>
            </div>

            <div className="mt-6 grid gap-2">
              {perQ.map((r, i) => (
                <div key={i} className={`rounded-lg border p-3 text-sm ${r.correct ? "border-emerald-500/40" : "border-rose-500/40"}`}>
                  <div className="font-medium">Q{i + 1}: {QUESTIONS[i].template}</div>
                  <div className="mt-1"><span className="opacity-70">Expected:</span> {r.expected}</div>
                  <div className="mt-1"><span className="opacity-70">You said:</span> {r.said || "—"}</div>
                  <div className="mt-1"><span className="opacity-70">Score:</span> {r.score}% {r.correct ? "✅" : "❌"}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <Button onClick={() => { setQIndex(0); setPerQ([]); setFinished(false); setTranscript(""); }}>Retry Quiz</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Grammer game</h1>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded-full border ${supportsTTS ? "text-sky-400 border-sky-400/40" : "opacity-60"}`}>{supportsTTS ? "TTS" : "TTS N/A"}</span>
          <span className={`px-2 py-1 rounded-full border ${supportsSR ? "text-emerald-400 border-emerald-400/40" : "opacity-60"}`}>{supportsSR ? "Mic" : "Mic N/A"}</span>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="h-2 bg-white/10">
          <div className="h-2 bg-white/70 transition-all" style={{ width: `${progressPct}%` }} />
        </div>

        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg">Question {qIndex + 1} / {QUESTIONS.length}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={speakPrompt} disabled={!supportsTTS}>{supportsTTS ? "Replay" : "TTS Unavailable"}</Button>
              <Button variant="ghost" onClick={stopSpeak} disabled={!supportsTTS}>Stop</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-lg leading-relaxed">
            {question.template.split("____").map((chunk, i, arr) => (
              <span key={i}>
                {chunk}
                {i < arr.length - 1 && <span className="inline-block px-2 py-0.5 mx-1 rounded-md bg-white/10 border border-white/20 text-sm">____</span>}
              </span>
            ))}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5 text-[12px]">
            {question.options.map((k) => (
              <span key={k} className="px-2 py-1 rounded-full border border-white/20 text-white/80 bg-white/5">{k}</span>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={startListening}
              disabled={listening}
              title="Answer by speaking"
              className={`relative inline-flex items-center justify-center w-14 h-14 rounded-full border transition ${listening ? "border-emerald-400/60" : "border-white/20"}`}
            >
              <span className={`absolute inset-0 rounded-full ${listening ? "animate-ping bg-emerald-500/20" : ""}`} />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={`${listening ? "text-emerald-400" : "opacity-70"}`}>
                <path d="M12 14a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v4a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2Z" />
              </svg>
            </button>

            <div className="text-xs opacity-60">Speak the full sentence. Auto-grading runs after you finish.</div>
          </div>

          <div className="mt-4 text-sm opacity-80">
            <div>Your reply (voice → text):</div>
            <div className="rounded-xl border p-3 mt-1 min-h-[3.25rem]">{transcript || <span className="opacity-50">—</span>}</div>
            {!supportsSR && (
              <div className="mt-2">
                <textarea
                  className="w-full rounded-xl border p-3"
                  rows={3}
                  placeholder="Speech recognition unavailable. Type the full sentence; it will auto-grade."
                  value={transcript}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    clearTimeout(window.__typeTimer);
                    window.__typeTimer = setTimeout(() => handleAutoGrade(e.target.value), 600);
                  }}
                />
              </div>
            )}
          </div>

          {perQ[qIndex]?.score != null && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-[auto,1fr] items-center gap-4">
              <div className="flex items-center justify-center">
                <ScoreDonut value={perQ[qIndex].score} label={perQ[qIndex].correct ? "Correct" : "Close"} />
              </div>
              <div className="grid gap-2 text-sm">
                <div className="rounded-lg border p-2"><span className="opacity-70">Expected:</span> {expected}</div>
                <div className="rounded-lg border p-2"><span className="opacity-70">You said:</span> {perQ[qIndex].said || "—"}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm">
        <div className="opacity-70">Answered: {answeredCount} / {QUESTIONS.length} &nbsp;•&nbsp; Correct: {correctSoFar}</div>
        <div className="w-40 h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-2 bg-white/70" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </div>
  );
}
