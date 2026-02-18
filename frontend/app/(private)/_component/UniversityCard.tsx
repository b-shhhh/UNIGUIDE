"use client";

import Link from "next/link";
import SaveUniversityButton from "./SaveUniversityButton";

type University = {
  id: string;
  dbId?: string;
  alpha2?: string;
  name: string;
  country: string;
  state?: string;
  city?: string;
  flag_url?: string;
  logo_url?: string;
  courses?: string[];
  description?: string;
  web_pages?: string;
};

type Props = {
  university: University;
};

const countryToFlag = (alpha2?: string) => (alpha2 ? `https://flagcdn.com/${alpha2.toLowerCase()}.svg` : undefined);

export default function UniversityCard({ university }: Props) {
  const { id, dbId, name, country, state, city, courses = [], flag_url, logo_url, alpha2, web_pages } = university;
  const location = [city, state, country].filter(Boolean).join(", ");
  const flag = flag_url?.trim() || countryToFlag(alpha2);

  const cleanedLogo = logo_url && logo_url.trim() ? logo_url.trim() : undefined;
  let derivedLogo: string | undefined;
  if (!cleanedLogo && web_pages && web_pages.startsWith("http")) {
    try {
      const host = new URL(web_pages).hostname;
      derivedLogo = host ? `https://logo.clearbit.com/${host}` : undefined;
    } catch {
      derivedLogo = undefined;
    }
  }
  const logoFallback =
    name && name.trim()
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0EA5E9&color=ffffff&bold=true`
      : "";
  const logo = cleanedLogo || derivedLogo || logoFallback;
  const initials = name ? name.slice(0, 2).toUpperCase() : "UN";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={`${name} logo`}
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-100"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-xs font-bold uppercase text-sky-700 ring-1 ring-slate-100">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{location || country}</p>
        </div>
        {flag ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={flag}
            alt={`${country} flag`}
            referrerPolicy="no-referrer"
            className="ml-auto h-6 w-6 rounded-full object-cover ring-1 ring-slate-100"
          />
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
