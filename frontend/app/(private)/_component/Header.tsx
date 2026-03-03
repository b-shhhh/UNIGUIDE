import Link from "next/link";
import { AcademicCapIcon } from "@heroicons/react/24/solid";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#4A90E2]/20 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-gradient-to-r from-[#0E6F86] to-[#1F6F8B] text-sm font-bold text-white shadow-sm">
            <AcademicCapIcon className="h-6 w-6" aria-hidden />
          </div>
          <h1 className="text-base font-bold uppercase tracking-[0.12em] text-[#333333] sm:text-lg">
            UNIGUIDE
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          
          <Link
            href="/homepage/saved-universities"
            className="rounded-[8px] bg-gradient-to-r from-[#0E6F86] to-[#1F6F8B] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-sm hover:brightness-110 sm:text-sm"
          >
            Saved Unis
          </Link>
          <Link
            href="/user/profile"
            className="rounded-[8px] bg-gradient-to-r from-[#0E6F86] to-[#1F6F8B] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-sm hover:brightness-110 sm:text-sm"
          >
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
