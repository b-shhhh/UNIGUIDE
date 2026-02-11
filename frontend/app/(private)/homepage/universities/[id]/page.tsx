import Link from "next/link";
import { notFound } from "next/navigation";
import { getUniversityById } from "@/lib/csv-universities";
import SaveUniversityButton from "@/app/(private)/_component/SaveUniversityButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UniversityDetailPage({ params }: Props) {
  const { id } = await params;
  const university = await getUniversityById(id);

  if (!university) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">University Detail</p>
        {university.logoUrl ? (
          <img src={university.logoUrl} alt={`${university.name} logo`} width={42} height={42} className="mt-3 rounded" />
        ) : null}
        <h2 className="mt-2 text-2xl font-bold text-[#1a2b44]">{university.name}</h2>
        <p className="mt-1 text-sm text-[#5f7590]">
          {university.flag} {university.countryName}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/homepage/countries/${university.countryCode}`}
            className="rounded-lg border border-[#c7d9f5] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#4A90E2]"
          >
            More in this country
          </Link>
          <Link
            href={`/homepage/courses/${university.courseSlug}`}
            className="rounded-lg border border-[#c7d9f5] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#4A90E2]"
          >
            More in this course
          </Link>
          <SaveUniversityButton universityId={university.id} />
        </div>
      </section>

      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <h3 className="text-lg font-bold text-[#1a2b44]">Overview</h3>
        <p className="mt-2 text-sm text-[#334e68]">{university.description}</p>

        <div className="mt-4 grid gap-2 text-sm text-[#1a2b44] sm:grid-cols-2">
          <p>
            <span className="font-semibold">Course:</span> {university.course}
          </p>
          <p>
            <span className="font-semibold">AI Score:</span> {university.score}%
          </p>
          <p>
            <span className="font-semibold">Ranking:</span> {university.ranking}
          </p>
          <p>
            <span className="font-semibold">Tuition:</span> {university.tuition}
          </p>
          <p>
            <span className="font-semibold">Duration:</span> {university.duration}
          </p>
          <p>
            <span className="font-semibold">Intake:</span> {university.intake}
          </p>
        </div>

        {university.website ? (
          <a
            href={university.website}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white"
          >
            Visit University Website
          </a>
        ) : null}
      </section>
    </div>
  );
}
