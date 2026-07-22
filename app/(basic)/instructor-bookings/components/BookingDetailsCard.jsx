"use client";

import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {FaArrowRight, FaRegEdit} from "react-icons/fa";
import {useUserData} from "@/app/hooks/useUserData";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import Modal from "@/app/shared/ui/Modal";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import StripeCardInput from "@/app/shared/ui/StripeCardInput";
import {useBooking} from "../[bookingId]/BookingContext";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_Stripe_Publishable_key,
);

function safe(v, fallback = "—") {
  return v ?? fallback;
}

function formatDate(date) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-AU", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatMoney(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}
function oid(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v.$oid) return v.$oid;
  return String(v);
}
const DRIVING_TEST_LOCATIONS = [
  "Bankstown",
  "Bathurst",
  "Blacktown",
  "Bondi",
  "Bondi Junction",
  "Botany",
  "Castle Hill",
  "Chatswood",
  "Eastgarden",
  "Edmondson Park",
  "Engadine",
  "Glenmore Park",
  "Gregory Hills",
  "Lidcombe",
  "Liverpool",
  "Macquarie Fields",
  "Macquarie Park",
  "Marrickville",
  "Merrylands",
  "Miranda",
  "North Rocks",
  "North Ryde",
  "Parramatta",
  "Penrith",
  "Revesby",
  "Rhodes",
  "Richmond",
  "Rockdale",
  "Roseland",
  "Ryde",
  "Silverwater",
  "St. Marys",
  "Warrawong",
  "Wetherill Park",
];

