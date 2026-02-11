import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { getUserData } from "@/lib/api/cookie";

export default async function AdminProfilePage() {
  await requireAdmin();
  const userData = await getUserData<Record<string, unknown>>();
  const payload =
    userData && typeof userData === "object" && "user" in userData
      ? (userData.user as Record<string, unknown> | null)
      : userData;

  const fullName = typeof payload?.fullName === "string" ? payload.fullName : "Admin";
  const email = typeof payload?.email === "string" ? payload.email : "admin@gmail.com";
  const role = typeof payload?.role === "string" ? payload.role : "admin";

  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Profile</p>
      <h2 className="text-2xl font-bold text-[#1a2b44]">Admin Profile</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[#e6eef9] p-3">
          <p className="text-xs uppercase tracking-[0.08em] text-[#5f7590]">Name</p>
          <p className="text-sm font-semibold text-[#1a2b44]">{fullName}</p>
        </div>
        <div className="rounded-lg border border-[#e6eef9] p-3">
          <p className="text-xs uppercase tracking-[0.08em] text-[#5f7590]">Email</p>
          <p className="text-sm font-semibold text-[#1a2b44]">{email}</p>
        </div>
        <div className="rounded-lg border border-[#e6eef9] p-3 sm:col-span-2">
          <p className="text-xs uppercase tracking-[0.08em] text-[#5f7590]">Role</p>
          <p className="text-sm font-semibold text-[#1a2b44]">{role}</p>
        </div>
      </div>

      <form
        action={async () => {
          "use server";
          const { clearAuthCookies } = await import("@/lib/api/cookie");
          await clearAuthCookies();
          redirect("/admin/login");
        }}
      >
        <button type="submit" className="rounded-lg bg-[#1a2b44] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white">
          Logout
        </button>
      </form>
    </div>
  );
}

