"use client";

type Props = {
  name: string;
  onClick?: () => void;
};

export default function CourseCard({ name,  onClick }: Props) {
  const Wrapper: React.ElementType = onClick ? "button" : "a";
  const props = onClick
    ? { onClick }
    : { href: `/homepage/courses/${encodeURIComponent(name)}` };

  return (
    <Wrapper
      {...props}
      className="group block w-full rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
    >
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-indigo-500">Course</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{name}</h3>
    </Wrapper>
  );
}
