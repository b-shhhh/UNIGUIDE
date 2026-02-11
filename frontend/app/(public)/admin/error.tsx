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
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 text-center px-4">
      <h2 className="text-2xl font-semibold text-slate-800">Something went wrong</h2>
      <p className="text-sm text-slate-500">We could not load the admin page right now.</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
      >
        Try again
      </button>
    </div>
  );
}
