import React, { useEffect, useRef, useState } from "react";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const SEED = [
  { id: 1, role: "assistant", text: "Hi! Let’s chat about your day. How are you feeling?" },
  { id: 2, role: "user", text: "Pretty good! I practiced vocabulary this morning." },
];

export default function AiChat() {
  const [messages, setMessages] = useState(SEED);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    const t = text.trim();
    if (!t) return;
    const userMsg = { id: Date.now(), role: "user", text: t };
    setMessages((m) => [...m, userMsg]);
    setText("");

    // Fake AI reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            "Great! Quick follow-up: can you describe your morning routine in three sentences?",
        },
      ]);
    }, 600);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid gap-4">
      <h1 className="text-2xl font-semibold">AI Chat</h1>

      <div className="rounded-2xl border p-4 h-[60vh] overflow-auto bg-white/60">
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                m.role === "user"
                  ? "ml-auto bg-black text-white"
                  : "bg-black/5"
              }`}
            >
              <p className="text-sm leading-relaxed">{m.text}</p>
            </li>
          ))}
          <div ref={endRef} />
        </ul>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type your message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1"
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}
