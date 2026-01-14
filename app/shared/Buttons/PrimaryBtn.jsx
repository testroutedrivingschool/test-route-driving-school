"use client";
export default function PrimaryBtn({children, onClick, type, className}) {
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      className={`bg-primary transition font-bold text-white border border-transparent hover:scale-105 rounded-md px-4 py-2 flex items-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}
