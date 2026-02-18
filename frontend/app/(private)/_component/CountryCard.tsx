"use client";
type Props = {
  name: string;
  flagUrl?: string;
  count?: number;
  onClick?: () => void;
};

export default function CountryCard({ name, flagUrl, count, onClick }: Props) {
  const Wrapper: React.ElementType = onClick ? "button" : "a";
  const props = onClick
    ? { onClick }
    : { href: `/homepage/countries/${encodeURIComponent(name)}` };

  return (
    <Wrapper
      {...props}
      className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        {flagUrl ? (
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={flagUrl} alt={`${name} flag`} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
            {name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{count ? `${count} universities` : "View universities"}</p>
        </div>
      </div>
      <span className="text-slate-400 transition group-hover:text-slate-600">→</span>
    </Wrapper>
  );
}
