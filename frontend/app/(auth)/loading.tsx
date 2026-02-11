"use client"; // Required for any client-side component

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#e9f2ff_0%,#ffffff_50%,#edf6ff_100%)]">
      <div className="rounded-[16px] border border-[#dbe8fb] bg-white px-10 py-8 text-center shadow-[0_14px_34px_rgba(74,144,226,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#4A90E2]">Please Wait</p>
        <p className="mt-2 text-lg font-bold text-[#333333] animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
