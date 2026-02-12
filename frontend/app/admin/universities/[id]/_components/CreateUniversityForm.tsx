"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { universitySchema } from "../../schema";
import { adminCreateUniversity } from "@/lib/api/admin-universities";

export default function CreateUniversityForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    setLoading(true);
    const res = await adminCreateUniversity(result.data);
    setLoading(false);
    if (!res.success) {
      setMessage(res.message || "Failed to create university");
      return;
    }

    setMessage("University created successfully.");
    event.currentTarget.reset();
    router.push("/admin/universities");
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        Name
        <input name="name" required className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        Country
        <input name="country" required className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 sm:col-span-2">
        Courses
        <input name="courses" className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 sm:col-span-2">
        Description
        <textarea name="description" rows={3} className="mt-1 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800">
          {loading ? "Creating..." : "Create University"}
        </button>
      </div>
      {message ? <p className="sm:col-span-2 text-sm font-medium text-slate-600">{message}</p> : null}
    </form>
  );
}
