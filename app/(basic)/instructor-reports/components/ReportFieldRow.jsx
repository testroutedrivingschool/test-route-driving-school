"use client";

export default function ReportFieldRow({ label, children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 items-center">
      <label className="text-black font-medium text-sm">{label}</label>
      <div>{children}</div>
    </div>
  );
}