export default function Footer() {
  return (
    <footer className="border-t border-[#4A90E2]/20 bg-[#333333]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-white sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} UniGuide. All rights reserved.</p>
        <p className="uppercase tracking-[0.1em] text-[#F5A623]">Your future, clearly mapped</p>
      </div>
    </footer>
  );
}
