export default function DeleteModal() {
  return (
    <div className="rounded-[8px] border border-[#f7c99b] bg-white p-5 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
      <h3 className="text-lg font-bold text-[#333333]">Confirm Deletion</h3>
      <p className="mt-2 text-sm text-[#666666]">
        This action cannot be undone. Please confirm before permanently deleting this item.
      </p>
      <div className="mt-4 flex gap-2">
        <button className="rounded-[8px] border border-[#d8e5f8] px-4 py-2 text-sm font-semibold text-[#4A90E2] hover:bg-[#eef5ff]">
          Cancel
        </button>
        <button className="rounded-[8px] bg-[#F5A623] px-4 py-2 text-sm font-semibold text-[#333333] hover:bg-[#f8b84b]">
          Delete
        </button>
      </div>
    </div>
  );
}
