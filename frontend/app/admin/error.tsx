"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="space-y-3 rounded-xl border border-[#ffd2d2] bg-white p-5">
      <h2 className="text-lg font-bold text-[#b91c1c]">Admin page error</h2>
      <p className="text-sm text-[#5f7590]">Something went wrong while loading admin content.</p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
      >
        Try again
      </button>
    </div>
  );
}
