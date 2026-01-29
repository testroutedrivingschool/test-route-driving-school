"use client";

import Link from "next/link";
import NewDropdown from "./NewDropdown";

const tabs = [
  { key: "booking", label: "Booking" },
  { key: "history", label: "History" },
  { key: "notes", label: "Notes" },
  { key: "checklists", label: "Checklists" },
  { key: "messages", label: "Messages" },
  { key: "client", label: "Client" },
  { key: "audit", label: "Audit" },
];

export default function BookingTabsNav({ bookingId, activeTab }) {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((t) => {
        const active = activeTab === t.key;
        return (
          <Link
            key={t.key}
            href={`/instructor-bookings/${bookingId}/${t.key}`}
            className={`px-5 py-2 rounded-md  text-sm font-medium transition
              ${
                active
                  ? "border-gray-300 text-gray-900 bg-white shadow-sm"
                  : "border-transparent text-red-600 hover:bg-red-50"
              }
            `}
          >
            {t.label}
          </Link>
        );
      })}

      {/* “New” dropdown */}
      <NewDropdown />
    </div>
  );
}
