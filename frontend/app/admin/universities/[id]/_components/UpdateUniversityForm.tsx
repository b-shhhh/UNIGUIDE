"use client";

import { useState } from "react";
import { universitySchema } from "../../schema";

export default function UpdateUniversityForm({ universityId }: { universityId: string }) {
  const [message, setMessage] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      country: String(formData.get("country") || ""),
      courses: String(formData.get("courses") || ""),
      description: String(formData.get("description") || ""),
    };

    const result = universitySchema.safeParse(payload);
    if (!result.success) {
      setMessage(result.error.issues[0]?.message || "Validation error");
      return;
    }

    setMessage(`University ${universityId} updated (wire this to backend PUT endpoint).`);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">
        Name
        <input name="name" className="mt-1 h-10 w-full rounded-lg border border-[#c7d9f5] px-3 text-sm" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">
        Country
        <input name="country" className="mt-1 h-10 w-full rounded-lg border border-[#c7d9f5] px-3 text-sm" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590] sm:col-span-2">
        Courses
        <input name="courses" className="mt-1 h-10 w-full rounded-lg border border-[#c7d9f5] px-3 text-sm" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590] sm:col-span-2">
        Description
        <textarea name="description" rows={3} className="mt-1 w-full rounded-lg border border-[#c7d9f5] px-3 py-2 text-sm" />
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white">
          Update University
        </button>
      </div>
      {message ? <p className="sm:col-span-2 text-sm text-[#5f7590]">{message}</p> : null}
    </form>
  );
}

