import Link from "next/link";
import { requireAdmin } from "../../../../src/lib/admin-auth";
import { SecuritySettings } from "../../../../src/components/admin/SecuritySettings";

export default async function SecuritySettingsPage() {
  const session = await requireAdmin();

  return (
    <main className="admin-security-page-shell">
      {/* Top Header with Breadcrumbs and Back Navigation */}
      <header className="admin-security-topbar">
        <div className="admin-security-topbar-inner">
          <div className="admin-security-header-left">
            <p className="admin-eyebrow">BEXYEE / SETTINGS / SECURITY</p>
            <h1 className="admin-security-main-title">Security.</h1>
            <p className="admin-security-sub-lead">
              Manage your BEXYEE account security and active sessions.
            </p>
          </div>

          <div className="admin-security-header-right">
            <Link href="/admin" className="admin-btn-secondary" style={{ textDecoration: "none" }}>
              ← BACK TO OPERATIONS
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="admin-security-body-container">
        <SecuritySettings email={session.user.email ?? ""} />
      </div>
    </main>
  );
}
