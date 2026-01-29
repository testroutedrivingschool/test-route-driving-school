"use client";

function safe(v, fallback = "—") {
  return v ?? fallback;
}

export default function BookingDetailsCard({ booking }) {
  const clientName = safe(booking.userName || booking.clientName, "Client");
  const phone = safe(booking.userPhone || booking.clientPhone, "—");
  const address = safe(booking.address || booking.clientAddress, "—");
  const suburb = safe(booking.suburb, "");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="space-y-8">
        <Row label="Client:" value={clientName} valueClass="text-red-600 font-semibold" />
        <Row
          label="Mobile:"
          value={phone}
          valueClass="text-red-600 font-semibold"
          extra={<button className="text-xs text-red-600 hover:underline">SMS</button>}
        />
        <Row
          label="Client Note:"
          value={safe(booking.clientNote, "—")}
          extra={<EditBtn />}
        />
        <Row
          label={
            <span className="flex items-center gap-2">
              <span>📍</span> Address:
            </span>
          }
          value={`${address}${suburb ? `, ${suburb}` : ""}`}
          valueClass="font-semibold"
          extra={<EditBtn />}
        />
      </div>
    </div>
  );
}

function Row({ label, value, extra, valueClass = "" }) {
  return (
    <div className="grid grid-cols-12 items-center gap-4">
      <div className="col-span-4 text-sm font-semibold text-gray-800">
        {label}
      </div>
      <div className="col-span-8 flex items-center gap-4">
        <div className={`text-sm text-gray-900 ${valueClass}`}>{value}</div>
        {extra}
      </div>
    </div>
  );
}

function EditBtn() {
  return (
    <button
      type="button"
      className="w-9 h-9 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
      title="Edit"
    >
      ✎
    </button>
  );
}
