export default function Footer() {
  return (
    <footer className="border-t border-[#4A90E2]/20 bg-[#333333]">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 text-xs text-white sm:px-6">
        <p>&copy; {new Date().getFullYear()} UniGuide. Privacy and trust first.</p>
      </div>
    </footer>
  );
}
