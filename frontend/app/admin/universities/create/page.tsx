import CreateUniversityForm from "../[id]/_components/CreateUniversityForm";

export default function CreateUniversityPage() {
  return (
    <div className="rounded-xl border border-[#d8e5f8] bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">Create</p>
      <h2 className="text-2xl font-bold text-[#1a2b44]">Add University</h2>
      <div className="mt-4">
        <CreateUniversityForm />
      </div>
    </div>
  );
}

