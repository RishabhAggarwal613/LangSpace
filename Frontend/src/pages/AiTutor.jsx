import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx";

/* ---------- Languages ---------- */
const LANGS = [
  { code: "en-US", label: "English (US)" },
  { code: "es-ES", label: "Español (ES)" },
  { code: "hi-IN", label: "हिन्दी" },
  { code: "ja-JP", label: "日本語" },
];

const hasTTS = typeof window !== "undefined" && "speechSynthesis" in window;

/* ---------- Catalog (baseline) ---------- */
const BASE_CATALOG = {
  "en-US": [
    {
      id: "en-g-1",
      category: "Grammar",
      title: "Present Simple: Routines",
      explain: [
        "Use the present simple for habits and routines.",
        "Form: Subject + base verb (3rd person singular adds -s).",
      ],
      examples: [
        "I start work at 9 a.m.",
        "She takes the bus to the office.",
        "We often chat during lunch.",
      ],
    },
    {
      id: "en-v-1",
      category: "Vocabulary",
      title: "Workplace Small Talk",
      explain: [
        "Small talk builds rapport at work. Keep it light and friendly.",
        "Openers: 'How’s your morning going?' / 'Any plans this weekend?'",
      ],
      examples: [
        "How’s your day so far?",
        "Did you watch the game last night?",
        "I like your setup—new keyboard?",
      ],
    },
  ],
  "es-ES": [
    {
      id: "es-g-1",
      category: "Gramática",
      title: "Presente: Rutinas",
      explain: [
        "Usamos el presente para hábitos y rutinas.",
        "Forma: Sujeto + verbo (3ª persona añade -a/-e).",
      ],
      examples: [
        "Empiezo a trabajar a las 9.",
        "Ella va al trabajo en autobús.",
        "A menudo hablamos a la hora de comer.",
      ],
    },
  ],
  "hi-IN": [
    {
      id: "hi-g-1",
      category: "व्याकरण",
      title: "साधारण वर्तमान: आदतें",
      explain: [
        "आदतों और दिनचर्या के लिए साधारण वर्तमान का प्रयोग करें।",
        "रूप: कर्ता + क्रिया (तीसरे पुरुष में ‘ता/ती/ते’).",
      ],
      examples: ["मैं रोज 9 बजे काम शुरू करता/करती हूँ।", "वह बस से दफ्तर जाता है।"],
    },
  ],
  "ja-JP": [
    {
      id: "ja-v-1",
      category: "語彙",
      title: "職場のスモールトーク",
      explain: [
        "軽い話題で関係を築きます。挨拶や週末の予定が無難です。",
        "例：『週末はどうでしたか？』『最近忙しいですか？』",
      ],
      examples: ["今日はいい天気ですね。", "今朝はどうでしたか？"],
    },
  ],
};

