import Link from "next/link";
import { getCountries } from "@/lib/csv-universities";

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#d8e5f8] bg-white p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Browse</p>
        <h2 className="mt-2 text-2xl font-bold text-[#1a2b44]">All Countries</h2>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {countries.map((country) => (
          <Link
            key={country.code}
            href={`/homepage/countries/${country.code}`}
            className="rounded-xl border border-[#d8e5f8] bg-white p-4 hover:bg-[#f5f9ff]"
          >
            <p className="text-base font-bold text-[#1a2b44]">
              {country.flagImageUrl ? (
                <img
                  src={country.flagImageUrl}
                  alt={`${country.name} flag`}
                  width={18}
                  height={14}
                  className="mr-1 inline rounded-[2px] align-[-2px]"
                />
              ) : null}
              {country.name}
            </p>
            <p className="mt-1 text-xs text-[#5f7590]">{country.count} universities</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
