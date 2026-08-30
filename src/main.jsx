import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import App from "./App.jsx";
import "./index.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// LOCAL_MODE turns on automatically whenever Supabase isn't configured (no
// .env.local, or it's missing values). In this mode the app runs entirely on
// this browser's local storage — no login, no cloud sync, nothing shared
// with anyone else. It's just for previewing/testing changes on your own
// computer before you deploy against a real Supabase project.
const LOCAL_MODE = !supabaseUrl || !supabaseAnonKey;

export const supabase = LOCAL_MODE ? null : createClient(supabaseUrl, supabaseAnonKey);

/*
 * Compatibility layer for the original ERP.
 * The original app used window.storage; this implementation stores the same
 * JSON payloads in Supabase so the clinic sees the same data on every device.
 * In LOCAL_MODE, everything instead goes to this browser's localStorage.
 */
window.storage = LOCAL_MODE
  ? {
      async get(key) {
        const value = localStorage.getItem(`perfect-smiles-local:${key}`);
        return value == null ? null : { value };
      },
      async set(key, value) {
        localStorage.setItem(`perfect-smiles-local:${key}`, value);
      },
      async delete(key) {
        localStorage.removeItem(`perfect-smiles-local:${key}`);
      },
    }
  : {
      async get(key, shared = true) {
        if (!shared) {
          const value = localStorage.getItem(`perfect-smiles:${key}`);
          return value == null ? null : { value };
        }
        const { data, error } = await supabase
          .from("clinic_storage")
          .select("value")
          .eq("key", key)
          .maybeSingle();
        if (error) throw error;
        return data ? { value: typeof data.value === "string" ? data.value : JSON.stringify(data.value) } : null;
      },

      async set(key, value, shared = true) {
        if (!shared) {
          localStorage.setItem(`perfect-smiles:${key}`, value);
          return;
        }
        const { error } = await supabase
          .from("clinic_storage")
          .upsert({ key, value: JSON.parse(value), updated_at: new Date().toISOString() }, { onConflict: "key" });
        if (error) throw error;
      },

      async delete(key, shared = true) {
        if (!shared) {
          localStorage.removeItem(`perfect-smiles:${key}`);
          return;
        }
        const { error } = await supabase.from("clinic_storage").delete().eq("key", key);
        if (error) throw error;
      }
    };

function LoginPage({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError("Incorrect email or password.");
      setBusy(false);
      return;
    }
    onLoggedIn(data.session);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo"><span>✦</span></div>
        <div className="login-eyebrow">PERFECT SMILES</div>
        <h1>Clinic Portal</h1>
        <p className="login-subtitle">Sign in to access patient records, appointments and collections.</p>

        <form onSubmit={signIn}>
          <label>Email</label>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="clinic email"
            required
          />
          <label>Password</label>
          <div className="password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-button" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <div className="login-note">Private clinic system · authorised staff only</div>
      </div>
    </div>
  );
}

function LocalRolePicker({ onPick }) {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo"><span>✦</span></div>
        <div className="login-eyebrow">PERFECT SMILES · LOCAL PREVIEW</div>
        <h1>Choose a role</h1>
        <p className="login-subtitle">
          No Supabase keys were found in this folder (.env.local is missing), so this is
          running in local preview mode — nothing here is saved to the real clinic
          database. Pick a role to preview that dashboard.
        </p>
        <button className="login-button" style={{ marginBottom: 10 }} onClick={() => onPick("doctor")}>
          Continue as Doctor
        </button>
        <button className="login-button" onClick={() => onPick("reception")}>
          Continue as Reception
        </button>
        <div className="login-note">To use your real clinic data, add .env.local with your Supabase keys and restart.</div>
      </div>
    </div>
  );
}

function LocalPreviewApp() {
  const [role, setRole] = useState(() => localStorage.getItem("perfect-smiles-local-role") || "");

  const pickRole = (r) => {
    localStorage.setItem("perfect-smiles-local-role", r);
    setRole(r);
  };

  if (!role) return <LocalRolePicker onPick={pickRole} />;

  return (
    <div className="app-shell">
      <App role={role} userEmail="local-preview" />
      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem("perfect-smiles-local-role");
          setRole("");
        }}
        title="Switch role"
      >
        Switch role
      </button>
    </div>
  );
}

function AuthenticatedApp() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) return <div className="auth-loading">Loading Perfect Smiles…</div>;
  if (!session) return <LoginPage onLoggedIn={setSession} />;

  // Role comes from the Supabase user's metadata (set when the account was
  // created in the Supabase dashboard), not from anything editable in the UI.
  // Any account without a recognised role falls back to "reception".
  const metaRole = session.user?.user_metadata?.role;
  const role = metaRole === "doctor" ? "doctor" : "reception";

  return (
    <div className="app-shell">
      <App role={role} userEmail={session.user?.email || ""} />
      <button
        className="logout-button"
        onClick={() => supabase.auth.signOut()}
        title="Sign out"
      >
        Sign out
      </button>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {LOCAL_MODE ? <LocalPreviewApp /> : <AuthenticatedApp />}
  </React.StrictMode>
);
