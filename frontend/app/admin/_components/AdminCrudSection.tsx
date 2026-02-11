"use client";

import { useMemo, useState } from "react";

type Props = {
  title: string;
  subtitle: string;
  items: Record<string, unknown>[];
  fields: { key: string; label: string; required?: boolean; placeholder?: string }[];
  onCreate: (payload: Record<string, unknown>) => Promise<{ success: boolean; message?: string }>;
  onUpdate: (id: string, payload: Record<string, unknown>) => Promise<{ success: boolean; message?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; message?: string }>;
};

const getId = (item: Record<string, unknown>) => {
  const id = item._id ?? item.id;
  return typeof id === "string" ? id : "";
};

const getText = (item: Record<string, unknown>, key: string) => {
  const value = item[key];
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry)).join(", ");
  }
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return "";
};

export default function AdminCrudSection({ title, subtitle, items, fields, onCreate, onUpdate, onDelete }: Props) {
  const [createState, setCreateState] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string>("");
  const [editState, setEditState] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const normalizedItems = useMemo(() => items.filter((item) => getId(item)), [items]);

  const startEdit = (item: Record<string, unknown>) => {
    const id = getId(item);
    if (!id) return;
    setEditingId(id);
    const next: Record<string, string> = {};
    for (const field of fields) {
      next[field.key] = getText(item, field.key);
    }
    setEditState(next);
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const result = await onCreate(createState);
    setBusy(false);
    setMessage(result.message || (result.success ? `${title} created` : `Failed to create ${title}`));
    if (result.success) {
      setCreateState({});
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId) return;
    setBusy(true);
    setMessage("");
    const result = await onUpdate(editingId, editState);
    setBusy(false);
    setMessage(result.message || (result.success ? `${title} updated` : `Failed to update ${title}`));
    if (result.success) {
      setEditingId("");
    }
  };

  const handleDelete = async (id: string) => {
    setBusy(true);
    setMessage("");
    const result = await onDelete(id);
    setBusy(false);
    setMessage(result.message || (result.success ? `${title} deleted` : `Failed to delete ${title}`));
  };

  return (
    <div className="space-y-4 rounded-xl border border-[#d8e5f8] bg-white p-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5f7590]">{subtitle}</p>
        <h3 className="text-xl font-bold text-[#1a2b44]">{title}</h3>
      </div>

      <form onSubmit={handleCreate} className="grid gap-3 rounded-lg border border-[#e6eef9] bg-[#f9fbff] p-3 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={`create-${field.key}`} className="text-xs font-semibold uppercase tracking-[0.08em] text-[#5f7590]">
            {field.label}
            <input
              value={createState[field.key] || ""}
              onChange={(event) => setCreateState((prev) => ({ ...prev, [field.key]: event.target.value }))}
              required={field.required}
              placeholder={field.placeholder}
              className="mt-1 h-10 w-full rounded-lg border border-[#c7d9f5] px-3 text-sm font-normal text-[#1a2b44]"
            />
          </label>
        ))}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-[#4A90E2] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white disabled:opacity-50"
          >
            Add {title}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-[#e6eef9]">
        <table className="min-w-full divide-y divide-[#e6eef9] text-sm">
          <thead className="bg-[#f7faff]">
            <tr>
              {fields.map((field) => (
                <th key={`head-${field.key}`} className="px-3 py-2 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">
                  {field.label}
                </th>
              ))}
              <th className="px-3 py-2 text-right text-xs font-bold uppercase tracking-[0.08em] text-[#5f7590]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef4ff] bg-white">
            {normalizedItems.map((item) => {
              const id = getId(item);
              const isEditing = id === editingId;
              return (
                <tr key={id}>
                  {fields.map((field) => (
                    <td key={`${id}-${field.key}`} className="px-3 py-2 align-top text-[#1a2b44]">
                      {isEditing ? (
                        <input
                          value={editState[field.key] || ""}
                          onChange={(event) => setEditState((prev) => ({ ...prev, [field.key]: event.target.value }))}
                          className="h-9 w-full rounded border border-[#c7d9f5] px-2 text-sm"
                        />
                      ) : (
                        <span>{getText(item, field.key) || "-"}</span>
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <form onSubmit={handleUpdate}>
                            <button
                              type="submit"
                              disabled={busy}
                              className="rounded bg-[#4A90E2] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
                            >
                              Save
                            </button>
                          </form>
                          <button
                            type="button"
                            onClick={() => setEditingId("")}
                            className="rounded border border-[#d8e5f8] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44]"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="rounded border border-[#d8e5f8] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#1a2b44]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="rounded bg-[#b91c1c] px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!normalizedItems.length ? (
              <tr>
                <td colSpan={fields.length + 1} className="px-3 py-6 text-center text-sm text-[#5f7590]">
                  No records found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {message ? <p className="text-sm text-[#5f7590]">{message}</p> : null}
    </div>
  );
}

