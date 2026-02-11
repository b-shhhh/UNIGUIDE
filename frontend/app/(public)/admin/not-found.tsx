import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <h2 className="text-xl font-bold text-slate-900">User not found</h2>
      <p className="mt-2 text-sm text-slate-500">The requested admin resource does not exist.</p>
      <Link
        href="/admin"
        className="mt-4 inline-block rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
      >
        Back to admin
      </Link>
    </div>
  );
}
