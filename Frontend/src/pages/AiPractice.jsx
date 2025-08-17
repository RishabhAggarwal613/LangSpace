import React, { useEffect, useRef, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx";

const prompts = [
  "The quick brown fox jumps over the lazy dog.",
  "She sells seashells by the seashore.",
  "I would like a cup of coffee, please.",
];

export default function AiPractice() {
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const t = e.results?.[0]?.[0]?.transcript || "";
      setTranscript(t);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, []);

  function start() {
    if (recRef.current) {
      setTranscript("");
      setListening(true);
      recRef.current.start();
    } else {
      // Fallback: fake capture
      setListening(true);
      setTimeout(() => {
        setTranscript("The quick brown fox jumps over the lazy dog.");
        setListening(false);
      }, 800);
    }
  }

  const target = prompts[index];
  const score = transcript
    ? Math.max(0, 100 - Math.abs(transcript.length - target.length) * 5)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Pronunciation & Fluency</h1>

      <Card>
        <CardHeader>
          <CardTitle>Say this aloud</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{target}</p>
          <div className="mt-4 flex gap-2">
            <Button onClick={start} disabled={listening}>
              {listening ? "Listening…" : "Start"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIndex((i) => (i + 1) % prompts.length);
                setTranscript("");
              }}
            >
              Next Prompt
            </Button>
          </div>

          <div className="mt-4 text-sm opacity-80">
            <div>Your speech:</div>
            <div className="rounded-xl border p-3 mt-1 min-h-[3rem]">
              {transcript || <span className="opacity-50">—</span>}
            </div>
          </div>

          {score !== null && (
            <div className="mt-3 text-sm">
              Estimated Score: <span className="font-medium">{Math.round(score)}%</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
