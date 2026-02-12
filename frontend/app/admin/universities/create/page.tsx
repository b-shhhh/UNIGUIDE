import CreateUniversityForm from "../[id]/_components/CreateUniversityForm";

export default function CreateUniversityPage() {
  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-sky-700 via-cyan-700 to-sky-900 p-6 text-white shadow-[0_14px_36px_rgba(3,105,161,0.25)] sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-8 h-48 w-48 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-sky-100">Create University</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-4xl">Add a new university record</h2>
          <p className="mt-2 text-sm text-sky-100">Enter institution details and publish them into the admin list.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Create</p>
        <h3 className="text-2xl font-black tracking-tight text-slate-900">Add University</h3>
        <div className="mt-4">
          <CreateUniversityForm />
        </div>
      </section>
    </div>
  );
}
