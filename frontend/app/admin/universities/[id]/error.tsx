"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="space-y-3 rounded-2xl border border-rose-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
      <h2 className="text-lg font-bold text-rose-700">University page error</h2>
      <p className="text-sm text-slate-500">Something went wrong while loading this university page.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800"
      >
        Try again
      </button>
    </div>
  );
}
