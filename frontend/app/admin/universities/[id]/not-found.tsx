import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <h2 className="text-lg font-bold text-slate-900">University not found</h2>
      <p className="text-sm text-slate-500">The university you requested does not exist.</p>
      <Link href="/admin/universities" className="text-sm font-semibold text-sky-700 hover:text-sky-900">
        Back to universities
      </Link>
    </div>
  );
}
