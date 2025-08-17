import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-semibold">LangSpace</h3>
          <p className="mt-2 text-sm opacity-80">
            Practice, learn, and play—your AI-powered language companion.
          </p>
        </div>
        <div>
          <h4 className="font-medium">Product</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/ai-chat">AI Chat</Link></li>
            <li><Link to="/ai-tutor">AI Tutor</Link></li>
            <li><Link to="/ai-practice">AI Practice</Link></li>
            <li><Link to="/ai-game">AI Game</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium">Company</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li><a href="mailto:hello@langspace.app">Contact</a></li>
            <li><a href="#" onClick={(e)=>e.preventDefault()}>Privacy</a></li>
            <li><a href="#" onClick={(e)=>e.preventDefault()}>Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-center text-xs opacity-80">
        © {new Date().getFullYear()} LangSpace
      </div>
    </footer>
  );
}
