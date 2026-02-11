import UpdateUniversityForm from "./_components/UpdateUniversityForm";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function UniversityDetailPage({ params }: Params) {
  const { id } = await params;

  return (
    <div className="rounded-xl border border-[#d8e5f8] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">University Detail</p>
      <h2 className="text-2xl font-bold text-[#1a2b44]">University ID: {id}</h2>
      <div className="mt-4">
        <UpdateUniversityForm universityId={id} />
      </div>
    </div>
  );
}

