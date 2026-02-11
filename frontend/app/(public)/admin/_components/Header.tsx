import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#4A90E2]/20 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#666666]">UniGuide</p>
          <h1 className="text-lg font-bold text-[#333333]">Admin Panel</h1>
        </div>
        <Link
          href="/admin/users/create"
          className="rounded-[8px] bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#357ABD]"
        >
          Create User
        </Link>
      </div>
    </header>
  );
}
