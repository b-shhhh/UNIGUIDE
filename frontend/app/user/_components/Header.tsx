export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#4A90E2]/20 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#4A90E2] text-sm font-bold text-white">
            UG
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#666666]">User</p>
            <h1 className="text-base font-bold text-[#333333] sm:text-lg">Profile Center</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
