"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function NewDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`px-5 py-2 rounded-md text-sm font-medium border 
          ${open ? "border-primary text-primary" : "border-transparent text-primary"}
          hover:bg-gray-50`}
      >
        New ▾
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-border-color rounded-xl shadow z-50">
          <Link
            href="/instructor-bookings"
            className="block px-4 py-2 text-sm text-primary hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Booking
          </Link>

          <Link
            href="/instructor/sales/sales"
            className="block px-4 py-2 text-sm text-primary hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Sale / Purchase
          </Link>
        </div>
      )}
    </div>
  );
}
