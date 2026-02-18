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

export default function BookingDetailsCard() {
  const router = useRouter();
  const booking = useBooking();
  const {data: user} = useUserData();
  const queryClient = useQueryClient();
  const [noteModal, setNoteModal] = useState({
    open: false,
    initialText: "",
  });
  const [saving, setSaving] = useState(false);
  const clientId = booking?.clientId || booking?.userId;
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

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

  const clientName = safe(booking.userName || booking.clientName, "Client");
  const phone = safe(booking.userPhone || booking.clientPhone);
  const instructor = safe(booking.instructorName);
  const invoiceNo = safe(booking.invoiceNo);
  const bookingDate = formatDate(booking.bookingDate);
  const bookingTime = safe(booking.bookingTime);
  const serviceName = safe(booking.serviceName);
  const duration = safe(booking.duration);
  const price = booking.price || 0;

  const avatarSrc = booking?.instructorPhoto
    ? booking.instructorPhoto
    : booking?.instructorPhotoKey
      ? `/api/storage/proxy?key=${encodeURIComponent(booking.instructorPhotoKey)}`
      : "/profile-avatar.png";

  const paymentRequired =
    String(booking?.paymentStatus || "").toLowerCase() !== "paid";

  const bookingNotes = (notes || []).filter((n) => {
    const typeOk = String(n?.type || "").toLowerCase() === "booking";
    const noteBookingId = oid(n?.bookingId);
    const thisBookingId = oid(booking?._id);
    return typeOk && noteBookingId === thisBookingId;
  });
  const paymentStatus = String(booking?.paymentStatus || "").toLowerCase();
  const isPaid = paymentStatus === "paid";

  const paidAmount =
    booking?.paidAmount ??
    booking?.amountPaid ??
    booking?.totalPaid ??
    booking?.price ??
    0;

  const processingFee =
    booking?.processingFee ??
    booking?.cardProcessingFee ??
    booking?.stripeFee ??
    0;

  const transactionId =
    booking?.paymentIntentId || booking?.transactionId || "";

  const openNoteModal = () => {
    const latest = bookingNotes?.[0]?.text || "";
    setNoteModal({open: true, initialText: latest});
  };
  const method = String(booking?.paymentMethod || "").toLowerCase();
  const isCard = method === "card";
  const isCash = method === "cash";

  // base cost (service cost)
  const cost = Number(booking?.price || 0);

  // paid amount (card total can include fee if you stored it)
  const paidAmountNum = Number(paidAmount || 0);
  const processingFeeNum = Number(processingFee || 0);

  // What to show in modal fields:
  const creditValue = isCard ? paidAmountNum : 0;
  const cashValue = isCash ? paidAmountNum : 0;

  console.log(booking);
  console.log(clientId);

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
          bookingId: booking?._id,
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
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Service</h3>

        <div className="rounded-xl p-2 flex justify-between items-center">
          <FaArrowRight />
          <div>
            <p className="text-lg font-semibold">
              {serviceName} - {duration}
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold">{formatMoney(price)}</p>
          </div>
        </div>

        {/* Total */}
        <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center">
          <p className="text-base font-semibold">Total:</p>
          <p className="text-lg font-bold">{formatMoney(price)}</p>
        </div>

        {/* ✅ PAID UI (like screenshot) */}
        {isPaid ? (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
              {/* left label */}
              <div className="md:col-span-3">
                <p className="text-lg font-bold">Paid:</p>
              </div>

              {/* middle amount */}
              <div className="md:col-span-3">
                <p className="text-lg font-bold">{formatMoney(paidAmount)}</p>
              </div>

              {/* show detail button */}
              <div className="md:col-span-3 flex md:justify-center">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(true)}
                  className="border-2 border-primary text-primary font-semibold px-2 py-2 rounded-md hover:bg-primary hover:text-white"
                >
                  Show Detail
                </button>
              </div>

              {/* right details */}
              <div className="md:col-span-3 md:text-right">
                <div className="text-sm">
                  <p className="italic">
                    Card Transaction:{" "}
                    <span className="font-semibold">
                      {formatMoney(paidAmount)}
                    </span>
                  </p>

                  {transactionId ? (
                    <p className="mt-1 italic text-primary break-all text-xs">
                      {transactionId}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : paymentRequired ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={openPayNow}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-md"
            >
              Pay Now
            </button>
          </div>
        ) : null}
      </div>

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
            booking={booking}
            client={client}
            onClose={() => setPayNowOpen(false)}
            onSuccess={async () => {
              toast.success("Payment saved");
              // IMPORTANT: refetch booking list/details query here
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
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-3 rounded-md"
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
const [emailInvoice, setEmailInvoice] = useState(false);
  const price = Number(booking?.price || 0);
  const alreadyPaid = Number(booking?.paidAmount || 0);
  const outstanding = Number(booking?.outstanding ?? Math.max(0, price - alreadyPaid));

  // entered payment for THIS transaction only
  const [enteredCash, setEnteredCash] = useState("");
  const [enteredCard, setEnteredCard] = useState("");
  const [loading, setLoading] = useState(false);

  const cashNum = Number(enteredCash || 0);
  const cardNum = Number(enteredCard || 0);
  const enteredTotal = cashNum + cardNum;

const outstandingAfter = Math.max(0, outstanding - enteredTotal);
  const showCardSection = cardNum > 0;

  const handleSavePayment = async () => {
    if (enteredTotal <= 0) return toast.error("Enter cash or card amount");
    if (enteredTotal > outstanding) return toast.error("Cannot pay more than outstanding");

    setLoading(true);
    try {
      let paymentIntentId = null;

      // ✅ Card payment ONLY for cardNum
      if (cardNum > 0) {
        if (!stripe || !elements) throw new Error("Stripe not ready");

        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) throw new Error("Card input not ready");

        const { data } = await axios.post("/api/create-payment-intent", {
          bookingId,
          amount: cardNum, 
        });

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
        <div className="bg-green-500 text-black font-extrabold text-2xl px-6 py-4 rounded-t-lg flex items-center justify-between">
          <span>Payment Detail</span>
        </div>

        <div className="px-8 py-6">
          {/* Cost */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Total Cost:</p>
            <p className="text-2xl font-bold text-green-600">
             {formatMoney(price)}
            </p>
          </div>

          <div className="my-5 border-t border-gray-300" />

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
              value={enteredCard} onChange={(e)=>setEnteredCard(e.target.value)}
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
              <div className="px-4 py-3 bg-gray-50 font-bold text-red-600 flex items-center justify-between">
                <span>Process Credit Card</span>
                <span>🔒</span>
              </div>

              <div className="p-4">
                {/* ✅ reuse your working component */}
                <StripeCardInput />

                <div className="mt-4 flex justify-between text-sm">
                  <span>Processing Fee:</span>
                  <span>$0.00</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Total Card Charge:</span>
                  <span>{formatMoney(cardNum)}</span>
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
              onClick={handleSavePayment}
              disabled={loading}
              className="text-primary font-semibold hover:underline disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Payment"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-3 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
