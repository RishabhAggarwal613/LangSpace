import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice.js";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import {
  guestLogin,
  loginWithEmail,
  loginWithProvider,
  restoreSession,
} from "../services/auth.service.js";

function ProviderIcon({ type }) {
  if (type === "google") {
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path fill="#EA4335" d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.7-2.6-5.7-5.7S8.9 6 12 6c1.8 0 3 .8 3.7 1.5l2.5-2.5C16.9 3.7 14.7 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c6.9 0 9.6-4.8 9.6-7.2 0-.5-.1-.9-.2-1.3H12z" />
      </svg>
    );
  }
  // github
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2.1c-3.4.7-4.1-1.4-4.1-1.4-.6-1.4-1.4-1.7-1.4-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 .1.6 1.9 2.9 1.4.1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.4-5.5-6.2 0-1.4.5-2.6 1.2-3.5-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.5 1.3a11.8 11.8 0 0 1 6.3 0c2.4-1.6 3.4-1.3 3.4-1.3.6 1.7.2 3 .1 3.3.8.9 1.2 2.1 1.2 3.5 0 4.8-2.8 5.9-5.5 6.2.5.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/>
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("demo@langspace.app");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  useEffect(() => {
    const restored = restoreSession();
    if (restored?.user && restored?.token) {
      dispatch(loginSuccess(restored));
      navigate(redirectTo, { replace: true });
    }
  }, []); // eslint-disable-line

  async function onEmailLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await loginWithEmail(email, password);
      dispatch(loginSuccess(session));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  }

  async function onProviderLogin(provider) {
    setError("");
    setOauthLoading(provider);
    try {
      const session = await loginWithProvider(provider);
      dispatch(loginSuccess(session));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Provider sign-in failed.");
    } finally {
      setOauthLoading("");
    }
  }

  async function onGuest() {
    setError("");
    setLoading(true);
    try {
      const session = await guestLogin();
      dispatch(loginSuccess(session));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError("Guest access failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh grid place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl border p-6 grid gap-4 bg-white/70">
        <h1 className="text-xl font-semibold">Welcome back</h1>

        {/* OAuth & Guest */}
        <div className="grid gap-2">
          <Button
            variant="outline"
            onClick={() => onProviderLogin("google")}
            disabled={oauthLoading === "google" || loading}
            className="w-full justify-center gap-2"
          >
            <ProviderIcon type="google" />
            {oauthLoading === "google" ? "Connecting…" : "Continue with Google"}
          </Button>
          <Button
            variant="outline"
            onClick={() => onProviderLogin("github")}
            disabled={oauthLoading === "github" || loading}
            className="w-full justify-center gap-2"
          >
            <ProviderIcon type="github" />
            {oauthLoading === "github" ? "Connecting…" : "Continue with GitHub"}
          </Button>
          <Button
            onClick={onGuest}
            disabled={loading || oauthLoading}
            className="w-full justify-center"
          >
            Continue as Guest
          </Button>
        </div>

        <div className="flex items-center gap-3 my-2">
          <div className="h-px bg-black/10 flex-1" />
          <span className="text-xs opacity-70">or</span>
          <div className="h-px bg-black/10 flex-1" />
        </div>

        {/* Email form */}
        <form onSubmit={onEmailLogin} className="grid gap-3">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button type="submit" disabled={loading || !!oauthLoading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-sm opacity-80">
          No account? <Link to="/auth/signup" className="underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
