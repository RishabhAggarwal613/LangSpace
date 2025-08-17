// Lightweight client-only auth mocks for demo flows.
// Swap these out for real API/OAuth later.

function delay(ms = 500) {
  return new Promise((r) => setTimeout(r, ms));
}

function avatarFromName(name = "User") {
  const letter = (name[0] || "U").toUpperCase();
  // simple SVG data URL avatar
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>
      <rect width='100%' height='100%' rx='16' fill='#111'/>
      <text x='50%' y='54%' font-family='Arial, Helvetica, sans-serif' font-size='44' text-anchor='middle' fill='#fff'>${letter}</text>
    </svg>`
  )}`;
}

export async function guestLogin() {
  await delay(350);
  const user = {
    id: `guest_${Date.now()}`,
    name: "Guest",
    email: "guest@local",
    avatar: "",
    role: "guest",
  };
  const token = "guest-token";
  persistSession({ user, token });
  return { user, token };
}

export async function loginWithEmail(email, password) {
  await delay(600);
  if (!email || !password || password.length < 4) {
    const err = new Error("Invalid email or password.");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  const name = email.split("@")[0].replace(/[^\w]/g, "") || "User";
  const user = {
    id: `email_${Date.now()}`,
    name,
    email,
    avatar: avatarFromName(name),
    role: "user",
  };
  const token = `email-token-${Math.random().toString(36).slice(2, 8)}`;
  persistSession({ user, token });
  return { user, token };
}

export async function signupWithEmail(name, email, password) {
  await delay(700);
  if (!name || !email || !password || password.length < 4) {
    const err = new Error("Please fill all fields (password ≥ 4 chars).");
    err.code = "WEAK_INPUT";
    throw err;
  }
  const user = {
    id: `signup_${Date.now()}`,
    name,
    email,
    avatar: avatarFromName(name),
    role: "user",
  };
  const token = `signup-token-${Math.random().toString(36).slice(2, 8)}`;
  persistSession({ user, token });
  return { user, token };
}

export async function loginWithProvider(provider /* 'google' | 'github' */) {
  await delay(500);
  if (!["google", "github"].includes(provider)) {
    const err = new Error("Unsupported provider");
    err.code = "UNSUPPORTED";
    throw err;
  }
  // Mocked provider profiles
  const profiles = {
    google: {
      name: "Google User",
      email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
    },
    github: {
      name: "GitHub Coder",
      email: `dev${Math.floor(Math.random() * 1000)}@users.noreply.github.com`,
    },
  };
  const profile = profiles[provider];
  const user = {
    id: `${provider}_${Date.now()}`,
    name: profile.name,
    email: profile.email,
    avatar: avatarFromName(profile.name),
    role: "user",
    provider,
  };
  const token = `${provider}-token-${Math.random().toString(36).slice(2, 8)}`;
  persistSession({ user, token });
  return { user, token };
}

export function signOut() {
  try {
    localStorage.removeItem("ls_session");
  } catch {}
}

export function restoreSession() {
  try {
    const raw = localStorage.getItem("ls_session");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(session) {
  try {
    localStorage.setItem("ls_session", JSON.stringify(session));
  } catch {}
}
