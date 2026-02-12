export default function Footer() {
  return (
    <footer className="border-t border-sky-200/70 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 text-xs text-slate-600 sm:px-6">
        <p>&copy; {new Date().getFullYear()} UniGuide. Privacy and trust first.</p>
      </div>
    </footer>
  );
}
