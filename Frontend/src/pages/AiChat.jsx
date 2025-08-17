// src/pages/AiChat.jsx (responsive & mobile‑safe)
import React, { useEffect, useMemo, useRef, useState } from "react";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const SR =
  typeof window !== "undefined" &&
  (window.SpeechRecognition || window.webkitSpeechRecognition);
const hasTTS = typeof window !== "undefined" && "speechSynthesis" in window;

// Language options (BCP-47 codes)
const LANGS = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "es-ES", label: "Español (ES)" },
  { code: "es-MX", label: "Español (MX)" },
  { code: "fr-FR", label: "Français" },
  { code: "de-DE", label: "Deutsch" },
  { code: "it-IT", label: "Italiano" },
  { code: "pt-BR", label: "Português (BR)" },
  { code: "hi-IN", label: "हिन्दी" },
  { code: "ja-JP", label: "日本語" },
  { code: "ko-KR", label: "한국어" },
  { code: "zh-CN", label: "中文 (简体)" },
  { code: "ru-RU", label: "Русский" },
  { code: "ar-SA", label: "العربية" },
];

// Topic pool for suggestions
const POOL = [
  { title: "Daily Routines", tags: ["morning", "evening", "habits", "schedule"] },
  { title: "Travel Plans", tags: ["trips", "cities", "vacation", "itinerary"] },
  { title: "Favorite Foods", tags: ["cooking", "cuisine", "restaurants", "recipes"] },
  { title: "Hobbies & Weekends", tags: ["sports", "reading", "music", "movies"] },
  { title: "School or Work Day", tags: ["classes", "projects", "meetings", "tasks"] },
  { title: "Technology & Gadgets", tags: ["apps", "phones", "ai", "coding"] },
  { title: "Health & Fitness", tags: ["exercise", "diet", "sleep", "wellness"] },
  { title: "Culture & Festivals", tags: ["holidays", "traditions", "events"] },
  { title: "Environment & Nature", tags: ["climate", "outdoors", "wildlife"] },
  { title: "Books & Learning", tags: ["study", "library", "course", "skills"] },
];

// Initial dummy conversation
const STARTER = [
  { id: 1, role: "assistant", text: "👋 Hi! Pick a topic below or just start chatting." },
  { id: 2, role: "assistant", text: "Hi!" },
  { id: 3, role: "user", text: "Hello!" },
];

function pickStarterQuestion(topic) {
  const t = (topic || "").toLowerCase();
  if (t.includes("daily")) return "What time do you usually wake up, and what’s the first thing you do?";
  if (t.includes("travel")) return "Which city would you love to visit next and why?";
  if (t.includes("food")) return "What’s a dish you could eat every week without getting bored?";
  if (t.includes("hobbies")) return "What hobby relaxes you the most, and how often do you practice it?";
  if (t.includes("school") || t.includes("work")) return "What does a productive day look like for you?";
  if (t.includes("technology")) return "What’s one gadget/app you can’t live without lately?";
  if (t.includes("fitness")) return "How do you like to stay active during the week?";
  if (t.includes("culture")) return "What’s a festival you look forward to, and why?";
  if (t.includes("environment")) return "Do you prefer mountains, beaches, or forests? Why?";
  if (t.includes("books")) return "What’s a book or course that impacted you recently?";
  return "Tell me a little about it in 2–3 sentences.";
}
function aiReply(userText, topic) {
  const lower = userText.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) {
    return topic
      ? `Nice to meet you! Since we’re on “${topic}”, ${pickStarterQuestion(topic)}`
      : "Nice to meet you! Pick a topic below, or tell me what you’d like to talk about.";
  }
  return topic
    ? `Great! Staying on “${topic}”: ${pickStarterQuestion(topic)}`
    : "Got it! Want to choose a topic below so I can guide the chat better?";
}
function scoreTopic(q, item) {
  if (!q) return 0;
  const s = q.toLowerCase().trim();
  const title = item.title.toLowerCase();
  const tagHit = item.tags.some((t) => t.toLowerCase().includes(s));
  const starts = title.startsWith(s) ? 2 : 0;
  const incl = title.includes(s) ? 1 : 0;
  return starts + incl + (tagHit ? 1 : 0);
}

