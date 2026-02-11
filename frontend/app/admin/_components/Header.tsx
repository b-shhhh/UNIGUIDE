import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-[#d8e5f8] bg-white/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Admin Panel</p>
          <h1 className="text-xl font-bold text-[#1a2b44]">UniGuide Admin</h1>
        </div>
        <Link
          href="/admin/profile"
          className="rounded-lg border border-[#d8e5f8] bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44]"
        >
          Profile
        </Link>
      </div>
    </header>
  );
}
