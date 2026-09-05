"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 12) {
      setError("Use at least 12 characters for your security.");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match. Please check and re-enter.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await getSupabaseBrowser().auth.updateUser({ password });
    if (updateError) {
      setError("The reset session is invalid or expired. Please request a new link.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/auth/complete-setup", { method: "POST" });
    if (!response.ok) {
      setError("Password updated, but admin setup could not be finalized. Please try again.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <div>
        <p className="admin-eyebrow">SECURITY RECOVERY // ACCESS RESTORATION</p>
        <h1>New password.</h1>
        <p className="admin-login-copy">
          Set a secure 12+ character passkey for administrative authentication.
        </p>
      </div>

      <label>
        New Password (Min 12 Characters)
        <input
          type="password"
          minLength={12}
          placeholder="••••••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="new-password"
        />
      </label>

      <label>
        Confirm New Password
        <input
          type="password"
          minLength={12}
          placeholder="••••••••••••"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          required
          autoComplete="new-password"
        />
      </label>

      {error && (
        <p className="admin-form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "SAVING..." : "SAVE PASSWORD ↗"}
      </button>

      <small>SUPABASE AUTH // ENCRYPTED ACCESS KEY</small>
    </form>
  );
}