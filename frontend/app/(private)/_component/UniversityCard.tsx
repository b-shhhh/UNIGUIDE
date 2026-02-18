"use client";

import Link from "next/link";
import SaveUniversityButton from "./SaveUniversityButton";

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
};

type Props = {
  university: University;
};

export default function UniversityCard({ university }: Props) {
  const { id, dbId, name, country, state, city, courses = [], flag_url, logo_url } = university;
  const location = [city, state, country].filter(Boolean).join(", ");

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        {logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo_url} alt={`${name} logo`} className="h-10 w-10 rounded-full object-contain ring-1 ring-slate-100" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
            {name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{location || country}</p>
        </div>
        {flag_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={flag_url} alt={`${country} flag`} className="ml-auto h-6 w-6 rounded-full object-cover ring-1 ring-slate-100" />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="line-clamp-2 text-xs text-slate-600">{university.description || "Leading programs and diverse campus life."}</p>
        <div className="flex flex-wrap gap-2">
          {courses.slice(0, 3).map((course) => (
            <span key={course} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              {course}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Link
            href={`/homepage/universities/${encodeURIComponent(id)}`}
            className="text-sm font-semibold text-sky-700 transition hover:text-sky-900"
          >
            View details →
          </Link>
          <SaveUniversityButton universityId={id} universityDbId={dbId} />
        </div>
      </div>
    </div>
  );
}
