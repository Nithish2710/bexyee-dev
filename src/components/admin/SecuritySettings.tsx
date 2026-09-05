"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "../../lib/supabase-browser";

type SecurityEvent = {
  id: string;
  event_type: string;
  email: string | null;
  created_at: string;
};

const EVENT_LABELS: Record<string, { label: string; badge: string }> = {
  PASSWORD_CHANGED: { label: "Password successfully updated", badge: "AUTH" },
  EMAIL_CHANGE_REQUESTED: { label: "Email change requested & confirmation sent", badge: "ACCOUNT" },
  FIRST_LOGIN: { label: "Initial administrator setup completed", badge: "SETUP" },
  OTP_SENT: { label: "One-Time Password challenge issued", badge: "2FA" },
  OTP_VERIFIED: { label: "One-Time Password challenge passed", badge: "2FA" },
  PASSWORD_RESET_REQUESTED: { label: "Password reset link requested", badge: "RESET" },
  LOGOUT: { label: "Administrator signed out of session", badge: "SESSION" },
  SESSION_REVOKED: { label: "Other browser sessions revoked", badge: "SESSION" },
};

export function SecuritySettings({ email }: { email: string }) {
  // Email change form state
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  // Sessions state
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);
  const [sessionMessage, setSessionMessage] = useState("");
  const [sessionError, setSessionError] = useState("");

  // Activity audit state
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  async function loadSecurityEvents() {
    try {
      setLoadingEvents(true);
      const res = await fetch("/api/admin/auth/audit");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoadingEvents(false);
    }
  }

  useEffect(() => {
    loadSecurityEvents();
  }, []);

  async function handleEmailChange(event: FormEvent) {
    event.preventDefault();
    setEmailError("");
    setEmailMessage("");

    if (!newEmail || !newEmail.includes("@")) {
      setEmailError("Please enter a valid new email address.");
      return;
    }

    if (newEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
      setEmailError("New email address must be different from your current email.");
      return;
    }

    if (!currentPassword) {
      setEmailError("Your current password is required to verify this change.");
      return;
    }

    try {
      setIsSubmittingEmail(true);
      const auth = getSupabaseBrowser();

      // Step 1: Re-authenticate with current credentials to confirm ownership
      const { error: verifyError } = await auth.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (verifyError) {
        setEmailError("Current password verification failed. Please check your password.");
        return;
      }

      // Step 2: Request email update through Supabase Auth
      const { error: updateError } = await auth.auth.updateUser({ email: newEmail.trim() });
      if (updateError) {
        setEmailError(updateError.message || "Unable to request email change at this time.");
        return;
      }

      setEmailMessage(
        `Confirmation emails have been sent to ${email} and ${newEmail}. Please confirm both links to complete the update.`
      );
      setNewEmail("");
      setCurrentPassword("");

      // Step 3: Record audit trail
      void fetch("/api/admin/auth/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "EMAIL_CHANGE_REQUESTED", email: newEmail.trim() }),
      });

      // Reload audit activity after logging
      setTimeout(loadSecurityEvents, 1000);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsSubmittingEmail(false);
    }
  }

  async function handleSignOutOtherSessions() {
    setSessionError("");
    setSessionMessage("");
    try {
      setIsRevokingSessions(true);
      const auth = getSupabaseBrowser();
      const { error } = await auth.auth.signOut({ scope: "others" });

      if (error) {
        // If scope: 'others' is not supported by current Supabase tier, inform cleanly
        setSessionError(error.message || "Could not sign out other sessions automatically.");
        return;
      }

      setSessionMessage("All other active browser sessions have been signed out.");

      void fetch("/api/admin/auth/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "SESSION_REVOKED" }),
      });

      setTimeout(loadSecurityEvents, 1000);
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : "Unable to revoke sessions.");
    } finally {
      setIsRevokingSessions(false);
    }
  }

  return (
    <div className="admin-security-container">
      {/* 2-Column Responsive Card Grid */}
      <div className="admin-security-grid">
        {/* CARD 1: ACCOUNT */}
        <div className="security-card">
          <div className="security-card-header">
            <div>
              <span className="security-card-eyebrow">CREDENTIAL MANAGEMENT</span>
              <h2 className="security-card-title">ACCOUNT</h2>
            </div>
            <span className="security-badge-active">PRIMARY OWNER</span>
          </div>

          <div className="security-field-group">
            <span className="security-field-label">Current administrative email</span>
            <strong className="security-field-value">{email || "admin@bexyee.com"}</strong>
            <p className="security-field-desc">
              Supabase Auth manages this credential. All transaction receipts, OTPs, and system alerts are routed here.
            </p>
          </div>

          <div className="security-card-actions">
            <button
              type="button"
              onClick={() => setIsEmailFormVisible((prev) => !prev)}
              className="admin-btn-secondary"
            >
              {isEmailFormVisible ? "CLOSE EMAIL FORM" : "CHANGE EMAIL ↗"}
            </button>
          </div>
        </div>

        {/* CARD 2: CHANGE EMAIL (Inline or Toggled) */}
        <div className={`security-card ${isEmailFormVisible ? "highlighted" : ""}`}>
          <div className="security-card-header">
            <div>
              <span className="security-card-eyebrow">CREDENTIAL UPDATE</span>
              <h2 className="security-card-title">CHANGE EMAIL</h2>
            </div>
          </div>

          <p className="security-field-desc" style={{ marginBottom: "16px" }}>
            Submit a new email address. For security, both your current and new inboxes must confirm the request.
          </p>

          <form onSubmit={handleEmailChange} className="security-form">
            <div className="security-form-group">
              <label htmlFor="new-admin-email" className="security-input-label">
                New Email Address
              </label>
              <input
                id="new-admin-email"
                type="email"
                placeholder="newowner@bexyee.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isSubmittingEmail}
                required
                className="security-input"
              />
            </div>

            <div className="security-form-group">
              <label htmlFor="current-admin-password" className="security-input-label">
                Current Password (Verification)
              </label>
              <input
                id="current-admin-password"
                type="password"
                placeholder="••••••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isSubmittingEmail}
                required
                className="security-input"
              />
            </div>

            {/* Error & Success Feedback States */}
            {emailError && (
              <div role="alert" className="security-feedback-box error">
                ✕ {emailError}
              </div>
            )}

            {emailMessage && (
              <div role="status" className="security-feedback-box success">
                ✓ {emailMessage}
              </div>
            )}

            <div className="security-card-actions" style={{ marginTop: "16px" }}>
              <button
                type="submit"
                disabled={isSubmittingEmail}
                className="admin-btn-primary"
              >
                {isSubmittingEmail ? "REQUESTING CHANGE..." : "REQUEST EMAIL CHANGE ↗"}
              </button>
            </div>
          </form>
        </div>

        {/* CARD 3: PASSWORD */}
        <div className="security-card">
          <div className="security-card-header">
            <div>
              <span className="security-card-eyebrow">AUTHENTICATION ACCESS</span>
              <h2 className="security-card-title">PASSWORD</h2>
            </div>
            <span className="security-badge-neutral">ENCRYPTED</span>
          </div>

          <div className="security-field-group">
            <span className="security-field-label">Password security &amp; rotation</span>
            <strong className="security-field-value">Rotate your password</strong>
            <p className="security-field-desc">
              BEXYEE uses native Supabase Auth flow with Argon2/bcrypt one-way hashing and secure email verification links.
            </p>
          </div>

          <div className="security-card-actions">
            <Link href="/admin/change-password" className="admin-btn-primary" style={{ textAlign: "center", textDecoration: "none" }}>
              CHANGE PASSWORD ↗
            </Link>
          </div>
        </div>

        {/* CARD 4: SESSIONS */}
        <div className="security-card">
          <div className="security-card-header">
            <div>
              <span className="security-card-eyebrow">SESSION MANAGEMENT</span>
              <h2 className="security-card-title">SESSIONS</h2>
            </div>
            <div className="session-active-indicator">
              <span className="status-dot" style={{ background: "#22c55e" }} />
              <span>ACTIVE</span>
            </div>
          </div>

          <div className="security-field-group">
            <span className="security-field-label">Current administrative session</span>
            <strong className="security-field-value">Authenticated Web Console</strong>
            <p className="security-field-desc">
              Changing your password automatically invalidates legacy sessions across secondary browsers.
            </p>
          </div>

          {sessionError && (
            <div role="alert" className="security-feedback-box error">
              ✕ {sessionError}
            </div>
          )}

          {sessionMessage && (
            <div role="status" className="security-feedback-box success">
              ✓ {sessionMessage}
            </div>
          )}

          <div className="security-card-actions">
            <button
              type="button"
              onClick={handleSignOutOtherSessions}
              disabled={isRevokingSessions}
              className="admin-btn-secondary"
            >
              {isRevokingSessions ? "REVOKING SESSIONS..." : "SIGN OUT OTHER SESSIONS"}
            </button>
          </div>
        </div>
      </div>

      {/* CARD 5: SECURITY ACTIVITY AUDIT TRAIL */}
      <div className="security-card security-activity-card" style={{ marginTop: "24px" }}>
        <div className="security-card-header">
          <div>
            <span className="security-card-eyebrow">SYSTEM AUDIT TRAIL</span>
            <h2 className="security-card-title">SECURITY ACTIVITY</h2>
          </div>
          <button
            type="button"
            onClick={loadSecurityEvents}
            className="admin-btn-secondary"
            style={{ padding: "6px 12px", fontSize: "10px" }}
          >
            ↻ REFRESH AUDIT
          </button>
        </div>

        <p className="security-field-desc" style={{ marginBottom: "16px" }}>
          Immutable log of administrative security events, login verifications, and credential changes.
        </p>

        {loadingEvents ? (
          <div className="security-empty-box">
            LOADING SECURITY AUDIT LOG...
          </div>
        ) : events.length > 0 ? (
          <div className="security-table-wrapper">
            <table className="security-activity-table">
              <thead>
                <tr>
                  <th>EVENT TYPE</th>
                  <th>DESCRIPTION</th>
                  <th>ACCOUNT / TARGET</th>
                  <th>TIMESTAMP (UTC)</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => {
                  const meta = EVENT_LABELS[evt.event_type] || {
                    label: evt.event_type.replace(/_/g, " "),
                    badge: "EVENT",
                  };
                  return (
                    <tr key={evt.id}>
                      <td>
                        <span className="security-event-badge">{meta.badge}</span>
                      </td>
                      <td className="security-event-label">{meta.label}</td>
                      <td className="security-event-target">{evt.email || email || "System"}</td>
                      <td className="security-event-time">
                        {new Date(evt.created_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="security-empty-box">
            NO SECURITY ACTIVITY YET
          </div>
        )}
      </div>
    </div>
  );
}
