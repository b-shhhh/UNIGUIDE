import UpdateUniversityForm from "./_components/UpdateUniversityForm";
import { adminGetUniversity } from "@/lib/api/admin-universities";
import { notFound } from "next/navigation";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function UniversityDetailPage({ params }: Params) {
  const { id } = await params;
  const res = await adminGetUniversity(id);
  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="rounded-xl border border-[#d8e5f8] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">University Detail</p>
      <h2 className="text-2xl font-bold text-[#1a2b44]">{String(res.data.name || "University")}</h2>
      <p className="mt-1 text-sm text-[#5f7590]">{String(res.data.country || "")}</p>
      <div className="mt-4">
        <UpdateUniversityForm universityId={id} />
      </div>
    </div>
  );
}
