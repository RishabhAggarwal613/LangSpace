import React, { useState } from "react";
import Button from "../components/ui/Button.jsx";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx";

const lesson = {
  title: "Topic: Small Talk at Work",
  steps: [
    { id: 1, title: "Warm-up", content: "Match phrases to responses." },
    { id: 2, title: "Listening", content: "Short dialogue: identify intent." },
    { id: 3, title: "Speaking", content: "Roleplay greeting a colleague." },
    { id: 4, title: "Review", content: "Key phrases + mini-quiz." },
  ],
};

export default function AiTutor() {
  const [idx, setIdx] = useState(0);
  const step = lesson.steps[idx];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">AI Tutor</h1>

      <Card>
        <CardHeader>
          <CardTitle>{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-70">Step {idx + 1} of {lesson.steps.length}</div>
              <div className="text-lg font-medium mt-1">{step.title}</div>
            </div>
            <div className="text-sm">{Math.round(((idx + 1) / lesson.steps.length) * 100)}% complete</div>
          </div>

          <div className="mt-4 rounded-xl border p-4 text-sm">
            {step.content}
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
              Back
            </Button>
            <Button onClick={() => setIdx((i) => Math.min(i + 1, lesson.steps.length - 1))}>
              {idx === lesson.steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
