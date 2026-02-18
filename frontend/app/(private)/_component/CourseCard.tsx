"use client";

type Props = {
  name: string;
  countryCount?: number;
  uniCount?: number;
  onClick?: () => void;
};

export default function CourseCard({ name, countryCount, uniCount, onClick }: Props) {
  const Wrapper: React.ElementType = onClick ? "button" : "a";
  const props = onClick
    ? { onClick }
    : { href: `/homepage/courses/${encodeURIComponent(name)}` };

  return (
    <Wrapper
      {...props}
      className="group w-full rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
    >
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-indigo-500">Course</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{name}</h3>
      <p className="mt-1 text-xs text-slate-600">
        {countryCount ? `${countryCount} countries` : "View countries"}
        {uniCount ? ` • ${uniCount} universities` : ""}
      </p>
      <span className="mt-2 inline-block text-sm font-semibold text-indigo-600 transition group-hover:translate-x-1">
        Explore →
      </span>
    </Wrapper>
  );
}
