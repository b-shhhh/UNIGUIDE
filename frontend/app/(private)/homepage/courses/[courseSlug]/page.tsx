import Link from "next/link";
import { notFound } from "next/navigation";
import { getUniversitiesByCourse } from "@/lib/csv-universities";

type Props = {
  params: Promise<{ courseSlug: string }>;
};

export default async function CourseDetailPage({ params }: Props) {
  const { courseSlug } = await params;
  const universities = await getUniversitiesByCourse(courseSlug);

  if (!universities.length) {
    notFound();
  }

  const courseName = universities[0].course;
  const availableCountries = Array.from(
    new Map(universities.map((item) => [item.countryCode, { code: item.countryCode, name: item.countryName, flag: item.flag }])).values(),
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Course</p>
        <h2 className="mt-2 text-2xl font-bold text-[#1a2b44]">{courseName}</h2>
        <p className="mt-1 text-sm text-[#5f7590]">{universities.length} universities available for this course</p>
        <Link href="/homepage" className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.08em] text-[#4A90E2]">
          Back to dashboard
        </Link>
      </section>

      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <h3 className="text-lg font-bold text-[#1a2b44]">Countries Available</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {availableCountries.map((country) => (
            <Link
              key={country.code}
              href={`/homepage/countries/${country.code}`}
              className="rounded-full bg-[#e9f2ff] px-3 py-1 text-xs font-semibold text-[#1d4ed8]"
            >
              {country.flag} {country.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {universities.map((uni) => (
          <article key={uni.id} className="rounded-xl border border-[#d8e5f8] bg-white p-4">
            <p className="text-base font-bold text-[#1a2b44]">{uni.name}</p>
            <p className="mt-1 text-xs text-[#5f7590]">
              {uni.flag} {uni.countryName}
            </p>
            <Link
              href={`/homepage/universities/${uni.id}`}
              className="mt-3 inline-block rounded-lg bg-[#4A90E2] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
            >
              View Detail
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}

