export default function Header() {
  return (
    <header className="border-b border-sky-200/70 bg-white/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-sky-700">Admin Panel</p>
          <div className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-800">
            <svg viewBox="0 0 64 64" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 24L32 12L60 24L32 36L4 24Z" fill="currentColor" />
              <path d="M16 31V40C16 45 23 50 32 50C41 50 48 45 48 40V31" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M52 29V44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
