import { requireAdmin } from "../../../src/lib/admin-auth";
import { ChangePasswordForm } from "../../../src/components/admin/ChangePasswordForm";

export default async function ChangePasswordPage() {
  const session = await requireAdmin({ allowPasswordSetup: true });
  return <main className="admin-login-page"><div className="admin-login-mark">BEXYEE<span>/</span>OPS</div><ChangePasswordForm email={session.user.email ?? ""} firstLogin={session.admin.must_change_password} /></main>;
}
