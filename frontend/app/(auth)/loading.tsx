"use client"; // Required for any client-side component

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg font-medium animate-pulse">Loading...</p>
    </div>
  );
}