/* ---------- Helpers ---------- */
function buildReadingText(topics) {
  if (!topics?.length) return "";
  const parts = [];
  for (const t of topics) {
    parts.push(t.title);
    (t.explain || []).forEach((e) => parts.push(e));
    parts.push("Examples:");
    (t.examples || []).forEach((e) => parts.push(e));
  }
  return parts.join(". ");
}
function tokenizeWithPositions(text) {
  const tokens = [];
  if (!text) return tokens;
  const re = /\S+/g;
  let m;
  while ((m = re.exec(text)) !== null) tokens.push({ word: m[0], start: m.index });
  return tokens;
}
function generateTopicFromQuery(q, lang) {
  const trimmed = q.trim();
  const isGrammar = /grammar|tense|verb|present|past|future|article|preposition|conjug/i.test(trimmed);
  const title = (isGrammar ? "Grammar Focus: " : "Vocabulary Builder: ") + (trimmed[0]?.toUpperCase() + trimmed.slice(1));
  const category =
    lang === "es-ES" ? (isGrammar ? "Gramática" : "Vocabulario")
    : lang === "hi-IN" ? (isGrammar ? "व्याकरण" : "शब्दावली")
    : lang === "ja-JP" ? (isGrammar ? "文法" : "語彙")
    : (isGrammar ? "Grammar" : "Vocabulary");
  const explain = isGrammar
    ? [`Core rules for “${trimmed}” with simple patterns.`, "Focus on form and frequent mistakes."]
    : [`Practical vocabulary around “${trimmed}”.`, "Group words by usage and natural phrases."];
  const examples = isGrammar
    ? [`I ${trimmed} every day. (pattern)`, `She ${trimmed}s on weekends. (3rd person)`]
    : [`Common words for ${trimmed}: item, phrase, collocation.`, `Useful phrase: “I'm really into …”`];
  return { id: `gen-${Date.now()}`, category, title, explain, examples };
}
function l1GuidanceLines(topic, l1) {
  const title = topic?.title || "Topic";
  const map = {
    "es-ES": [`Comprende: ${title}.`, "Concéntrate en la forma y el uso con ejemplos sencillos."],
    "hi-IN": [`समझें: ${title}`, "रूप और प्रयोग पर सरल उदाहरणों के साथ ध्यान दें।"],
    "ja-JP": [`理解: ${title}`, "形と使い方に注目し、やさしい例文で確認しましょう。"],
    "en-US": [`Understand: ${title}`, "Focus on form and usage with simple examples."],
  };
  return map[l1] || map["en-US"];
}
function label(key, l1) {
  const L = {
    Explanation: { "es-ES": "Explicación", "hi-IN": "व्याख्या", "ja-JP": "説明" },
    Examples: { "es-ES": "Ejemplos", "hi-IN": "उदाहरण", "ja-JP": "例文" },
    Narration: { "es-ES": "Narración", "hi-IN": "वाचन", "ja-JP": "ナレーション" },
    LessonComplete: { "es-ES": "Lección completada", "hi-IN": "पाठ पूर्ण", "ja-JP": "レッスン完了" },
    GoPractice: { "es-ES": "Ir a Práctica", "hi-IN": "प्रैक्टिस पर जाएँ", "ja-JP": "練習へ進む" },
    Guidance: { "es-ES": "Guía en L1", "hi-IN": "L1 मार्गदर्शन", "ja-JP": "母語ガイド" },
  };
  return L[key]?.[l1] || key;
}

