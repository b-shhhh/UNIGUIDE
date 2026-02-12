import { getUserData } from "@/lib/api/cookie";
import { handleAdminLogout } from "@/lib/actions/auth-action";

type AdminProfile = {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  profilePic?: string;
};

export default async function AdminProfilePage() {
  const profile = (await getUserData<AdminProfile>()) || {};

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-900 p-6 text-white shadow-[0_14px_36px_rgba(3,105,161,0.25)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-8 h-48 w-48 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-sky-100">Admin Profile</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Your administrator details</h2>
          <p className="mt-2 text-sm text-sky-100">View your account information and role context in the platform.</p>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Admin</p>
          <h3 className="text-2xl font-black tracking-tight text-slate-900">Profile</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Name</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{profile.fullName || "-"}</p>
          </article>
          <article className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Email</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{profile.email || "-"}</p>
          </article>
          <article className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Phone</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{profile.phone || "-"}</p>
          </article>
          <article className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Role</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{profile.role || "-"}</p>
          </article>
        </div>

        <div className="rounded-xl border border-amber-200 bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">Session</p>
          <form action={handleAdminLogout} className="mt-2">
            <button
              type="submit"
              className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-rose-800"
            >
              Logout
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
