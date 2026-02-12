"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { universitySchema } from "../../schema";
import { adminDeleteUniversity, adminGetUniversity, adminUpdateUniversity } from "@/lib/api/admin-universities";

export default function UpdateUniversityForm({ universityId }: { universityId: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initial, setInitial] = useState({
    name: "",
    country: "",
    courses: "",
    description: "",
  });
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const res = await adminGetUniversity(universityId);
      if (!res.success || !res.data) {
        setMessage(res.message || "Failed to load university");
        return;
      }
      setInitial({
        name: String(res.data.name || ""),
        country: String(res.data.country || ""),
        courses: Array.isArray(res.data.courses)
          ? (res.data.courses as unknown[]).map((item) => String(item)).join(", ")
          : String(res.data.courses || ""),
        description: String(res.data.description || ""),
      });
    };
    void load();
  }, [universityId]);

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
    const res = await adminUpdateUniversity(universityId, result.data);
    setLoading(false);
    if (!res.success) {
      setMessage(res.message || "Failed to update university");
      return;
    }
    setMessage("University updated successfully.");
  };

  const onDelete = async () => {
    const ok = window.confirm("Delete this university?");
    if (!ok) return;
    const res = await adminDeleteUniversity(universityId);
    if (!res.success) {
      setMessage(res.message || "Failed to delete university");
      return;
    }
    router.push("/admin/universities");
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        Name
        <input name="name" defaultValue={initial.name} className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        Country
        <input name="country" defaultValue={initial.country} className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 sm:col-span-2">
        Courses
        <input name="courses" defaultValue={initial.courses} className="mt-1 h-10 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
      </label>
      <label className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 sm:col-span-2">
        Description
        <textarea name="description" defaultValue={initial.description} rows={3} className="mt-1 w-full rounded-lg border border-sky-100 bg-sky-50/30 px-3 py-2 text-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100" />
      </label>
      <div className="sm:col-span-2 flex gap-2">
        <button type="submit" className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-sky-800">
          {loading ? "Updating..." : "Update University"}
        </button>
        <button type="button" onClick={onDelete} className="rounded-lg bg-rose-700 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-rose-800">
          Delete
        </button>
      </div>
      {message ? <p className="sm:col-span-2 text-sm font-medium text-slate-600">{message}</p> : null}
    </form>
  );
}
