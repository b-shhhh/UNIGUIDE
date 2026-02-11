import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-[8px] border border-[#d8e5f8] bg-white p-8 text-center shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
      <h2 className="text-xl font-bold text-[#333333]">User not found</h2>
      <p className="mt-2 text-sm text-[#666666]">The requested admin resource does not exist.</p>
      <Link
        href="/admin"
        className="mt-4 inline-block rounded-[8px] bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-[#357ABD]"
      >
        Back to admin
      </Link>
    </div>
  );
}
