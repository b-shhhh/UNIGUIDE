"use client"; // <-- MUST be the first line

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthError() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login"); // redirect after 2 seconds
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#ffe9e9_0%,#ffffff_60%,#fff3e4_100%)] px-4">
      <div className="max-w-md rounded-[16px] border border-red-200 bg-white p-8 text-center shadow-[0_14px_34px_rgba(245,166,35,0.22)]">
        <h1 className="text-2xl font-bold text-[#333333]">Authentication Error</h1>
        <p className="mt-3 text-sm text-[#666666]">
          You are not logged in. Redirecting to login page...
        </p>
      </div>
    </div>
  );
}