/* ---------- Topic Card Grid (revamped + responsive) ---------- */
function TopicBrowser({ topics, filtered, selectedIds, setSelectedIds, query, setQuery, onGenerate }) {
  function toggle(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  return (
    <div className="relative">
      {/* Search + actions */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">
            <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M15.5 14h-.8l-.3-.3a5.5 5.5 0 1 0-.7.7l.3.3v.8l4.2 4.2 1.2-1.2L15.5 14zm-5 0a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topic (e.g., articles, routines, travel)…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-neutral-950/60 ring-1 ring-white/10 placeholder-neutral-400 outline-none"
          />
        </div>
        <Button
          onClick={onGenerate}
          disabled={!query.trim()}
          className="bg-gradient-to-r from-orange-600 to-amber-600 w-full sm:w-auto"
          title="Generate a new topic from your search text"
        >
          + Generate Topic
        </Button>
        {!!selectedIds.length && (
          <Button
            variant="outline"
            onClick={() => setSelectedIds([])}
            className="border border-white/15 bg-white/5 hover:bg-white/10 w-full sm:w-auto"
            title="Clear selected"
          >
            Clear ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Selected chips */}
      {selectedIds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.filter((t) => selectedIds.includes(t.id)).map((t) => (
            <span key={t.id} className="text-xs px-2 py-1 rounded-lg bg-white/10 ring-1 ring-white/10">
              {t.title}
            </span>
          ))}
        </div>
      )}

      {/* Grid panel */}
      <div className="mt-3 rounded-2xl p-2 bg-neutral-900/70 ring-1 ring-white/10 backdrop-blur">
        <div className="max-h-72 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.length === 0 ? (
            <div className="text-sm text-neutral-400 p-4">No matches. Try another keyword or “Generate Topic”.</div>
          ) : (
            filtered.map((t) => {
              const active = selectedIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggle(t.id)}
                  className={`relative text-left rounded-xl p-3 transition ring-1 group overflow-hidden ${
                    active
                      ? "bg-gradient-to-br from-amber-500/20 to-orange-500/10 ring-amber-400"
                      : "bg-white/5 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-tr from-orange-600/20 to-amber-400/10 blur-2xl" />
                  <div className="text-[10px] uppercase tracking-wide opacity-70">{t.category}</div>
                  <div className="mt-1 font-medium break-words">{t.title}</div>
                  <div className="mt-2 h-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 opacity-60 group-hover:opacity-100" />
                  {active && (
                    <div className="absolute top-2 right-2 rounded-full bg-emerald-500/90 text-white p-1">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>
        <div className="pt-2 text-xs text-neutral-400">Tip: Click cards to select/deselect. The panel is scrollable.</div>
      </div>
    </div>
  );
}

/* ---------- Main Component (responsive & UI fixes) ---------- */
export default function AiTutor() {
  const navigate = useNavigate();

  // Flow: choose -> lesson
  const [stage, setStage] = useState("choose");

  // Target language & Mother tongue
  const [lang, setLang] = useState("en-US");
  const [mother, setMother] = useState("en-US");

  // Topics
  const [topicsForLang, setTopicsForLang] = useState(BASE_CATALOG[lang] || []);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Teaching anchor for smooth scroll
  const teachRef = useRef(null);

  useEffect(() => {
    setTopicsForLang([...(BASE_CATALOG[lang] || []).map((t) => ({ ...t }))]);
    setSelectedIds([]);
    setQuery("");
  }, [lang]);

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topicsForLang;
    return topicsForLang.filter(
      (t) => t.title.toLowerCase().includes(q) || (t.category || "").toLowerCase().includes(q)
    );
  }, [topicsForLang, query]);

  const selectedTopics = useMemo(
    () => topicsForLang.filter((t) => selectedIds.includes(t.id)),
    [topicsForLang, selectedIds]
  );

  // TTS + typing sync
  const [ttsReady, setTtsReady] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [voiceName, setVoiceName] = useState("");
  const [voices, setVoices] = useState([]);
  const [rate, setRate] = useState(1);

  const [readingText, setReadingText] = useState("");
  const [showChars, setShowChars] = useState(0);
  const tokensRef = useRef([]);
  const targetCharRef = useRef(0);
  const utterRef = useRef(null);
  const rafIdRef = useRef(null);
  const lastTsRef = useRef(0);
  const typingSpeed = 60; // chars/sec

  const lessonDone = showChars >= readingText.length && readingText.length > 0;

  // Voices
  useEffect(() => {
    if (!hasTTS) return;
    const load = () => {
      const vs = window.speechSynthesis.getVoices();
      setVoices(vs);
      const base = lang.split("-")[0].toLowerCase();
      const match =
        vs.find((v) => v.lang?.toLowerCase().startsWith(lang.toLowerCase())) ||
        vs.find((v) => v.lang?.toLowerCase().startsWith(base)) ||
        vs[0];
      if (match && !voiceName) setVoiceName(match.name);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => (window.speechSynthesis.onvoiceschanged = null);
  }, [lang, voiceName]);

  const voicesForLang = useMemo(() => {
    const base = lang.split("-")[0].toLowerCase();
    const list = voices.filter((v) => v.lang?.toLowerCase().startsWith(base));
    return list.length ? list : voices;
  }, [voices, lang]);

  async function enableSpeech() {
    if (!hasTTS) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance("Speech enabled");
      u.volume = 0.01; // quiet probe to unlock
      u.lang = lang;
      window.speechSynthesis.speak(u);
      window.speechSynthesis.resume();
      setTtsReady(true);
      setTtsEnabled(true);
    } catch {
      setTtsReady(false);
    }
  }

  // Narration data
  useEffect(() => {
    const txt = buildReadingText(selectedTopics);
    setReadingText(txt);
    setShowChars(0);
    tokensRef.current = tokenizeWithPositions(txt);
    targetCharRef.current = 0;
  }, [selectedTopics]);

  // Typing loop
  const startTypingLoop = () => {
    if (rafIdRef.current) return;
    lastTsRef.current = performance.now();
    const loop = (ts) => {
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      const target = targetCharRef.current;
      setShowChars((prev) => (prev >= target ? prev : Math.min(target, prev + typingSpeed * dt)));
      rafIdRef.current = requestAnimationFrame(loop);
    };
    rafIdRef.current = requestAnimationFrame(loop);
  };
  const stopTypingLoop = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = null;
  };

  function play() {
    if (!hasTTS || !ttsReady || !readingText) return;
    stop();
    setShowChars(0);
    targetCharRef.current = 0;

    const u = new SpeechSynthesisUtterance(readingText);
    const chosen = voices.find((v) => v.name === voiceName) || voicesForLang[0] || voices[0];
    if (chosen) {
      u.voice = chosen;
      u.lang = chosen.lang || lang;
    } else u.lang = lang;
    u.rate = rate;

    u.onboundary = (e) => {
      const toks = tokensRef.current;
      const c = e.charIndex ?? 0;
      let lo = 0, hi = toks.length - 1, ans = -1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (toks[mid].start <= c) { ans = mid; lo = mid + 1; } else hi = mid - 1;
      }
      const endOfToken = ans >= 0 ? toks[ans].start + toks[ans].word.length + 1 : c;
      targetCharRef.current = Math.max(targetCharRef.current, endOfToken);
      startTypingLoop();
    };
    u.onend = () => {
      targetCharRef.current = readingText.length;
      startTypingLoop();
      utterRef.current = null;
    };

    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }
  function pause() { try { window.speechSynthesis.pause(); } catch {} stopTypingLoop(); }
  function resume() { try { window.speechSynthesis.resume(); } catch {} startTypingLoop(); }
  function stop() { try { window.speechSynthesis.cancel(); } catch {} utterRef.current = null; stopTypingLoop(); }

  function startLesson() {
    setStage("lesson");
    // smooth scroll to teaching section on mobile
    setTimeout(() => {
      teachRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    if (ttsEnabled && readingText) setTimeout(() => play(), 120);
  }
  function handleGenerate() {
    const q = query.trim();
    if (!q) return;
    const gen = generateTopicFromQuery(q, lang);
    setTopicsForLang((prev) => [gen, ...prev]);
    setSelectedIds((prev) => [gen.id, ...prev]);
    setQuery("");
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  /* ---------- UI ---------- */

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-10 grid gap-6 text-neutral-100">
      {/* Decorative backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-orange-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
      </div>

      {/* Intro */}
      <div className="rounded-3xl p-[1px] bg-gradient-to-r from-orange-600/40 via-amber-500/40 to-orange-600/40">
        <Card className="rounded-3xl bg-neutral-950/70 backdrop-blur ring-1 ring-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-base md:text-lg">
              <span className="inline-grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-orange-600 to-amber-500 text-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="currentColor" d="M3 11h8V3H3v8zm0 10h8v-8H3v8zm10 0h8v-8h-8v8zm0-18v8h8V3h-8z"/></svg>
              </span>
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Language Coach
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base text-neutral-300">
              Choose your <b>Target Language</b> and <b>Mother Tongue</b>. Pick or generate topics.
              I’ll teach with examples in the target language, add quick guidance in your mother tongue,
              and read everything aloud while the text types in sync. When finished, jump to Practice.
            </p>
            {!ttsReady && (
              <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span>
                  <strong className="text-amber-300">Speech not enabled.</strong> Click to allow text-to-speech playback.
                </span>
                <Button onClick={enableSpeech} className="px-3 py-2 w-full sm:w-auto">Enable Speech</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <div className="rounded-3xl p-[1px] bg-gradient-to-r from-orange-600/30 via-amber-500/30 to-orange-600/30">
        <Card className="rounded-3xl bg-neutral-950/70 backdrop-blur ring-1 ring-white/10">
          <CardHeader>
            <CardTitle>Language Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <label className="flex items-center gap-2">
                <span className="w-28 text-sm text-neutral-300">Target Language</span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="flex-1 text-sm px-3 py-2 rounded-xl bg-neutral-950/60 ring-1 ring-white/10"
                >
                  {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="w-28 text-sm text-neutral-300">Mother Tongue</span>
                <select
                  value={mother}
                  onChange={(e) => setMother(e.target.value)}
                  className="flex-1 text-sm px-3 py-2 rounded-xl bg-neutral-950/60 ring-1 ring-white/10"
                >
                  {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="w-24 text-sm text-neutral-300">TTS Voice</span>
                <select
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  disabled={!ttsReady}
                  className="flex-1 text-sm px-3 py-2 rounded-xl bg-neutral-950/60 ring-1 ring-white/10 disabled:opacity-60"
                >
                  {voicesForLang.map((v) => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="w-16 text-sm text-neutral-300">Speed</span>
                <input
                  type="range" min="0.7" max="1.3" step="0.1"
                  value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics */}
      <div className="rounded-3xl p-[1px] bg-gradient-to-r from-orange-600/30 via-amber-500/30 to-orange-600/30">
        <Card className="rounded-3xl bg-neutral-950/70 backdrop-blur ring-1 ring-white/10">
          <CardHeader>
            <CardTitle>Choose Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <TopicBrowser
              topics={topicsForLang}
              filtered={filteredTopics}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              query={query}
              setQuery={setQuery}
              onGenerate={handleGenerate}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={startLesson} disabled={selectedTopics.length === 0} className="w-full sm:w-auto">
                Start Teaching
              </Button>
              <Button onClick={play} disabled={!ttsReady || selectedTopics.length === 0}
                className="bg-gradient-to-r from-orange-600 to-amber-600 w-full sm:w-auto">
                Read Aloud
              </Button>
              <Button onClick={pause} className="border border-white/15 bg-white/5 hover:bg-white/10 w-full sm:w-auto">Pause</Button>
              <Button onClick={resume} className="border border-white/15 bg-white/5 hover:bg-white/10 w-full sm:w-auto">Resume</Button>
              <Button onClick={stop} className="border border-white/15 bg-white/5 hover:bg-white/10 w-full sm:w-auto">Stop</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teaching */}
      {stage === "lesson" && selectedTopics.length > 0 && (
        <div ref={teachRef} className="rounded-3xl p-[1px] bg-gradient-to-r from-orange-600/40 via-amber-500/40 to-orange-600/40">
          <Card className="rounded-3xl bg-neutral-950/70 backdrop-blur ring-1 ring-white/10">
            <CardHeader className="sticky top-2 z-10 bg-neutral-950/80 backdrop-blur rounded-2xl">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                Teaching
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/10">
                  {LANGS.find(x=>x.code===lang)?.label} • L1: {LANGS.find(x=>x.code===mother)?.label}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedTopics.map((t) => {
                  const guidance = l1GuidanceLines(t, mother);
                  return (
                    <div key={t.id} className="rounded-2xl ring-1 ring-white/10 p-4 bg-white/5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-[10px] uppercase tracking-wide opacity-70">{t.category}</div>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 ring-1 ring-white/10">
                          Guidance: <span className="text-amber-300">{LANGS.find(x=>x.code===mother)?.label}</span>
                        </span>
                      </div>
                      <div className="mt-1 font-medium break-words">{t.title}</div>

                      <h4 className="mt-3 text-sm font-semibold text-amber-300">
                        {label("Explanation", mother)} • <span className="opacity-80">{label("Guidance", mother)}</span>
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-neutral-200 list-disc pl-5">
                        {(t.explain || []).map((p, i) => (
                          <li key={i}>
                            {p}
                            {mother !== lang && (
                              <div className="text-xs text-neutral-300 mt-0.5 opacity-90">
                                {guidance[i] || guidance[guidance.length - 1]}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>

                      <h4 className="mt-3 text-sm font-semibold text-amber-300">{label("Examples", mother)}</h4>
                      <ul className="mt-2 space-y-1 text-sm text-neutral-200 list-disc pl-5">
                        {(t.examples || []).map((ex, i) => <li key={i}>{ex}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Narration */}
              {readingText && (
                <div className="mt-6 rounded-2xl ring-1 ring-white/10 p-4 bg-neutral-900/70">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-amber-300">{label("Narration", mother)}</div>
                    <div className="w-full sm:w-1/2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-[width]"
                        style={{ width: readingText ? `${(showChars / Math.max(1, readingText.length)) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-base leading-relaxed" aria-live="polite">
                    <span className="text-neutral-100">{readingText.slice(0, Math.floor(showChars))}</span>
                    <span className="text-neutral-500">{readingText.slice(Math.floor(showChars))}</span>
                  </p>

                  <div className="mt-3 flex flex-col sm:flex-row flex-wrap gap-2">
                    <Button onClick={play} className="bg-gradient-to-r from-orange-600 to-amber-600 w-full sm:w-auto">Play</Button>
                    <Button onClick={pause} className="border border-white/15 bg-white/5 hover:bg-white/10 w-full sm:w-auto">Pause</Button>
                    <Button onClick={resume} className="border border-white/15 bg-white/5 hover:bg-white/10 w-full sm:w-auto">Resume</Button>
                    <Button onClick={stop} className="border border-white/15 bg-white/5 hover:bg-white/10 w-full sm:w-auto">Stop</Button>
                  </div>
                </div>
              )}

              {/* Completion */}
              <div className="mt-6">
                {lessonDone ? (
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-sm text-emerald-300">✅ {label("LessonComplete", mother)}</span>
                    <Button onClick={() => navigate("/ai-practice")} className="w-full sm:w-auto">{label("GoPractice", mother)}</Button>
                  </div>
                ) : (
                  <span className="text-sm text-neutral-400">Press <em>Play</em> to begin narration.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
