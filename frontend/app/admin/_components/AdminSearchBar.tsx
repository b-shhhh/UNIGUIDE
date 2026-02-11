"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function AdminSearchBar({ value, onChange, placeholder = "Search..." }: Props) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-[#c7d9f5] px-3 text-sm text-[#1a2b44] outline-none focus:ring-2 focus:ring-[#4A90E2]/30"
    />
  );
}

