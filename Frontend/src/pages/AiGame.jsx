import React, { useMemo, useState } from "react";
import Button from "../components/ui/Button.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx";

const words = ["apple", "orange", "banana", "coffee", "station", "travel"];
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function AiGame() {
  const [score, setScore] = useState(0);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");

  const target = useMemo(() => shuffle(words)[0], [idx]);

  function submit() {
    if (!input.trim()) return;
    if (input.trim().toLowerCase() === target.toLowerCase()) {
      setScore((s) => s + 100);
    } else {
      setScore((s) => Math.max(0, s - 30));
    }
    setIdx((i) => i + 1);
    setInput("");
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Word Rush</h1>

      <Card>
        <CardHeader>
          <CardTitle>Round {idx + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="opacity-80 text-sm">Type the shown word correctly.</p>
          <div className="mt-3 text-3xl font-bold tracking-wide">{target}</div>

          <div className="mt-4 flex gap-2">
            <input
              className="flex-1 rounded-xl border px-3 py-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type here…"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            <Button onClick={submit}>Submit</Button>
          </div>

          <div className="mt-4 text-sm">Score: <span className="font-semibold">{score}</span></div>
        </CardContent>
      </Card>
    </div>
  );
}
