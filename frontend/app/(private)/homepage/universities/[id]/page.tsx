"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUniversity } from "@/lib/api/universities";
import SaveUniversityButton from "../../../_component/SaveUniversityButton";

type University = {
  id: string;
  dbId?: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  flag_url?: string;
  logo_url?: string;
  courses?: string[];
  description?: string;
  ieltsMin?: number | null;
  satRequired?: boolean;
  satMin?: number | null;
  web_pages?: string;
};

export default function UniversityDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id || "");
  const [uni, setUni] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const flag = uni?.flag_url;

  useEffect(() => {
    const load = async () => {
      const res = await getUniversity(id);
      const data = (res.data as University) || null;
      setUni(data && String(data.name || "").trim() ? data : null);
      setLoading(false);
    };
    if (id) void load();
  }, [id]);

  if (loading) return <p className="p-6 text-sm text-slate-600">Loading university…</p>;
  if (!uni) return <p className="p-6 text-sm text-rose-600">University not found.</p>;

  return (
    <div className="mx-auto max-w-4xl pt-6 pb-10">
      <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            {uni.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={uni.logo_url}
                alt={`${uni.name} logo`}
                className="h-14 w-14 rounded-2xl object-contain ring-1 ring-slate-100"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-lg font-bold text-slate-700">
                {uni.name?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">University</p>
              <h1 className="text-3xl font-black text-slate-900">{uni.name}</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              {[uni.city, uni.state].filter(Boolean).join(", ")}
              {uni.country ? (
                <Link href={`/homepage/countries/${encodeURIComponent(uni.country)}`} className="font-semibold text-sky-700 hover:text-sky-900">
                  {uni.country}
                </Link>
              ) : null}
              {flag ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={flag} alt={`${uni.country} flag`} className="h-4 w-6 rounded object-cover ring-1 ring-slate-100" />
              ) : null}
            </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(uni.courses || []).map((course: string) => (
                  <Link
                    key={course}
                    href={`/homepage/courses/${encodeURIComponent(course)}`}
                    className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                  >
                    {course}
                  </Link>
                ))}
              </div>
            </div>
            <SaveUniversityButton universityId={uni.id} universityDbId={uni.dbId} />
          </div>

          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">IELTS Min</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{uni.ieltsMin ?? "—"}</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">SAT Required</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{uni.satRequired ? "Yes" : "No"}</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">SAT Min</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{uni.satMin ?? "—"}</p>
              </div>
            </div>
          </div>

          {uni.web_pages ? (
            <div className="mt-2 flex justify-center">
              <a
                href={uni.web_pages}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-sky-700 hover:text-sky-900"
              >
                Visit official website →
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
