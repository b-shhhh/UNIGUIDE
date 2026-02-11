"use client";

import { useEffect } from "react";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
      <h2 className="text-2xl font-semibold text-[#333333]">Something went wrong</h2>
      <p className="text-sm text-[#666666]">We could not load the admin page right now.</p>
      <button
        onClick={reset}
        className="rounded-[8px] bg-[#4A90E2] px-4 py-2 text-sm font-medium text-white hover:bg-[#357ABD]"
      >
        Try again
      </button>
    </div>
  );
}
