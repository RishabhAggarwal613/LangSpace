// src/components/layout/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950">
      <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-semibold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
            LangSpace
          </h3>
          <p className="mt-2 text-sm text-neutral-300">
            Practice, learn, and play—your AI-powered language companion.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-neutral-100">Product</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link to="/ai-chat" className="text-neutral-300 hover:text-white hover:underline">AI Chat</Link></li>
            <li><Link to="/ai-tutor" className="text-neutral-300 hover:text-white hover:underline">AI Tutor</Link></li>
            <li><Link to="/ai-practice" className="text-neutral-300 hover:text-white hover:underline">AI Practice</Link></li>
            <li><Link to="/ai-game" className="text-neutral-300 hover:text-white hover:underline">AI Game</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-neutral-100">Company</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <a href="mailto:hello@langspace.app" className="text-neutral-300 hover:text-white hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#" onClick={(e)=>e.preventDefault()} className="text-neutral-300 hover:text-white hover:underline">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" onClick={(e)=>e.preventDefault()} className="text-neutral-300 hover:text-white hover:underline">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="py-4 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} LangSpace
      </div>
    </footer>
  );
}
