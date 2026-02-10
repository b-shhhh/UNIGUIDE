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
    <div className="flex min-h-screen items-center justify-center bg-red-50">
      <div className="rounded-xl bg-white p-8 shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-4 text-gray-700">
          You are not logged in. Redirecting to login page...
        </p>
      </div>
    </div>
  );
}