export default function AiChat() {
  // Language state
  const [lang, setLang] = useState("en-US");
  const langLabel = useMemo(
    () => LANGS.find((l) => l.code === lang)?.label || lang,
    [lang]
  );

  // Chat state
  const [messages, setMessages] = useState(STARTER);
  const [text, setText] = useState("");

  // Topic state
  const [topic, setTopic] = useState("");
  const [q, setQ] = useState("");

  // STT state
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);
  const transcriptRef = useRef("");
  const [interim, setInterim] = useState("");
  const [micReady, setMicReady] = useState(false);

  // TTS state
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [ttsReady, setTtsReady] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceName, setVoiceName] = useState("");
  const [ttsRate, setTtsRate] = useState(1);
  const spokenIdsRef = useRef(new Set());

  // UI scroll behavior
  const listRef = useRef(null);
  const prevLenRef = useRef(0);
  const didMountRef = useRef(false);

  // Load voices; default to a voice that matches the selected language
  useEffect(() => {
    if (!hasTTS) return;
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      const base = lang.split("-")[0].toLowerCase();
      const match =
        v.find((vv) => vv.lang?.toLowerCase().startsWith(lang.toLowerCase())) ||
        v.find((vv) => vv.lang?.toLowerCase().startsWith(base)) ||
        v[0];
      if (match && voiceName !== match.name) setVoiceName(match.name);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [lang, voiceName]);

  // Voices filtered for current language (fallback to all if none)
  const voicesForLang = useMemo(() => {
    const base = lang.split("-")[0].toLowerCase();
    const subset = voices.filter((v) => v.lang?.toLowerCase().startsWith(base));
    return subset.length ? subset : voices;
  }, [voices, lang]);

  // Mark initial assistant messages as already spoken (no TTS on mount)
  useEffect(() => {
    spokenIdsRef.current = new Set(
      messages.filter((m) => m.role === "assistant").map((m) => m.id)
    );
  }, []); // once

  // Scroll behavior: start at top; only scroll on new message append
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    if (!didMountRef.current) {
      didMountRef.current = true;
      el.scrollTop = 0;
      prevLenRef.current = messages.length;
      return;
    }
    if (messages.length > prevLenRef.current) {
      el.scrollTop = el.scrollHeight;
    }
    prevLenRef.current = messages.length;
  }, [messages]);

  // Speak new assistant messages if TTS is enabled & ready
  useEffect(() => {
    if (!ttsEnabled || !ttsReady || !hasTTS) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (spokenIdsRef.current.has(last.id)) return;
    spokenIdsRef.current.add(last.id);
    speak(last.text);
  }, [messages, ttsEnabled, ttsReady]);

  // Topic suggestions
  const suggestions = useMemo(() => {
    const trimmed = q.trim();
    if (!trimmed) return POOL.slice(0, 8);
    return [...POOL]
      .map((item) => ({ item, s: scoreTopic(trimmed, item) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map(({ item }) => item);
  }, [q]);

  function handleSelectTopic(t) {
    setTopic(t);
    const m1 = { id: Date.now(), role: "assistant", text: `🧭 New topic: ${t}` };
    const m2 = { id: Date.now() + 1, role: "assistant", text: pickStarterQuestion(t) };
    setMessages((m) => [...m, m1, m2]);
  }

  function send(msgText = text) {
    const t = msgText.trim();
    if (!t) return;
    const userMsg = { id: Date.now(), role: "user", text: t };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setTimeout(() => {
      const reply = aiReply(t, topic);
      const assistantMsg = { id: Date.now() + 1, role: "assistant", text: reply };
      setMessages((m) => [...m, assistantMsg]);
    }, 350);
  }

  // Permission helper: unlock mic + TTS (needs user gesture)
  async function enableVoice() {
    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((tr) => tr.stop());
        setMicReady(true);
      }
    } catch {
      setMicReady(false);
    }
    if (hasTTS) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(" ");
        u.volume = 0; // silent unlock
        u.rate = 1;
        u.lang = lang;
        window.speechSynthesis.speak(u);
        window.speechSynthesis.resume();
        setTtsReady(true);
        setTtsEnabled(true);
      } catch {
        setTtsReady(false);
      }
    }
  }

  // STT (Voice → Text)
  function toggleMic() {
    if (!SR) return;
    if (!micReady) {
      enableVoice();
      return;
    }
    if (listening) {
      recogRef.current?.stop();
      return;
    }
    const R = new SR();
    recogRef.current = R;
    transcriptRef.current = "";
    setInterim("");

    R.lang = lang; // <- recognition language
    R.continuous = false;
    R.interimResults = true;

    R.onstart = () => setListening(true);
    R.onresult = (e) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const chunk = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += chunk;
        else interimText += chunk;
      }
      if (interimText) setInterim(interimText);
      if (finalText) {
        transcriptRef.current += finalText;
        setInterim("");
      }
    };
    R.onerror = () => setListening(false);
    R.onend = () => {
      setListening(false);
      const finalT = (transcriptRef.current || "").trim();
      if (finalT) {
        send(finalT);
        transcriptRef.current = "";
      }
    };
    R.start();
  }

  // TTS (Text → Voice)
  function speak(textToSpeak) {
    if (!hasTTS || !ttsReady || !textToSpeak) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textToSpeak);
      const chosen =
        voices.find((vv) => vv.name === voiceName) ||
        voicesForLang[0] ||
        voices[0];
      if (chosen) {
        u.voice = chosen;
        u.lang = chosen.lang || lang;
      } else {
        u.lang = lang;
      }
      u.rate = ttsRate;
      window.speechSynthesis.speak(u);
    } catch {}
  }

  // If language changes, snap voice to a matching one if needed
  useEffect(() => {
    const current = voices.find((v) => v.name === voiceName);
    const base = lang.split("-")[0].toLowerCase();
    if (!current || !current.lang?.toLowerCase().startsWith(base)) {
      const next = voicesForLang[0] || voices[0];
      if (next && next.name !== voiceName) setVoiceName(next.name);
    }
  }, [lang, voices, voicesForLang, voiceName]);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-6 grid gap-4 sm:gap-6 text-neutral-100">
      {/* Permission banner */}
      {(!micReady || !ttsReady) && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-sm">
            <strong className="text-amber-300">Voice not enabled.</strong>{" "}
            Click to grant microphone permission and allow text-to-speech playback.
          </div>
          <Button onClick={enableVoice} className="px-3 py-2 w-full sm:w-auto">Enable Mic & Speech</Button>
        </div>
      )}

      {/* Chat box */}
      <section className="rounded-2xl border border-white/10 bg-neutral-900/70 backdrop-blur">
        {/* Header */}
        <header className="flex flex-col md:flex-row gap-3 md:gap-2 md:items-center md:justify-between p-3 sm:p-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center">
            <h1 className="text-lg md:text-xl font-semibold">Conversation Practice</h1>
            <span className="text-xs px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/10 w-fit">
              Language: <span className="text-amber-300">{langLabel}</span>
            </span>
            {topic ? (
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/10 w-fit">
                Topic: <span className="text-amber-300">{topic}</span>
              </span>
            ) : (
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-neutral-300 w-fit">
                No topic selected
              </span>
            )}
          </div>

          {/* Controls: responsive — compact dropdown on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg bg-neutral-950/60 ring-1 ring-white/10"
              title="Conversation Language"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
            {hasTTS && (
              <select
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="text-xs px-2 py-1 rounded-lg bg-neutral-950/60 ring-1 ring-white/10"
                title="TTS Voice"
                disabled={!ttsReady || voicesForLang.length === 0}
              >
                {voicesForLang.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            )}
            {hasTTS && (
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.1"
                value={ttsRate}
                onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                className="w-24 accent-amber-500"
                title="TTS Speed"
                disabled={!ttsReady}
              />
            )}
            <button
              type="button"
              onClick={() => { if (!ttsReady) { enableVoice(); return; } setTtsEnabled((v) => !v); try { window.speechSynthesis.resume(); } catch {} }}
              className={`px-3 py-2 rounded-xl border ${
                ttsEnabled ? "border-amber-400 text-amber-300 bg-amber-500/10" : "border-white/15 text-neutral-200 hover:text-white hover:bg-white/5"
              } ${!ttsReady ? "opacity-60" : ""}`}
              title={ttsEnabled ? "Disable AI speech" : "Enable AI speech"}
              aria-pressed={ttsEnabled}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                {ttsEnabled ? (
                  <path d="M3 10v4h4l5 4V6L7 10H3zm13.5 2a3.5 3.5 0 0 1-1.8 3.07l.7 1.24A5 5 0 0 0 20 12a5 5 0 0 0-4.6-4.9l-.7 1.24A3.5 3.5 0 0 1 16.5 12z" />
                ) : (
                  <path d="M3 10v4h4l5 4V6L7 10H3z" />
                )}
              </svg>
            </button>
            <button
              type="button"
              onClick={toggleMic}
              disabled={!SR}
              className={`px-3 py-2 rounded-xl border ${
                listening ? "border-amber-400 text-amber-300 bg-amber-500/10 animate-pulse" : "border-white/15 text-neutral-200 hover:text-white hover:bg-white/5"
              } disabled:opacity-50`}
              title={!SR ? "Speech recognition not supported" : listening ? "Stop listening" : "Start listening"}
              aria-pressed={listening}
              aria-label={listening ? "Stop listening" : "Start listening"}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                {listening ? (
                  <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                ) : (
                  <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile: fold controls into a details dropdown */}
          <details className="md:hidden group rounded-xl ring-1 ring-white/10 bg-white/5">
            <summary className="list-none px-3 py-2 text-sm flex items-center justify-between cursor-pointer select-none">
              <span>Chat Settings</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
            </summary>
            <div className="px-3 pb-3 grid grid-cols-1 gap-2">
              <select value={lang} onChange={(e) => setLang(e.target.value)} className="text-xs px-2 py-2 rounded-lg bg-neutral-950/60 ring-1 ring-white/10">
                {LANGS.map((l) => (<option key={l.code} value={l.code}>{l.label}</option>))}
              </select>
              {hasTTS && (
                <select value={voiceName} onChange={(e) => setVoiceName(e.target.value)} className="text-xs px-2 py-2 rounded-lg bg-neutral-950/60 ring-1 ring-white/10" disabled={!ttsReady || voicesForLang.length === 0}>
                  {voicesForLang.map((v) => (<option key={v.name} value={v.name}>{v.name} ({v.lang})</option>))}
                </select>
              )}
              {hasTTS && (
                <input type="range" min="0.7" max="1.3" step="0.1" value={ttsRate} onChange={(e) => setTtsRate(parseFloat(e.target.value))} className="w-full accent-amber-500" disabled={!ttsReady} />
              )}
              <div className="flex gap-2">
                <Button onClick={() => { if (!ttsReady) { enableVoice(); return; } setTtsEnabled((v) => !v); }} className="flex-1">
                  {ttsEnabled ? "Disable Speech" : "Enable Speech"}
                </Button>
                <Button onClick={toggleMic} disabled={!SR} className="flex-1">
                  {listening ? "Stop Mic" : "Start Mic"}
                </Button>
              </div>
            </div>
          </details>
        </header>

        {/* Messages */}
        <div ref={listRef} className="p-3 sm:p-4 h-[48dvh] sm:h-[52dvh] md:h-[56dvh] lg:h-[60dvh] overflow-auto">
          <ul className="space-y-3">
            {messages.map((m) => (
              <li
                key={m.id}
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2 break-words ${
                  m.role === "user"
                    ? "ml-auto text-white bg-gradient-to-r from-orange-600 to-amber-600"
                    : "bg-white/5 text-neutral-100"
                }`}
              >
                <p className="text-sm leading-relaxed">{m.text}</p>
              </li>
            ))}
            {interim && (
              <li className="max-w-[85%] sm:max-w-[75%] ml-auto rounded-2xl px-4 py-2 text-white bg-gradient-to-r from-orange-600/60 to-amber-600/60">
                <p className="text-sm leading-relaxed opacity-90">{interim}</p>
              </li>
            )}
          </ul>
        </div>

        {/* Composer */}
        <footer className="p-3 sm:p-4 border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <Input
              placeholder={`Speak or type your message… (${langLabel})`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              className="flex-1 bg-neutral-950/60 text-neutral-100"
            />
            <Button onClick={() => send()} className="bg-gradient-to-r from-orange-600 to-amber-600 text-white w-full sm:w-auto">
              Send
            </Button>
          </div>
          {!SR && (
            <p className="mt-2 text-xs text-neutral-400">
              Voice input requires a browser with the Web Speech API (Chrome/Edge over HTTPS).
            </p>
          )}
        </footer>
      </section>

      {/* Topic selection */}
      <section className="rounded-2xl border border-white/10 p-3 sm:p-4 bg-neutral-900/60">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-base md:text-lg font-semibold">Choose a topic</h2>
          <div className="w-full md:w-80">
            <Input
              placeholder="Search topics (e.g., travel, food)…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-neutral-950/60 text-neutral-100"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {suggestions.length === 0 ? (
            <p className="text-sm text-neutral-400 col-span-full">No matches. Try another keyword.</p>
          ) : (
            suggestions.map((s) => (
              <button
                key={s.title}
                onClick={() => handleSelectTopic(s.title)}
                className="text-left rounded-xl px-3 py-2 ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition group"
              >
                <div className="text-sm font-medium text-neutral-100">{s.title}</div>
                <div className="mt-1 text-xs text-neutral-400">{s.tags.slice(0, 3).join(" • ")}</div>
                <div className="mt-2 h-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 opacity-60 group-hover:opacity-100" />
              </button>
            ))
          )}
        </div>

        <p className="mt-3 text-xs text-neutral-400">
          AI suggestions update as you type. Click a card to set the topic and I’ll ask a starter question.
        </p>
      </section>
    </div>
  );
}
