# LangSpace

A modern, production-ready language learning platform focused on **AI conversation**, **pronunciation & accent practice**, **gamified speaking drills**, and a **lightweight LMS** (video-based lessons) — built with **React (Vite + Tailwind v4)** on the frontend and **Spring Boot** on the backend.

---

## ✨ Core Features

- **AI Conversation Partner (Text & Voice)**
  - Context-aware dialogue, session history, CEFR-like rubric scoring
  - Voice mode with streaming STT/TTS and live hints
- **Pronunciation & Accent Practice**
  - Phoneme-level scoring, slow-playback, minimal pairs, IPA outlines
- **Gamified Speaking Drills**
  - Time-bound prompts; fluency, accuracy, and pace; streaks, XP, badges
- **LMS Lite**
  - Short video lessons + quick checks; per-topic goals; progress tracking
- **Dashboard**
  - Daily goals, heatmap streaks, level progression, leaderboards
- **Auth**
  - Guest mode, Email/Password, Google & GitHub SSO, JWT session
- **Accessibility & i18n**
  - Keyboard-first, captions, high-contrast theme, RTL-ready

---

## 🏗️ Architecture

```
LangSpace/
├─ frontend/           # React (Vite) + Tailwind v4
└─ backend/            # Spring Boot (Java 21)
```

High level:
- **Frontend**: Vite + React Router, React Query, Tailwind v4 (no PostCSS config), optional MUI
- **Backend**: Spring Boot (Web, Security + OAuth2, WebSocket), JPA, Validation, Actuator
- **DB**: PostgreSQL (prod), H2 (dev) – via Spring Profiles
- **Realtime**: WebSocket (score updates, live hints) + WebRTC (voice path, optional)
- **AI Provider**: pluggable (OpenAI / Gemini / Azure OpenAI / Anthropic) via service adapter
- **Storage**: S3-compatible object storage for lesson media & user artifacts
- **CI/CD**: GitHub Actions (build, test, lint), Vercel (frontend), Render/Railway/AWS (backend)

---

## 🎨 Brand & Theme (suggested)

- Primary: `#6C63FF` (Indigo/Violet)
- Accent: `#22D3EE` (Cyan)
- Surface: `#0B1021` (Deep Navy)
- Text: `#E6E6F0` (Light)
- Success: `#10B981`, Warning: `#F59E0B`, Error: `#EF4444`

CSS tokens:
```css
:root{
  --ls-primary:#6C63FF;
  --ls-accent:#22D3EE;
  --ls-bg:#0B1021;
  --ls-text:#E6E6F0;
}
```

---

## 📦 Frontend

**Tech**
- Vite, React 18+, React Router, @tanstack/react-query
- Tailwind **v4** (no PostCSS file needed; use `@import "tailwindcss";` in CSS)
- State: Context + (optional) Zustand/Redux Toolkit
- UI: Optional Material UI (MUI) wrapper; Icons: Lucide/Material Icons
- Voice: WebRTC + MediaDevices API (optional), Web Speech API / custom STT

**Structure (suggested)**
```
frontend/
├─ index.html
├─ package.json
├─ vite.config.js
├─ .env.local
├─ .env.production
├─ public/
│  ├─ favicon.svg
│  ├─ icons/
│  │  ├─ android-chrome-192x192.png
│  │  └─ android-chrome-512x512.png
│  └─ manifest.webmanifest
└─ src/
   ├─ main.jsx
   ├─ styles/
   │  └─ index.css                 # @import "tailwindcss";
   ├─ app/
   │  ├─ App.jsx
   │  ├─ routes.jsx
   │  ├─ ErrorBoundary.jsx
   │  └─ providers/
   │     ├─ QueryProvider.jsx
   │     ├─ ThemeProvider.jsx
   │     └─ SocketProvider.jsx
   ├─ components/
   │  ├─ layout/
   │  │  ├─ Navbar.jsx
   │  │  ├─ Footer.jsx
   │  │  ├─ PublicLayout.jsx
   │  │  └─ PrivateLayout.jsx
   │  ├─ home/
   │  │  ├─ Hero.jsx
   │  │  ├─ FeatureGrid.jsx
   │  │  ├─ AboutBlock.jsx
   │  │  └─ Testimonials.jsx
   │  └─ ui/
   │     ├─ Button.jsx
   │     └─ Card.jsx
   ├─ features/
   │  ├─ chat/
   │  ├─ pronounce/
   │  ├─ game/
   │  ├─ lms/
   │  └─ dashboard/
   └─ lib/                         # api client, auth, utils
```

**Quick Start**
```bash
cd frontend
npm i
npm run dev
# Tailwind v4: ensure src/styles/index.css has:  @import "tailwindcss";
```

**Env (frontend)**
```
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
VITE_OAUTH_GOOGLE_CLIENT_ID=...
VITE_OAUTH_GITHUB_CLIENT_ID=...
VITE_SENTRY_DSN=
```

