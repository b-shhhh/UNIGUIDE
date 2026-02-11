export default function Footer() {
  return (
    <footer className="border-t border-[#1a2b44]/10 bg-[#efe8d7]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-4 py-4 text-xs text-[#415976] sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} UniGuide. All rights reserved.</p>
        <p className="uppercase tracking-[0.1em]">Build your future with confidence</p>
      </div>
    </footer>
  );
}