function formatTestTime(time) {
  if (!time) return "—";

  const match = String(time).match(
    /^([01]\d|2[0-3]):([0-5]\d)$/
  );

  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${minutes}${suffix}`;
}

function formatShortDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date);
  }

  return parsed.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function capitalize(value) {
  const text = String(value || "").trim();

  if (!text) return "";

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).toLowerCase()
  );
}
export default function BookingDetailsCard() {
  const router = useRouter();
  const booking = useBooking();
  const {data: user} = useUserData();
  const queryClient = useQueryClient();
  const [noteModal, setNoteModal] = useState({
    open: false,
    initialText: "",
  });
  const [testFieldModal, setTestFieldModal] =
  useState({
    open: false,
    field: "",
    label: "",
    value: "",
    type: "text",
  });

const [passFailModalOpen, setPassFailModalOpen] =
  useState(false);

const [testDetailsSaving, setTestDetailsSaving] =
  useState(false);
  const [saving, setSaving] = useState(false);
  const clientId = booking?.clientId || booking?.userId;
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [costModalOpen, setCostModalOpen] = useState(false);
  const [clientNoteModalOpen, setClientNoteModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [payNowOpen, setPayNowOpen] = useState(false);

  const openPayNow = () => {
    setPayNowOpen(true);
  };
  const bookingId = oid(booking?._id);

  const {data: freshBooking} = useQuery({
    queryKey: ["booking", bookingId],
    enabled: !!bookingId,
    queryFn: async () => {
      const res = await axios.get(`/api/bookings/${bookingId}`);
      return res.data;
    },
  });

  const b = freshBooking || booking;
  const {
    data: notes = [],
    isLoading: notesLoading,
    refetch,
  } = useQuery({
    queryKey: ["clientNotes", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${clientId}/notes`);
      return res.data;
    },
  });
  const {data: client, isLoading: clientLoading} = useQuery({
    queryKey: ["client", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${clientId}`);
      return res.data;
    },
  });

const clientName = safe(b?.userName || b?.clientName, "Client");
const phone = safe(b?.userPhone || b?.clientPhone);
const instructor = safe(b?.instructorName);
const invoiceNo = safe(b?.invoiceNo);
const bookingDate = formatDate(b?.bookingDate);
const bookingTime = safe(b?.bookingTime);
const serviceName = safe(b?.serviceName);
const duration = safe(b?.duration);
const price = b?.price || 0;
const normalizedServiceName = String(
  b?.serviceName || ""
)
  .replace(/\s+/g, " ")
  .trim()
  .toLowerCase();

const isDrivingTestPackage =
  normalizedServiceName ===
  "driving test package";

const passFailValue = b?.testResult
  ? `${capitalize(b.testResult)}${
      b?.testDate
        ? ` - ${formatShortDate(b.testDate)}`
        : ""
    }`
  : b?.testDate
    ? formatShortDate(b.testDate)
    : "—";
  const avatarSrc = b?.instructorPhoto
  ? b.instructorPhoto
  : b?.instructorPhotoKey
    ? `/api/storage/proxy?key=${encodeURIComponent(b.instructorPhotoKey)}`
    : "/profile-avatar.png";



 const bookingNotes = (notes || []).filter((n) => {
  const typeOk = String(n?.type || "").toLowerCase() === "booking";
  const noteBookingId = oid(n?.bookingId);
  const thisBookingId = oid(b?._id);
  return typeOk && noteBookingId === thisBookingId;
});
const paymentStatus = String(
  b?.paymentStatus || ""
).toLowerCase();

const paidAmount = Number(
  b?.paidAmount ??
    b?.amountPaid ??
    b?.totalPaidAmount ??
    b?.totalPaid ??
    0
);

const usedCredit = Number(
  b?.creditUsed ??
    b?.creditToUse ??
    0
);

const isPaid = paymentStatus === "paid";

const outstandingAmount = Number(
  b?.outstanding ??
    Math.max(
      0,
      Number(b?.price || 0) - paidAmount
    )
);

const paymentRequired =
  !isPaid && outstandingAmount > 0;

const canChangeService =
  paymentStatus === "unpaid" &&
  paidAmount <= 0 &&
  usedCredit <= 0;


const openTestFieldEditor = ({
  field,
  label,
  value,
  type = "text",
}) => {
  setTestFieldModal({
    open: true,
    field,
    label,
    value: value || "",
    type,
  });
};

const saveTestField = async (value) => {
  if (!bookingId || !testFieldModal.field) {
    return;
  }

  try {
    setTestDetailsSaving(true);

    await axios.patch(
      `/api/bookings/${bookingId}`,
      {
        [testFieldModal.field]:
          String(value || "").trim(),
      }
    );

    await queryClient.invalidateQueries({
      queryKey: ["booking", bookingId],
    });

    await queryClient.invalidateQueries({
      queryKey: ["bookings"],
    });

    toast.success(
      `${testFieldModal.label} updated`
    );

    setTestFieldModal({
      open: false,
      field: "",
      label: "",
      value: "",
      type: "text",
    });
  } catch (error) {
    toast.error(
      error?.response?.data?.error ||
        "Failed to update test information"
    );
  } finally {
    setTestDetailsSaving(false);
  }
};

const savePassFail = async ({
  result,
  date,
  comment,
}) => {
  if (!bookingId) return;

  if (!result) {
    toast.error("Select Passed or Failed");
    return;
  }

  if (!date) {
    toast.error("Select the pass/fail date");
    return;
  }

  try {
    setTestDetailsSaving(true);

    await axios.patch(
      `/api/bookings/${bookingId}`,
      {
        testResult: result,
        testDate: date,
        testResultComment:
          String(comment || "").trim(),
      }
    );

    await queryClient.invalidateQueries({
      queryKey: ["booking", bookingId],
    });

    await queryClient.invalidateQueries({
      queryKey: ["bookings"],
    });

    toast.success("Pass / fail result updated");
    setPassFailModalOpen(false);
  } catch (error) {
    toast.error(
      error?.response?.data?.error ||
        "Failed to update pass / fail result"
    );
  } finally {
    setTestDetailsSaving(false);
  }
};
  const handleChangeService = () => {
  if (!canChangeService) {
    toast.error("Only a completely unpaid booking can change service");
    return;
  }

  const returnPath =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : `/bookings/${bookingId}`;

  sessionStorage.setItem(
    "pendingBooking",
    JSON.stringify({
      ...b,

      mode: "change-service",
      editingBookingId: bookingId,
      changeServiceReturnPath: returnPath,

      currentService: {
        serviceName: b?.serviceName || "",
        duration: b?.duration || "",
        minutes: Number(b?.minutes || 0),
        price: Number(b?.price || 0),
      },
    }),
  );

  router.push("/booking-confirm?mode=change-service");
};
const processingFee =
  b?.processingFee ??
  b?.cardProcessingFee ??
  b?.stripeFee ??
  0;

const transactionId = b?.paymentIntentId || b?.transactionId || "";

  const openNoteModal = () => {
    const latest = bookingNotes?.[0]?.text || "";
    setNoteModal({open: true, initialText: latest});
  };
 const method = String(b?.paymentMethod || "").toLowerCase();
  const isCard = method === "card";
  const isCash = method === "cash";

  // base cost (service cost)
  const cost = Number(b?.price || 0);

  // paid amount (card total can include fee if you stored it)
  const paidAmountNum = Number(paidAmount || 0);
  const processingFeeNum = Number(processingFee || 0);

  // What to show in modal fields:
  const creditValue = isCard ? paidAmountNum : 0;
  const cashValue = isCash ? paidAmountNum : 0;



  const saveNote = async (text) => {
    if (!clientId) {
      toast.error("Client ID missing");
      return;
    }

    const trimmed = String(text || "").trim();

    try {
      setSaving(true);

      const existingNote = bookingNotes?.[0];

      if (existingNote) {
        // ✅ UPDATE existing note
        await axios.patch(
          `/api/clients/${clientId}/notes/${existingNote._id}`,
          {text: trimmed},
        );
      } else {
        // ✅ CREATE new note
        await axios.post(`/api/clients/${clientId}/notes`, {
          type: "booking",
          text: trimmed,
        bookingId: b?._id,
bookingTitle: `${serviceName} • ${bookingTime}`,
          createdBy: {
            userId: user?._id || "",
            name: user?.name || "",
            role: user?.role || "instructor",
            photo: user?.photo || "",
            photoKey: user?.photoKey || "",
          },
        });
      }

      await refetch();
      toast.success("Note saved");
      setNoteModal({open: false, initialText: ""});
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const saveClientNote = async (text) => {
    const trimmed = String(text || "").trim();

    try {
      setSaving(true);

      await axios.patch(`/api/clients/${clientId}`, {
        clientNote: trimmed,
      });

      toast.success("Client note updated");

      await queryClient.invalidateQueries({queryKey: ["client", clientId]});

      setClientNoteModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to update client note");
    } finally {
      setSaving(false);
    }
  };
  const saveClientAddress = async ({address, suburb}) => {
    try {
      setSaving(true);

      await axios.patch(`/api/clients/${clientId}`, {
        address,
        suburb,
      });

      toast.success("Address updated");
      await queryClient.invalidateQueries({queryKey: ["client", clientId]});
      setAddressModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl">
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 space-y-6">
          <Row label="Booking Date:" value={`${bookingDate} ${bookingTime}`} />
          <Row
            label="Instructor:"
            value={instructor}
            extra={<SmallLink text="SMS" />}
          />
          <Row
            label="Invoice Number:"
            value={invoiceNo ? `#${invoiceNo}` : "—"}
          />
          <Row
            label="Booking Note:"
            value={
              bookingNotes?.length
                ? bookingNotes.map((n) => (
                    <div key={n._id} className="text-base">
                      {n.text.length === 0 ? "-" : n.text}
                    </div>
                  ))
                : "—" || "-"
            }
            extra={<EditBtn onClick={openNoteModal} />}
          />

          {notesLoading ? (
            ""
          ) : bookingNotes.length ? (
            <div className=" rounded-lg  space-y-2"></div>
          ) : null}

          <div className="border-t border-gray-100 pt-4 space-y-6">
            <Row
              label="Client:"
              onClick={() =>
                clientId && router.push(`/clients?clientId=${clientId}`)
              }
              value={clientName}
              valueClass="text-primary font-semibold"
            />

            <Row
              label="Mobile:"
              value={phone}
              valueClass="text-primary font-semibold"
            />

            <Row
              label="Client Note:"
              value={clientLoading ? "Loading..." : safe(client?.clientNote)}
              extra={<EditBtn onClick={() => setClientNoteModalOpen(true)} />}
            />

            <Row
              label={
                <span className="flex items-center gap-2">
                  <span>📍</span> Address:
                </span>
              }
              value={
                clientLoading
                  ? "Loading..."
                  : `${safe(client?.address, "")}${client?.suburb ? `, ${client.suburb}` : ""}` ||
                    "—"
              }
              valueClass="font-semibold"
              extra={<EditBtn onClick={() => setAddressModalOpen(true)} />}
            />
          </div>
        </div>

        {/* RIGHT SIDE (Instructor Image) */}
        <div className="hidden lg:block lg:col-span-4 mx-auto">
          <div className="border border-gray-200 rounded-xl overflow-hidden w-48 h-48">
            <Image
              src={avatarSrc}
              width={500}
              height={500}
              alt="instructor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
{/* Driving Test Package information */}
{isDrivingTestPackage && (
  <div className="border-t border-gray-200 px-4 py-6">
    <div className="max-w-3xl space-y-5">
      <TestInformationRow
        label="Test Location:"
        value={b?.testLocation || "—"}
        onEdit={() =>
          openTestFieldEditor({
            field: "testLocation",
            label: "Test Location",
            value: b?.testLocation,
            type: "location",
          })
        }
      />

      <TestInformationRow
        label="Test Time:"
        value={formatTestTime(b?.testTime)}
        onEdit={() =>
          openTestFieldEditor({
            field: "testTime",
            label: "Test Time",
            value: b?.testTime,
            type: "time",
          })
        }
      />

      <TestInformationRow
        label="Booking Ref #:"
        value={b?.bookingRefNo || "—"}
        onEdit={() =>
          openTestFieldEditor({
            field: "bookingRefNo",
            label: "Booking Ref #",
            value: b?.bookingRefNo,
            type: "text",
          })
        }
      />

      <TestInformationRow
        label="Pass / Fail Date:"
        value={passFailValue}
        onEdit={() =>
          setPassFailModalOpen(true)
        }
      />
    </div>
  </div>
)}
      {/* ✅ Note Modal */}
      {noteModal.open ? (
        <NoteModal
          title="Set Booking Booking Note"
          defaultValue={noteModal.initialText}
          saving={saving}
          onClose={() => setNoteModal({open: false, initialText: ""})}
          onSave={saveNote}
        />
      ) : null}

      {clientNoteModalOpen && (
        <NoteModal
          title="Edit Client Note"
          defaultValue={client?.clientNote || ""}
          saving={saving}
          onClose={() => setClientNoteModalOpen(false)}
          onSave={saveClientNote}
        />
      )}

      {addressModalOpen && (
        <Modal onClose={() => setAddressModalOpen(false)}>
          <AddressModalBody
            saving={saving}
            defaultAddress={client?.address || ""}
            defaultSuburb={client?.suburb || ""}
            onCancel={() => setAddressModalOpen(false)}
            onSave={saveClientAddress}
          />
        </Modal>
      )}

{/* Service Section */}
<div className="border-l-5 border-slate-900 bg-white px-4 py-5">
  <h3 className="mb-4 text-2xl font-bold text-black">
    Service
  </h3>

  {/* Service information */}
  <div className="flex items-start justify-between gap-4 mb-2">
    <div className="min-w-0">
      <p className="md:text-lg font-bold text-black">
        {serviceName} - {duration}
      </p>

      {b?.isPriceOverridden && b?.originalPrice != null && (
        <p className="mt-1 text-sm text-gray-500">
          Previous:{" "}
          <span className="line-through">
            {formatMoney(b.originalPrice)}
          </span>
        </p>
      )}
    </div>

    <div className="flex shrink-0 items-center gap-6">
      <p className="md:text-lg font-medium text-black">
        {formatMoney(b?.price || 0)}
      </p>

      {/* Change Cost icon */}
      {paymentStatus !== "paid" && (
        <button
          type="button"
          onClick={() => setCostModalOpen(true)}
          className="flex md:h-9 md:w-9 items-center justify-center text-gray-700 transition hover:text-primary"
          title="Change Cost"
          aria-label="Change Cost"
        >
          <FaRegEdit size={24} />
        </button>
      )}
    </div>
  </div>

  {/* Change Service */}
  {canChangeService && (
  <button
    type="button"
    onClick={handleChangeService}
    className="mt-9! md:text-lg font-medium text-primary transition hover:underline"
  >
    Change Service
  </button>
)}
</div>

{/* Payment Section */}
<div className="border-t border-gray-200 px-4 py-5">
  {/* Total */}
  <div className="flex items-center justify-between">
    <p className="text-base font-semibold">
      Total:
    </p>

    <p className="text-lg font-bold">
      {formatMoney(b?.price || 0)}
    </p>
  </div>

  {/* Paid booking */}
  {isPaid ? (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="text-lg font-bold">
            Paid:
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-lg font-bold text-green-600">
            {formatMoney(paidAmount)}
          </p>
        </div>

        <div className="flex md:col-span-3 md:justify-center">
          <button
            type="button"
            onClick={() =>
              setPaymentModalOpen(true)
            }
            className="rounded-md border-2 border-primary px-3 py-2 font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Show Detail
          </button>
        </div>

        <div className="md:col-span-3 md:text-right">
          <div className="text-sm">
            {isCard && (
              <p className="italic">
                Card Transaction:{" "}
                <span className="font-semibold">
                  {formatMoney(paidAmount)}
                </span>
              </p>
            )}

            {isCash && (
              <p className="italic">
                Cash Payment:{" "}
                <span className="font-semibold">
                  {formatMoney(paidAmount)}
                </span>
              </p>
            )}

            {transactionId ? (
              <p className="mt-1 break-all text-xs italic text-primary">
                {transactionId}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ) : paymentRequired ? (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600">
            Outstanding Payment
          </p>

          <p className="text-xl font-bold text-red-600">
            {formatMoney(outstandingAmount)}
          </p>
        </div>

        <button
          type="button"
          onClick={openPayNow}
          className="rounded-md bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
        >
          Pay Now
        </button>
      </div>
    </div>
  ) : null}
</div>

      {costModalOpen && (
        <ChangeCostModal
          booking={b}
          onClose={() => setCostModalOpen(false)}
          onSaved={async () => {
            await queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
            await queryClient.invalidateQueries({ queryKey: ["bookings"] });
            setCostModalOpen(false);
          }}
        />
      )}
      {testFieldModal.open && (
  <TestFieldModal
    label={testFieldModal.label}
    type={testFieldModal.type}
    defaultValue={testFieldModal.value}
    saving={testDetailsSaving}
    onClose={() =>
      setTestFieldModal({
        open: false,
        field: "",
        label: "",
        value: "",
        type: "text",
      })
    }
    onSave={saveTestField}
  />
)}

{passFailModalOpen && (
  <PassFailModal
    defaultResult={b?.testResult || ""}
    defaultDate={b?.testDate || ""}
    defaultComment={
      b?.testResultComment || ""
    }
    saving={testDetailsSaving}
    onClose={() =>
      setPassFailModalOpen(false)
    }
    onSave={savePassFail}
  />
)}
      {paymentModalOpen && (
        <PaymentDetailModal
          onClose={() => setPaymentModalOpen(false)}
          cost={cost}
          cash={cashValue}
          credit={creditValue}
          total={paidAmountNum || cost}
          transactionId={transactionId}
          processingFee={processingFeeNum}
          isCard={isCard}
        />
      )}
     {payNowOpen && (
  <Elements stripe={stripePromise}>
    <PayNowModal
      booking={b}
      client={client}
      onClose={() => setPayNowOpen(false)}
      onSuccess={async () => {
        toast.success("Payment saved");
        await queryClient.invalidateQueries({queryKey: ["booking", bookingId]});
        await queryClient.invalidateQueries({queryKey: ["bookings"]});
        setPayNowOpen(false);
      }}
    />
  </Elements>
)}
    </div>
  );
}

/* ---------------- Reusable Components ---------------- */

function Row({label, value, extra, valueClass = "", onClick}) {
  return (
    <div className="grid grid-cols-12 items-start gap-4">
      <div className="col-span-4 text-base font-semibold text-gray-800">
        {label}
      </div>

      <div
        onClick={onClick}
        className={`col-span-8 flex items-center gap-4 ${onClick ? "cursor-pointer" : ""}`}
      >
        <div className={`text-sm text-gray-900 font-medium ${valueClass}`}>
          {value}
        </div>
        {extra}
      </div>
    </div>
  );
}

function EditBtn({onClick}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="w-9 h-9 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
      title="Edit"
    >
      <FaRegEdit size={20} />
    </button>
  );
}

function SmallLink({text}) {
  return (
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      className="text-xs text-primary hover:underline"
    >
      {text}
    </button>
  );
}

function TestInformationRow({
  label,
  value,
  onEdit,
}) {
  return (
    <div className="grid grid-cols-12 items-center gap-4">
      <div className="col-span-5 text-base font-medium text-gray-900 md:col-span-4">
        {label}
      </div>

      <div className="col-span-7 flex items-center gap-3 md:col-span-8">
        <span className="min-w-0 wrap-break-word text-base font-medium text-gray-900">
          {value || "—"}
        </span>

        <button
          type="button"
          onClick={onEdit}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-gray-600 transition hover:text-primary"
          title={`Edit ${label}`}
          aria-label={`Edit ${label}`}
        >
          <FaRegEdit size={22} />
        </button>
      </div>
    </div>
  );
}
function TestFieldModal({
  label,
  type,
  defaultValue,
  saving,
  onClose,
  onSave,
}) {
  const [value, setValue] = useState(
    defaultValue || ""
  );

  return (
    <Modal onClose={onClose}>
      <div className="p-3">
        <h3 className="text-xl font-bold text-gray-900">
          Edit {label}
        </h3>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            {label}
          </label>

          {type === "location" ? (
            <select
              value={value}
              onChange={(event) =>
                setValue(event.target.value)
              }
              className="input-class w-full"
            >
              <option value="">
                Select test location
              </option>

              {DRIVING_TEST_LOCATIONS.map(
                (location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>
                )
              )}
            </select>
          ) : (
            <input
              type={
                type === "time"
                  ? "time"
                  : "text"
              }
              value={value}
              onChange={(event) =>
                setValue(event.target.value)
              }
              placeholder={
                type === "text"
                  ? `Enter ${label.toLowerCase()}`
                  : ""
              }
              className="input-class w-full"
            />
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(value)}
            className="rounded-md bg-primary px-5 py-2 font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PassFailModal({
  defaultResult,
  defaultDate,
  defaultComment,
  saving,
  onClose,
  onSave,
}) {
  const [result, setResult] = useState(
    String(defaultResult || "").toLowerCase()
  );

  const [date, setDate] = useState(() => {
    if (!defaultDate) return "";

    const parsed = new Date(defaultDate);

    if (Number.isNaN(parsed.getTime())) {
      return String(defaultDate).slice(0, 10);
    }

    return parsed.toISOString().slice(0, 10);
  });

  const [comment, setComment] = useState(
    defaultComment || ""
  );

  return (
    <Modal onClose={onClose}>
      <div className="p-2">
        <h3 className="text-3xl font-bold text-gray-900">
          Set Pass / Fail
        </h3>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setResult("passed")}
            className={`min-h-28 text-xl font-semibold text-white transition ${
              result === "passed"
                ? "bg-green-700 ring-4 ring-green-200"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Passed
          </button>

          <button
            type="button"
            onClick={() => setResult("failed")}
            className={`min-h-28 text-xl font-semibold text-white transition ${
              result === "failed"
                ? "bg-red-700 ring-4 ring-red-200"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Failed
          </button>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-base font-medium text-gray-900">
            Pass / Fail Date:
          </label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            className="input-class w-full"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-base font-medium text-gray-900">
            Comment:
          </label>

          <textarea
            value={comment}
            onChange={(event) =>
              setComment(event.target.value)
            }
            className="min-h-32 w-full rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Add a comment..."
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-5 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              onSave({
                result,
                date,
                comment,
              })
            }
            className="rounded-md bg-primary px-6 py-2 font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
function NoteModal({title, defaultValue, onClose, onSave, saving}) {
  const [text, setText] = useState(defaultValue || "");

  return (
    <Modal onClose={onClose}>
      <div className="p-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-neutral mt-1">
          This note will be saved under this client and linked to the booking.
        </p>

        <div className="mt-4">
          <textarea
            className="w-full min-h-[140px] border border-gray-200 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-border-color"
            placeholder="Write a note..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(text)}
            className="px-5 py-2 rounded-md bg-primary text-white font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
function AddressModalBody({
  defaultAddress,
  defaultSuburb,
  onCancel,
  onSave,
  saving,
}) {
  const [address, setAddress] = useState(defaultAddress);
  const [suburb, setSuburb] = useState(defaultSuburb);

  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold text-gray-900">Edit Address</h3>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Address</label>
          <input
            className="mt-1 w-full border border-gray-200 rounded-md p-3 text-sm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Suburb</label>
          <input
            className="mt-1 w-full border border-gray-200 rounded-md p-3 text-sm"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() =>
            onSave({address: address.trim(), suburb: suburb.trim()})
          }
          className="px-5 py-2 rounded-md bg-primary text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

function PaymentDetailModal({
  onClose,
  cost,
  cash,
  credit,
  total,
  transactionId,
  processingFee,
  isCard,
}) {
  return (
    <Modal onClose={onClose}>
      <div className="p-3">
        {/* Header */}
        <div className="bg-green-500 text-black font-extrabold text-lg px-4 py-2 rounded-t-lg flex items-center justify-between">
          <span>Payment Detail</span>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {/* Cost Row */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">Cost:</p>
            <p className="text-lg font-bold text-green-600">
              {formatMoney(cost)}
            </p>
          </div>

          <div className="my-4 border-t border-gray-300" />

          {/* Methods */}
          <div className="grid grid-cols-12 gap-3 items-center">
            <p className="col-span-4 text-lg font-bold">Cash:</p>
            <input
              readOnly
              value={cash ? Number(cash).toFixed(2) : ""}
              className="col-span-8 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
            />

            <p className="col-span-4 text-lg font-bold">Credit:</p>
            <input
              readOnly
              value={credit ? Number(credit).toFixed(2) : ""}
              className="col-span-8 bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-right"
            />

            <p className="col-span-4 text-lg font-bold">Other:</p>
            <input
              readOnly
              value=""
              className="col-span-8 bg-gray-100 border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="my-6 border-t border-gray-300" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">Total:</p>
            <p className="text-lg font-bold text-green-600">
              {formatMoney(total)}
            </p>
          </div>

          {/* Card details bottom (only if card) */}
          {isCard ? (
            <div className="mt-10 text-sm font-semibold text-gray-800">
              <p>Card Transaction: {formatMoney(total)}</p>
              {transactionId ? (
                <p className="break-all">{transactionId}</p>
              ) : null}
              {processingFee ? (
                <p>Card Processing Fee: {formatMoney(processingFee)}</p>
              ) : null}
            </div>
          ) : null}

          {/* Footer button */}
          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-primary  text-white font-bold px-10 py-3 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function PayNowModal({booking, client, onClose, onSuccess}) {
   const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  const bookingId = oid(booking?._id);
const [emailInvoice, setEmailInvoice] = useState(true);
  const price = Number(booking?.price || 0);
  const alreadyPaid = Number(booking?.paidAmount || 0);
  const outstanding = Number(booking?.outstanding ?? Math.max(0, price - alreadyPaid));

  // entered payment for THIS transaction only
  const [enteredCash, setEnteredCash] = useState("");
  const [enteredCard, setEnteredCard] = useState("");
  const [loading, setLoading] = useState(false);

  const cashNum = Number(enteredCash || 0);
  const cardNum = Number(enteredCard || 0);
  const [processingFee, setProcessingFee] = useState(0);
  const [totalCardCharge, setTotalCardCharge] = useState(0);
  const enteredTotal = cashNum + cardNum;
const outstandingAfter = Math.max(0, outstanding - enteredTotal);
  const showCardSection = cardNum > 0;

  const handleSavePayment = async () => {
    if (enteredTotal <= 0) return toast.error("Enter cash or card amount");
    if (enteredTotal > outstanding) return toast.error("Cannot pay more than outstanding");

    setLoading(true);
    try {
      let paymentIntentId = null;

      
      let processingFeeLocal = 0;
let totalCardChargeLocal = 0;

if (cardNum > 0) {
  if (!stripe || !elements) throw new Error("Stripe not ready");

  const cardElement = elements.getElement(CardNumberElement);
  if (!cardElement) throw new Error("Card input not ready");

  // ✅ CALL API AGAIN (REQUIRED)
  const { data } = await axios.post("/api/create-payment-intent", {
    bookingId,
    type: "booking-existing",
    amount: Number(cardNum),
  });

  processingFeeLocal = data.processingFee || 0;
  totalCardChargeLocal = data.totalAmount || cardNum;

  const result = await stripe.confirmCardPayment(data.clientSecret, {
    payment_method: {
      card: cardElement,
      billing_details: {
        name:
          booking?.userName ||
          booking?.clientName ||
          `${client?.firstName || ""} ${client?.lastName || ""}`.trim(),
        email: booking?.userEmail || client?.email || "",
      },
    },
  });

  if (result.error) throw new Error(result.error.message);
  paymentIntentId = result.paymentIntent?.id || null;
}

      // ✅ compute new totals (accumulate)
      const newCashAmount = Number(booking?.cashAmount || 0) + cashNum;
      const newCardAmount = Number(booking?.cardAmount || 0) + cardNum;
      const newPaidAmount = newCashAmount + newCardAmount;
      const finalOutstanding = Math.max(0, price - newPaidAmount);
      const paymentStatus = finalOutstanding === 0 ? "paid" : "partial";

      // method for display
      const method =
        cashNum > 0 && cardNum > 0
          ? "mixed"
          : cardNum > 0
            ? "card"
            : "cash";

  const patchRes = await axios.patch(`/api/bookings/${bookingId}`, {
  paymentStatus,
  paymentMethod: method,
  paymentIntentId,
  processingFee,
  cashAmount: newCashAmount,
  cardAmount: newCardAmount,
  paidAmount: newPaidAmount,
  outstanding: finalOutstanding,
});

const updatedBooking = patchRes.data;
if (emailInvoice) {
  await axios.post("/api/pdf/send-paid-invoice", {
    bookingId,
    to: booking?.userEmail || client?.email,
  });
}

      await queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error(err?.message || err?.response?.data?.error || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-0">
        {/* Header */}
        <div className="bg-green-500 text-black font-extrabold text-2xl px-6 py-1 rounded-t-lg flex items-center justify-between">
          <span>Payment Detail</span>
        </div>

        <div className="px-2 py-4">
          {/* Cost */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Total Cost:</p>
            <p className="text-2xl font-bold text-green-600">
             {formatMoney(price)}
            </p>
          </div>

          <div className="my-4 border-t border-gray-300" />

          {/* Cash/Credit */}
          <div className="grid grid-cols-12 gap-4 items-center">
            <p className="col-span-4 text-lg font-bold">Cash:</p>
            <input
              value={enteredCash} onChange={(e)=>setEnteredCash(e.target.value)}
              className="col-span-8 border border-gray-300 rounded-md px-3 py-2 text-right"
              placeholder="0.00"
            />

            <p className="col-span-4 text-lg font-bold">Credit:</p>
            <input
              value={enteredCard} onChange={async (e) => {
  const value = e.target.value;
  setEnteredCard(value);

  if (!value || Number(value) <= 0) {
    setProcessingFee(0);
    setTotalCardCharge(0);
    return;
  }

  try {
    const { data } = await axios.post("/api/create-payment-intent", {
      bookingId,
      type: "booking-existing",
      amount: Number(value),
    });

    setProcessingFee(data.processingFee || 0);
    setTotalCardCharge(data.totalAmount || value);
  } catch (err) {
    console.error(err);
  }
}}
              className="col-span-8 border border-gray-300 rounded-md px-3 py-2 text-right"
              placeholder="0.00"
            />
          </div>

          <div className="my-6 border-t border-gray-300" />

          {/* Total/Outstanding */}
         <div className="space-y-2">
  <div className="flex justify-between">
    <p className="text-lg font-bold">Already Paid:</p>
    <p className="text-2xl font-bold text-green-600">
      {formatMoney(alreadyPaid)}
    </p>
  </div>

  {(cashNum > 0 || cardNum > 0) && (
    <div className="text-sm text-neutral-600">
      {cashNum > 0 && <div className="flex justify-end">Cash now: {formatMoney(cashNum)}</div>}
      {cardNum > 0 && <div className="flex justify-end">Card now: {formatMoney(cardNum)}</div>}
    </div>
  )}

  <div className="flex justify-between">
    <p className="text-lg font-bold">Outstanding (before):</p>
    <p className="text-2xl font-bold text-red-600">
      {formatMoney(outstanding)}
    </p>
  </div>

  <div className="flex justify-between">
    <p className="text-lg font-bold">Paying now:</p>
    <p className="text-2xl font-bold text-green-600">
      {formatMoney(enteredTotal)}
    </p>
  </div>

  <div className="flex justify-between">
    <p className="text-lg font-bold">Outstanding After:</p>
<p className="text-2xl font-bold text-red-600">
  {formatMoney(outstandingAfter)}
</p>
  </div>
</div>


          {/* Stripe section only if credit > 0 */}
          {showCardSection && (
            <div className="mt-6 border border-gray-200 rounded-md">
              <div className="px-2 py-3 bg-gray-50 font-bold text-red-600 flex items-center justify-between">
                <span>Process Credit Card</span>
                <span>🔒</span>
              </div>

              <div className="p-2">
                {/* ✅ reuse your working component */}
                <StripeCardInput />

                <div className="mt-4 flex justify-between text-sm">
                  <span>Processing Fee:</span>
                  <span>{formatMoney(processingFee)}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Total Card Charge:</span>
                  <span>{formatMoney(totalCardCharge)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Email invoice */}
          <div className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              checked={emailInvoice}
              onChange={(e) => setEmailInvoice(e.target.checked)}
            />
            <span>Email invoice on payment.</span>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
                onClick={onClose}
              className="text-primary font-semibold hover:underline disabled:opacity-60"
            >
             Close
            </button>

            <button
              type="button"
        
                  onClick={handleSavePayment}
              disabled={loading}
              className="bg-primary  text-white font-bold px-10 py-3 rounded-md"
            >
             {loading ? "Saving..." : "Save Payment"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function ChangeCostModal({booking, onClose, onSaved}) {
  const [saving, setSaving] = useState(false);

  const currentPrice = Number(booking?.price || 0);
  const originalPrice = Number(
    booking?.originalPrice != null ? booking.originalPrice : booking?.price || 0
  );
  const paidAmount = Number(booking?.paidAmount || 0);

  const [newPrice, setNewPrice] = useState(
    booking?.isPriceOverridden && booking?.overridePrice != null
      ? String(booking.overridePrice)
      : String(currentPrice || "")
  );

  const handleSave = async () => {
    const parsed = Number(newPrice);

    if (!newPrice || Number.isNaN(parsed) || parsed <= 0) {
      return toast.error("Enter a valid cost");
    }

    if (parsed < paidAmount) {
      return toast.error("New cost cannot be less than already paid amount");
    }

    try {
      setSaving(true);

      const hasOverride = Number(parsed) !== Number(originalPrice);
      const newOutstanding = Math.max(0, parsed - paidAmount);

      await axios.patch(`/api/bookings/${oid(booking?._id)}`, {
        price: parsed,
        originalPrice,
        overridePrice: hasOverride ? parsed : null,
        isPriceOverridden: hasOverride,
        outstanding: newOutstanding,
        paymentStatus:
          paidAmount === 0
            ? "unpaid"
            : newOutstanding === 0
              ? "paid"
              : "partial",
      });

      toast.success("Cost updated");
      await onSaved?.();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to update cost");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-3">
        <h3 className="text-xl font-bold text-gray-900">Change Cost</h3>

        <div className="mt-4 space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Original Price</span>
              <span className="font-semibold">{formatMoney(originalPrice)}</span>
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Current Price</span>
              <span className="font-semibold text-primary">
                {formatMoney(currentPrice)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Already Paid</span>
              <span className="font-semibold text-green-600">
                {formatMoney(paidAmount)}
              </span>
            </div>

            {booking?.isPriceOverridden ? (
              <div className="mt-2 text-xs text-green-600 font-medium">
                Override is active
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Cost
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-3 pl-8"
                placeholder="0.00"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              New cost must be equal to or more than already paid amount.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="px-5 py-2 rounded-md bg-primary text-white font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Cost"}
          </button>
        </div>
      </div>
    </Modal>
  );
}