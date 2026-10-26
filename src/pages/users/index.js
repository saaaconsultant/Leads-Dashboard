import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const ROLES = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "COMPLIANCE", label: "Compliance" },
  { value: "TEAM_LEAD", label: "Team Lead" },
  { value: "ADMIN", label: "Administrator" },
];
const EMPTY_FORM = { name: "", email: "", password: "", role: "EMPLOYEE" };

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadUsers() {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Could not load users.");
      setUsers(result.data.users);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === "ADMIN") loadUsers();
    else setLoading(false);
  }, [user?.role]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Could not create user.");
      setUsers((current) =>
        [...current, result.data.user].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      setSuccess(`Created ${result.data.user.name}'s account.`);
      setForm(EMPTY_FORM);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (user?.role !== "ADMIN")
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-6 text-sm text-rose-700">
        Only administrators can manage users.
      </div>
    );

  const inputClass =
    "mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-[#844de9] focus:ring-2 focus:ring-[#844de9]/15";
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">User management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create database accounts and assign their application role.
        </p>
      </header>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {success}
        </div>
      )}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Create user</h2>
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <label className="text-xs font-semibold text-slate-700">
            Full name
            <input
              className={inputClass}
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
              required
            />
          </label>
          <label className="text-xs font-semibold text-slate-700">
            Email address
            <input
              className={inputClass}
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              required
            />
          </label>
          <label className="text-xs font-semibold text-slate-700">
            Temporary password
            <input
              className={inputClass}
              type="password"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <label className="text-xs font-semibold text-slate-700">
            Role
            <select
              className={inputClass}
              name="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-2">
            <button
              disabled={submitting}
              className="rounded-lg bg-[#844de9] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7337df] disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </div>
        </form>
      </section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Existing users</h2>
        </div>
        {loading ? (
          <p className="p-5 text-sm text-slate-500">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No active users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {entry.name}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{entry.email}</td>
                    <td className="px-5 py-3 text-slate-600">
                      {ROLES.find((role) => role.value === entry.role)?.label ??
                        entry.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
