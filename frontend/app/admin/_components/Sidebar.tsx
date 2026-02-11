import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="h-fit rounded-xl border border-[#d8e5f8] bg-white p-3">
      <nav className="space-y-2">
        <Link
          href="/admin/users"
          className="block rounded-lg border border-[#d8e5f8] px-3 py-2 text-sm font-semibold text-[#1a2b44] hover:bg-[#f5f9ff]"
        >
          Users
        </Link>
        <Link
          href="/admin/universities"
          className="block rounded-lg bg-[#4A90E2] px-3 py-2 text-sm font-semibold text-white"
        >
          Universities
        </Link>
      </nav>
    </aside>
  );
}
