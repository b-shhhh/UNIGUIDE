export default function Footer() {
  return (
    <footer className="border-t border-sky-200/70 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} UniGuide. All rights reserved.</p>
        <p className="uppercase tracking-[0.1em] text-sky-700">Your future, clearly mapped</p>
      </div>
    </footer>
  );
}
