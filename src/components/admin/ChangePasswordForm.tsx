"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

export function ChangePasswordForm({ email, firstLogin }: { email: string; firstLogin: boolean }) {
  const [stage, setStage] = useState<"otp" | "password">(firstLogin ? "otp" : "password");
  const [otp, setOtp] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseBrowser();

  async function sendOtp() {
    setError("");
    const { error: otpError } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    if (otpError) {
      setError("Unable to send verification code. Try again shortly.");
      return;
    }
    setNotice(`A 6-digit verification code was dispatched to ${email}.`);
    setCooldown(60);
    void fetch("/api/admin/auth/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "OTP_SENT" }),
    });

    const timer = window.setInterval(() => {
      setCooldown((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the complete 6-digit numerical code.");
      setLoading(false);
      return;
    }

    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: otp, type: "email" });
    if (verifyError) {
      setError("That code is invalid or has expired.");
      setLoading(false);
      return;
    }

    setStage("password");
    setNotice("Email verified successfully. Please set your permanent admin password.");
    setLoading(false);
    void fetch("/api/admin/auth/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "OTP_VERIFIED" }),
    });
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword.length < 12) {
      setError("Use at least 12 characters for your security.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match. Please re-enter.");
      setLoading(false);
      return;
    }
    if (!firstLogin && newPassword === currentPassword) {
      setError("New password must differ from the current password.");
      setLoading(false);
      return;
    }

    if (!firstLogin && currentPassword) {
      const { error: currentError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (currentError) {
        setError("Current password is incorrect.");
        setLoading(false);
        return;
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError("Unable to update password. Please try again.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/auth/complete-setup", { method: "POST" });
    if (!response.ok) {
      setError("Password changed, but security setup could not be finalized. Please contact support.");
      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="admin-login-card" onSubmit={stage === "otp" ? verifyOtp : changePassword}>
      <div>
        <p className="admin-eyebrow">{firstLogin ? "FIRST ADMIN SETUP // ONBOARDING" : "SECURITY // CHANGE PASSWORD"}</p>
        <h1>{stage === "otp" ? "Verify email." : "Set password."}</h1>
        <p className="admin-login-copy">
          {stage === "otp"
            ? "Two-factor verification required. Confirm access to your registered admin inbox."
            : "Define a secure 12+ character passkey for system management."}
        </p>
      </div>

      {stage === "otp" ? (
        <>
          <label>
            6-Digit Verification Code
            <input
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "VERIFYING..." : "VERIFY CODE ↗"}
          </button>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={sendOtp}
            disabled={cooldown > 0}
          >
            {cooldown > 0 ? `RESEND CODE IN ${cooldown}s` : "SEND CODE VIA EMAIL ↗"}
          </button>
        </>
      ) : (
        <>
          {!firstLogin && (
            <label>
              Current Password
              <input
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </label>
          )}

          <label>
            New Password (Min 12 Characters)
            <input
              type="password"
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              minLength={12}
              autoComplete="new-password"
            />
          </label>

          <label>
            Confirm New Password
            <input
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={12}
              autoComplete="new-password"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "SAVING..." : "SAVE NEW PASSWORD ↗"}
          </button>
        </>
      )}

      {notice && <p className="admin-form-message">{notice}</p>}
      {error && <p className="admin-form-error" role="alert">{error}</p>}

      <small>SUPABASE AUTH // ENCRYPTED CREDENTIAL MATRIX</small>
    </form>
  );
}
