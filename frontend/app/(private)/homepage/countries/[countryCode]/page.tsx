import Link from "next/link";
import { notFound } from "next/navigation";
import { getUniversitiesByCountry } from "@/lib/csv-universities";

type Props = {
  params: Promise<{ countryCode: string }>;
};

export default async function CountryUniversitiesPage({ params }: Props) {
  const { countryCode } = await params;
  const universities = await getUniversitiesByCountry(countryCode);

  if (!universities.length) {
    notFound();
  }

  const country = universities[0];

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Country</p>
        <h2 className="mt-2 text-2xl font-bold text-[#1a2b44]">
          {country.countryFlagUrl ? (
            <img
              src={country.countryFlagUrl}
              alt={`${country.countryName} flag`}
              width={22}
              height={16}
              className="mr-2 inline rounded-[2px] align-[-3px]"
            />
          ) : null}
          {country.countryName}
        </h2>
        <p className="mt-1 text-sm text-[#5f7590]">{universities.length} universities in this country</p>
        <Link href="/homepage" className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.08em] text-[#4A90E2]">
          Back to dashboard
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {universities.map((uni) => (
          <article key={uni.id} className="rounded-xl border border-[#d8e5f8] bg-white p-4">
            {uni.logoUrl ? (
              <img src={uni.logoUrl} alt={`${uni.name} logo`} width={32} height={32} className="mb-2 rounded" />
            ) : null}
            <p className="text-base font-bold text-[#1a2b44]">{uni.name}</p>
            <p className="mt-1 text-xs text-[#5f7590]">{uni.course}</p>
            <p className="mt-1 text-xs text-[#0f766e]">AI score: {uni.score}%</p>
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
