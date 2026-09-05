"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await getSupabaseBrowser().auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Invalid credentials. Please verify your email and password.");
      setLoading(false);
      return;
    }

    const stateResponse = await fetch("/api/admin/auth/state");
    if (!stateResponse.ok) {
      await getSupabaseBrowser().auth.signOut();
      setError("This account is not authorized for admin access.");
      setLoading(false);
      return;
    }

    const state = await stateResponse.json();
    void fetch("/api/admin/auth/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "FIRST_LOGIN" }),
    });

    router.push(state.mustChangePassword ? "/admin/change-password" : "/admin");
  }

  async function forgotPassword() {
    setError("");
    setNotice("");
    if (!email) {
      setError("Enter your admin email first to request a password reset.");
      return;
    }

    const { error: resetError } = await getSupabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });

    if (resetError) {
      setError("Unable to request password reset. Please try again.");
    } else {
      setNotice("If the account exists, a secure reset link has been dispatched.");
      void fetch("/api/admin/auth/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "PASSWORD_RESET_REQUESTED", email }),
      });
    }
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <div>
        <p className="admin-eyebrow">ADMIN ACCESS // SECURE GATEWAY</p>
        <h1>Control room.</h1>
        <p className="admin-login-copy">
          Authorized personnel only. Secure operational control center for Bexyee inventory, campaigns, and commerce.
        </p>
      </div>

      <label>
        Admin Email
        <input
          type="email"
          placeholder="admin@bexyee.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
      </label>

      <label>
        Password
        <input
          type="password"
          placeholder="••••••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
        />
      </label>

      {error && (
        <p className="admin-form-error" role="alert">
          {error}
        </p>
      )}

      {notice && (
        <p className="admin-form-message">
          {notice}
        </p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "AUTHENTICATING..." : "ENTER OPS ↗"}
      </button>

      <button
        type="button"
        className="admin-secondary-button"
        onClick={forgotPassword}
      >
        FORGOT PASSWORD?
      </button>

      <small>AUTHENTICATION POWERED BY SUPABASE // ZERO PASSWORDS STORED PLAIN</small>
    </form>
  );
}
