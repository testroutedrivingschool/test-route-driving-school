"use client";

import Link from "next/link";
import NewDropdown from "./NewDropdown";

const tabs = [
  { key: "booking", label: "Booking" },
  { key: "history", label: "History" },
  { key: "notes", label: "Notes" },
  { key: "checklists", label: "Checklists" },
  { key: "messages", label: "Messages" },
];

export default function BookingTabsNav({ bookingId, activeTab }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-border-color">
      {tabs.map((t) => {
        const active = activeTab === t.key;
        return (
          <Link
            key={t.key}
            href={`/instructor-bookings/${bookingId}/${t.key}`}
            className={`px-5 py-2 rounded-md  text-sm font-semibold transition
              ${
                active
                  ? "border-gray-300 text-gray-900 bg-white shadow-sm"
                  : "bg-gray-100 text-primary hover:bg-primary/20"
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
