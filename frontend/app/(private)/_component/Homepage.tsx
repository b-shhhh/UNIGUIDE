export default function Homepage() {
  const stats = [
    { label: "Matches", value: "24", tone: "bg-[#d7f0ec] text-[#0f766e]" },
    { label: "Saved Universities", value: "8", tone: "bg-[#dbeafe] text-[#1d4ed8]" },
    { label: "Deadlines This Month", value: "3", tone: "bg-[#ffedd5] text-[#c2410c]" },
    { label: "Profile Completion", value: "82%", tone: "bg-[#ede9fe] text-[#6d28d9]" },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-[#1a2b44]/10 bg-[#1a2b44] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-10 h-48 w-48 rounded-full bg-[#22c1a7]/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 right-16 h-44 w-44 rounded-full bg-[#f59e0b]/25 blur-2xl" />
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#c5d2e6]">Welcome back</p>
        <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
          Your personalized admissions dashboard is ready.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-[#d7e1f0] sm:text-base">
          Track university matches, upcoming application deadlines, and profile progress in one place.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-[#1a2b44]/10 bg-white p-4 shadow-[0_8px_30px_rgba(26,43,68,0.06)]">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#4f6682]">{item.label}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-3xl font-bold text-[#1a2b44]">{item.value}</p>
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ${item.tone}`}>
                Active
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-[#1a2b44]/10 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1a2b44]">Recommended Universities</h3>
            <button className="text-xs font-bold uppercase tracking-[0.1em] text-[#0f766e]">View all</button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Card name="University of Melbourne" program="MSc Data Science" country="Australia" score="96%" />
            <Card name="TU Munich" program="MS Informatics" country="Germany" score="92%" />
            <Card name="University of Toronto" program="MEng Software" country="Canada" score="89%" />
            <Card name="King's College London" program="MSc AI" country="UK" score="87%" />
          </div>
        </article>

        <article className="rounded-2xl border border-[#1a2b44]/10 bg-white p-5">
          <h3 className="text-lg font-bold text-[#1a2b44]">Upcoming Deadlines</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-xl bg-[#f3f8ff] p-3">
              <p className="font-semibold text-[#1a2b44]">TU Munich - Fall Intake</p>
              <p className="text-[#4f6682]">March 20, 2026</p>
            </li>
            <li className="rounded-xl bg-[#fff7ed] p-3">
              <p className="font-semibold text-[#1a2b44]">Toronto - Scholarship Form</p>
              <p className="text-[#4f6682]">March 29, 2026</p>
            </li>
            <li className="rounded-xl bg-[#eefcf7] p-3">
              <p className="font-semibold text-[#1a2b44]">Melbourne - SOP Upload</p>
              <p className="text-[#4f6682]">April 3, 2026</p>
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}

function Card({
  name,
  program,
  country,
  score,
}: {
  name: string;
  program: string;
  country: string;
  score: string;
}) {
  return (
    <div className="rounded-xl border border-[#1a2b44]/10 bg-[#fcfeff] p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[#1a2b44]">{name}</p>
          <p className="mt-1 text-xs text-[#4f6682]">{program}</p>
        </div>
        <span className="rounded-full bg-[#d7f0ec] px-2.5 py-1 text-[11px] font-bold text-[#0f766e]">{score} fit</span>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#5f7590]">{country}</p>
    </div>
  );
}
