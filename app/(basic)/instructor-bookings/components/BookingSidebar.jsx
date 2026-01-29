"use client";

import { useState } from "react";

export default function BookingSidebar({ booking }) {
  const [open, setOpen] = useState(null); // "sessionNote" | "invoiceNote" | ...

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4">
        <button
          type="button"
          className="w-full bg-black text-white py-3 rounded-md font-bold flex items-center justify-center gap-2"
        >
          Booking Detail <span className="text-xl">›</span>
        </button>
      </div>

      <div className="border-t">
        <Item icon="🗒️" label="Edit Session Note" onClick={() => setOpen("sessionNote")} />
        <Item label="Add Invoice Note" onClick={() => setOpen("invoiceNote")} />
        <Item label="Email Invoice" onClick={() => setOpen("emailInvoice")} />
        <Item label="View Invoice" onClick={() => setOpen("viewInvoice")} />
        <Item label="Rebook Client" onClick={() => setOpen("rebook")} />
      </div>

      <div className="p-4 text-xs text-gray-500">
        Payment:{" "}
        <span className="font-semibold">
          {String(booking?.paymentStatus || "").toLowerCase().includes("paid")
            ? "Paid"
            : "Unpaid"}
        </span>
      </div>

      {/* ✅ Modal placeholders */}
      {open ? (
        <ModalShell title={open} onClose={() => setOpen(null)}>
          <p className="text-sm text-gray-700">
            Modal content for: <b>{open}</b>
          </p>
        </ModalShell>
      ) : null}
    </div>
  );
}

function Item({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-5 py-4 text-left hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3"
    >
      <span className="w-7">{icon || ""}</span>
      <span className="font-medium text-gray-900">{label}</span>
    </button>
  );
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-lg">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h4 className="font-semibold capitalize">{title}</h4>
          <button onClick={onClose} className="px-3 py-1 rounded-md border">
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
