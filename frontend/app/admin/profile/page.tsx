import { getUserData } from "@/lib/api/cookie";

type AdminProfile = {
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
  bio?: string;
  role?: string;
  profilePic?: string;
};

export default async function AdminProfilePage() {
  const profile = (await getUserData<AdminProfile>()) || {};

  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Admin</p>
        <h2 className="text-2xl font-bold text-[#1a2b44]">Profile</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-[#e6eef9] bg-[#f9fbff] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Name</p>
          <p className="mt-1 text-sm font-semibold text-[#1a2b44]">{profile.fullName || "-"}</p>
        </article>
        <article className="rounded-lg border border-[#e6eef9] bg-[#f9fbff] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Email</p>
          <p className="mt-1 text-sm font-semibold text-[#1a2b44]">{profile.email || "-"}</p>
        </article>
        <article className="rounded-lg border border-[#e6eef9] bg-[#f9fbff] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Phone</p>
          <p className="mt-1 text-sm font-semibold text-[#1a2b44]">{profile.phone || "-"}</p>
        </article>
        <article className="rounded-lg border border-[#e6eef9] bg-[#f9fbff] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Role</p>
          <p className="mt-1 text-sm font-semibold text-[#1a2b44]">{profile.role || "-"}</p>
        </article>
      </div>

      <article className="rounded-lg border border-[#e6eef9] bg-[#f9fbff] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Country</p>
        <p className="mt-1 text-sm font-semibold text-[#1a2b44]">{profile.country || "-"}</p>
      </article>

      <article className="rounded-lg border border-[#e6eef9] bg-[#f9fbff] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Bio</p>
        <p className="mt-1 text-sm text-[#1a2b44]">{profile.bio || "-"}</p>
      </article>
    </div>
  );
}
