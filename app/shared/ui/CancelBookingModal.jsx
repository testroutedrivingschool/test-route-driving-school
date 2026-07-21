"use client";

import Modal from "@/app/shared/ui/Modal";

export const createInitialCancelForm = () => ({
  reasonCode: "none_given",
  customReason: "",
  clientForfeit: "0",
  blockClient: false,
  sendCustomSms: false,
  customSms: "",
});

export const cancellationReasonMap = {
  none_given: {
    category: "client",
    label: "None Given",
  },
  reschedule: {
    category: "client",
    label: "Reschedule",
  },
  sick: {
    category: "client",
    label: "Sick",
  },
  other: {
    category: "client",
    label: "Other",
  },
  instructor_sick: {
    category: "business",
    label: "Instructor Sick",
  },
  cancelled_by_instructor: {
    category: "business",
    label: "Cancelled by Instructor",
  },
};

export default function CancelBookingModal({
  booking,
  form,
  setForm,
  saving,
  onClose,
  onConfirm,
}) {
  const bookingPrice = Number(booking?.price || 0);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const reasons = [
    {
      value: "none_given",
      label: "None Given",
      group: "client",
    },
    {
      value: "reschedule",
      label: "Reschedule",
      group: "client",
    },
    {
      value: "sick",
      label: "Sick",
      group: "client",
    },
    {
      value: "other",
      label: "Other",
      group: "client",
    },
    {
      value: "instructor_sick",
      label: "Instructor Sick",
      group: "business",
    },
    {
      value: "cancelled_by_instructor",
      label: "Cancelled by Instructor",
      group: "business",
    },
  ];

  const clientReasons = reasons.filter(
    (reason) => reason.group === "client"
  );

  const businessReasons = reasons.filter(
    (reason) => reason.group === "business"
  );

  return (
    <Modal onClose={saving ? undefined : onClose}>
      <div className="overflow-hidden rounded-lg bg-white">
        <h2 className="bg-red-500 px-4 py-3 text-lg font-bold text-black md:text-2xl">
          Cancel Booking
        </h2>

        <div className="px-5 py-5">
          {/* Client reasons */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[180px_1fr]">
            <p className="font-bold text-gray-900">
              Client Reason:
            </p>

            <div className="space-y-2">
              {clientReasons.map((reason) => (
                <label
                  key={reason.value}
                  className="flex cursor-pointer items-center gap-3 text-base text-gray-900"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason.value}
                    checked={form.reasonCode === reason.value}
                    disabled={saving}
                    onChange={(event) =>
                      updateField("reasonCode", event.target.value)
                    }
                    className="h-4 w-4"
                  />

                  <span>{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom reason */}
          {form.reasonCode === "other" && (
            <div className="mt-4 sm:ml-[180px]">
              <textarea
                value={form.customReason}
                disabled={saving}
                onChange={(event) =>
                  updateField("customReason", event.target.value)
                }
                placeholder="Write cancellation reason..."
                className="min-h-[90px] w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-60"
              />
            </div>
          )}

          {/* Business reasons */}
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-[180px_1fr]">
            <p className="font-bold text-gray-900">
              Business Reason:
            </p>

            <div className="space-y-2">
              {businessReasons.map((reason) => (
                <label
                  key={reason.value}
                  className="flex cursor-pointer items-center gap-3 text-base text-gray-900"
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason.value}
                    checked={form.reasonCode === reason.value}
                    disabled={saving}
                    onChange={(event) =>
                      updateField("reasonCode", event.target.value)
                    }
                    className="h-4 w-4"
                  />

                  <span>{reason.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="my-5 border-t border-gray-200" />

          {/* Client forfeits */}
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label
              htmlFor="clientForfeit"
              className="font-bold text-gray-900"
            >
              Client Forfeits:
            </label>

            <select
              id="clientForfeit"
              value={form.clientForfeit}
              disabled={saving}
              onChange={(event) =>
                updateField("clientForfeit", event.target.value)
              }
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-60"
            >
              {Array.from(
                { length: 21 },
                (_, index) => index * 5
              ).map((percent) => {
                const amount = (
                  bookingPrice *
                  (percent / 100)
                ).toFixed(2);

                let label = `${percent}% ($${amount})`;

                if (percent === 0) {
                  label = "Nothing ($0.00)";
                }

                if (percent === 100) {
                  label = `Full Amount ($${amount})`;
                }

                return (
                  <option key={percent} value={amount}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Block client */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[180px_1fr]">
            <p className="font-bold text-gray-900">
              Block Client:
            </p>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.blockClient}
                disabled={saving}
                onChange={(event) =>
                  updateField("blockClient", event.target.checked)
                }
                className="h-4 w-4"
              />

              <span>Block from making online bookings</span>
            </label>
          </div>

          {/* Custom SMS */}
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-[180px_1fr]">
            <p className="font-bold text-gray-900">
              Send Custom SMS:
            </p>

            <div>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.sendCustomSms}
                  disabled={saving}
                  onChange={(event) =>
                    updateField(
                      "sendCustomSms",
                      event.target.checked
                    )
                  }
                  className="h-4 w-4"
                />

                <span>Send a custom cancellation SMS</span>
              </label>

              {form.sendCustomSms && (
                <textarea
                  value={form.customSms}
                  disabled={saving}
                  onChange={(event) =>
                    updateField("customSms", event.target.value)
                  }
                  placeholder="Write cancellation SMS..."
                  className="mt-3 min-h-[90px] w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:ring-2 focus:ring-red-200 disabled:opacity-60"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Close
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 md:px-8 md:text-lg"
          >
            {saving ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>
      </div>
    </Modal>
  );
}