import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <h2 className="text-lg font-bold text-[#1a2b44]">Admin page not found</h2>
      <p className="text-sm text-[#5f7590]">The requested admin resource does not exist.</p>
      <Link href="/admin" className="text-sm font-semibold text-[#4A90E2]">
        Back to admin dashboard
      </Link>
    </div>
  );
}