**Routing (example)**
- `/` Home (Hero, Features, About, Testimonials)
- `/chat` AI Conversation
- `/tutor` AI Tutor / Lessons
- `/practice` Pronunciation & Accent
- `/game` Speaking Drills
- `/dashboard` Profile, Progress
- `/login`, `/signup`

---

## 🔧 Backend (Spring Boot)

**Tech**
- Java 21, Spring Boot 3.3+
- Spring Web, Spring Security (JWT + OAuth2 Client for Google/GitHub)
- Spring Data JPA (PostgreSQL), Flyway, Validation
- WebSocket (STOMP), Actuator
- Optional: Spring Cloud AWS/S3, OpenAPI (springdoc)

**Module Layout**
```
backend/
├─ src/main/java/com/langspace/
│  ├─ LangSpaceApplication.java
│  ├─ config/            # cors, swagger, websocket, s3
│  ├─ security/          # filters, jwt, oauth2 handlers
│  ├─ auth/              # controllers, services, dto
│  ├─ user/              # user, profile, progress
│  ├─ conversation/      # ai chat adapters, scoring
│  ├─ pronunciation/     # audio upload, phoneme scoring
│  ├─ game/              # prompts, rounds, leaderboard
│  ├─ lms/               # lessons, topics, watch history
│  ├─ dashboard/         # aggregates
│  ├─ common/            # utils, error, pagination
│  └─ infra/             # storage, mail, caching
├─ src/main/resources/
│  ├─ application.yml
│  └─ db/migration/      # Flyway scripts
└─ pom.xml
```

**Key Endpoints**
```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/oauth2/authorization/{google|github}
GET    /api/users/me

POST   /api/conversation/session
POST   /api/conversation/message          # text
WS     /ws/conversation                   # streaming hints/scores

POST   /api/pronunciation/score           # audio -> JSON scores
GET    /api/pronunciation/minimal-pairs

GET    /api/game/round                    # next speaking prompt
POST   /api/game/submit                   # submit recording, get score
GET    /api/leaderboard

GET    /api/lms/lessons
GET    /api/lms/lessons/{id}
POST   /api/lms/lessons/{id}/progress
```

**Scoring Response (example)**
```json
{
  "fluency": 0.87,
  "accuracy": 0.91,
  "paceWpm": 144,
  "phonemes": [{"symbol": "ð", "score": 0.72}],
  "feedback": ["Great rhythm. Focus on voiced th /ð/ in 'this'."],
  "cefrBand": "B2"
}
```

**Env (backend)**
```
SPRING_PROFILES_ACTIVE=dev
JWT_SECRET=change-me
OAUTH_GOOGLE_CLIENT_ID=...
OAUTH_GOOGLE_CLIENT_SECRET=...
OAUTH_GITHUB_CLIENT_ID=...
OAUTH_GITHUB_CLIENT_SECRET=...
DB_URL=jdbc:postgresql://localhost:5432/langspace
DB_USERNAME=postgres
DB_PASSWORD=postgres
S3_ENDPOINT=
S3_BUCKET=
AI_PROVIDER=openai|gemini|azure|anthropic
AI_API_KEY=...
```

**Local DB (Docker)**
```bash
docker run --name pg-langspace -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=langspace -p 5432:5432 -d postgres:16
```

**Run**
```bash
cd backend
./mvnw spring-boot:run
# or
mvn clean package && java -jar target/langspace.jar
```

---

## 🔐 Authentication Flows

- **Guest**: ephemeral id → limited access → upgrade at signup
- **Email/Password**: JWT (access + refresh), password policy & rate limits
- **Google/GitHub**: OAuth2 login → JWT minted by backend → sent to frontend
- **CSRF/CORS**: allow Vercel domain & localhost ports; cookie `SameSite=Lax` or Bearer header

---

## 📈 Observability

- **Actuator**: `/actuator/health`, `/metrics`
- **Logging**: JSON logs (prod), human logs (dev)
- **Sentry** / OpenTelemetry (optional)

---

## 🚀 Deployment

- **Frontend**: Vercel
  - Build Cmd: `npm run build`
  - Output Dir: `dist`
  - ENV: `VITE_API_BASE_URL`, `VITE_WS_URL`, OAuth client IDs
- **Backend**: Render/Railway/AWS
  - Java 21, Port from provider
  - DATABASE_URL configured; run Flyway on startup
  - Set `SPRING_PROFILES_ACTIVE=prod`

---

## 🧪 Testing

- **Frontend**: Vitest + React Testing Library, Playwright (e2e)
- **Backend**: JUnit 5, Testcontainers (Postgres), MockMVC/WebTestClient

---

## 🤝 Contributing

1. Fork → create feature branch → PR
2. Write tests for new behavior
3. Keep docs & types updated

---

## 📜 License

MIT © LangSpace
