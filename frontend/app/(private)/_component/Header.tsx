import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#1a2b44]/10 bg-[#f4efe4]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a2b44] text-sm font-bold text-white">
            UG
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#486287]">Dashboard</p>
            <h1 className="text-base font-bold text-[#1a2b44] sm:text-lg">UniGuide</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/homepage/saved-universities"
            className="rounded-lg border border-[#1a2b44]/20 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44] hover:bg-[#f8fbff] sm:text-sm"
          >
            Saved Unis
          </Link>
          <Link
            href="/user/profile"
            className="rounded-lg bg-[#1a2b44] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#132038] sm:text-sm"
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
