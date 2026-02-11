"use client";

import Image from "next/image";
import {useRouter} from "next/navigation";
import {useState} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import {FaRegEdit} from "react-icons/fa";
import {useUserData} from "@/app/hooks/useUserData";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import Modal from "@/app/shared/ui/Modal";

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
  if (typeof v === "object" && v.$oid) return v.$oid; // if serialized
  return String(v);
}

export default function BookingDetailsCard({booking}) {
  const router = useRouter();
  const {data: user} = useUserData();
const queryClient = useQueryClient()
  const [noteModal, setNoteModal] = useState({
    open: false,
    initialText: "",
  });
  const [saving, setSaving] = useState(false);
  const clientId = booking?.clientId || booking?.userId;

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

  const clientName = safe(booking.userName || booking.clientName, "Client");
  const phone = safe(booking.userPhone || booking.clientPhone);
  const address = safe(booking.address || booking.clientAddress);
  const suburb = safe(booking.suburb, "");
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

  const openNoteModal = () => {
    const latest = bookingNotes?.[0]?.text || "";
    setNoteModal({open: true, initialText: latest});
  };
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
        { text: trimmed }
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
    setNoteModal({ open: false, initialText: "" });

  } catch (err) {
    toast.error(err?.response?.data?.error || "Failed to save note");
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
                      {n.text.length===0?"-":n.text}
                    </div>
                  ))
                : "—" || "-"
            }
            extra={<EditBtn onClick={openNoteModal} />}
          />

          {notesLoading ? (
            <div className="text-sm text-gray-500">Loading notes...</div>
          ) : bookingNotes.length ? (
            <div className=" rounded-lg p-3 space-y-2"></div>
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
              value={safe(booking.clientNote)}
              extra={<EditBtn onClick={openNoteModal} />}
            />

            <Row
              label={
                <span className="flex items-center gap-2">
                  <span>📍</span> Address:
                </span>
              }
              value={`${address}${suburb ? `, ${suburb}` : ""}`}
              valueClass="font-semibold"
              extra={
                <EditBtn
                  onClick={() => toast.info("Address edit coming soon")}
                />
              }
            />
          </div>

          {/* Service Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Service
            </h3>

            <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{serviceName}</p>
                <p className="text-xs text-gray-600 mt-1">{duration}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatMoney(price)}</p>
                <button className="text-xs text-primary hover:underline mt-1">
                  Change Cost
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Products
              </h3>
              <button className="text-sm text-blue-600 hover:underline">
                + Add Products
              </button>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between items-center">
              <p className="text-sm font-semibold">Total:</p>
              <p className="text-sm font-bold">{formatMoney(price)}</p>
            </div>

            {paymentRequired && (
              <div className="mt-4">
                <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-md">
                  Pay Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE (Instructor Image) */}
        <div className="lg:col-span-4 mx-auto">
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
          title="Add Client Note"
          defaultValue={noteModal.initialText}
          saving={saving}
          onClose={() => setNoteModal({open: false, initialText: ""})}
          onSave={saveNote}
        />
      ) : null}
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
        <p className="text-sm text-gray-600 mt-1">
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
