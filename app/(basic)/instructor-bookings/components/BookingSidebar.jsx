"use client";

import {useMemo, useState, useEffect} from "react";
import {FaBars} from "react-icons/fa";
import {GrNotes} from "react-icons/gr";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import Modal from "@/app/shared/ui/Modal";
import {useUserData} from "@/app/hooks/useUserData";
import {toast} from "react-toastify";
import { useRouter } from "next/navigation";

/* ---------- helpers ---------- */
function oid(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v.$oid) return v.$oid;
  return String(v);
}

export default function BookingSidebar({booking}) {
  const [openModal, setOpenModal] = useState(null);
  const [invoiceNoteOpen, setInvoiceNoteOpen] = useState(false);
const [invoiceNoteText, setInvoiceNoteText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
const router = useRouter()
  const queryClient = useQueryClient();
  const {data: user} = useUserData();

 const paymentStatus = String(booking?.paymentStatus || "").toLowerCase();
const isPaid =
  paymentStatus === "paid" ||
  paymentStatus.includes("voucher") ||
  paymentStatus.includes("paid");

  const clientId = booking?.clientId || booking?.userId || "";
  const bookingId = oid(booking?._id);
  const downloadAttachment = async (key) => {
    const {data} = await axios.post("/api/storage/download-url", {key});
    window.open(data.url, "_blank", "noopener,noreferrer");
  };
  // ✅ Load client notes
  const {data: notes = [], isLoading: notesLoading} = useQuery({
    queryKey: ["clientNotes", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${clientId}/notes`);
      return res.data;
    },
  });

  // ✅ SESSION notes for THIS booking
  const sessionNotes = (notes || []).filter((n) => {
    const typeOk = String(n?.type || "").toLowerCase() === "session";
    const noteBookingId = oid(n?.bookingId);
    return typeOk && noteBookingId === bookingId;
  });

  const latestSessionNote = sessionNotes?.[0]?.text || "";
  const existingSessionNote = sessionNotes?.[0]; // newest one (because API sorts desc)
const status = String(booking?.status || "pending").toLowerCase();

const HIDE_BY_STATUS = {
  confirmed: new Set(["confirmBooking", "cancelBooking"]),
  unattended: new Set(["confirmBooking", "cancelBooking", "moveBooking", "markUnattended"]),
  cancelled: new Set(["cancelBooking", "confirmBooking", "markUnattended", "moveBooking"]),
};
const parseTimeTo24h = (t) => {
  // "7:15AM" / "12:00PM"
  const m = String(t || "").trim().match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
  if (!m) return null;
  let hh = parseInt(m[1], 10);
  const mm = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();

  if (ap === "PM" && hh !== 12) hh += 12;
  if (ap === "AM" && hh === 12) hh = 0;

  return { hh, mm };
};

const isMoveExpired = useMemo(() => {
  const dateLike = booking?.bookingDate || booking?.date;
  const timeStr = booking?.bookingTime || booking?.time;
  if (!dateLike || !timeStr) return false;

  const d = new Date(dateLike);
  const tm = parseTimeTo24h(timeStr);
  if (Number.isNaN(d.getTime()) || !tm) return false;

  d.setHours(tm.hh, tm.mm, 0, 0);
  return d.getTime() < Date.now(); // ✅ past = hide Move
}, [booking?.bookingDate, booking?.date, booking?.bookingTime, booking?.time]);


const shouldHide = (key) => HIDE_BY_STATUS[status]?.has(key);

  // ✅ Menu items based on payment status



const menuItems = useMemo(() => {
  const paidMenu = [
    { key: "sessionNote", label: "Edit Session Note", icon: <GrNotes size={20} /> },
    { key: "invoiceNote", label: "Add Invoice Note" },
    { key: "emailInvoice", label: "Email Invoice" },
    { key: "viewInvoice", label: "View Invoice" },
        { key: "confirmBooking", label: "Confirm Booking" },
     { key: "moveBooking", label: "Move Booking" }, 
    { key: "rebook", label: "Rebook Client" },
  ];

  const unpaidMenu = [
    { key: "sessionNote", label: "Session Note", icon: <GrNotes size={20} /> },
    { key: "invoiceNote", label: "Add Invoice Note" },
    { key: "emailInvoice", label: "Email Invoice" },
    { key: "viewInvoice", label: "View Invoice" },

    { key: "confirmBooking", label: "Confirm Booking" },
    { key: "markUnattended", label: "Mark Unattended" },
    { key: "cancelBooking", label: "Cancel Booking" },
    { key: "moveBooking", label: "Move Booking" },

    { key: "rebook", label: "Rebook Client" },
  ];

  const base = isPaid ? paidMenu : unpaidMenu;

  // ✅ hide rules
  const hide = new Set();

  // status rules
  if (status === "confirmed") hide.add("confirmBooking");
  if (status === "unattended") {
    hide.add("confirmBooking");
    hide.add("cancelBooking");
    hide.add("moveBooking");
    hide.add("markUnattended");
  }
  if (status === "cancelled") {
    hide.add("confirmBooking");
    hide.add("cancelBooking");
    hide.add("moveBooking");
    hide.add("markUnattended");
  }

  // time rule
  if (isMoveExpired) hide.add("moveBooking");

  // payment rule (extra safety — in case paid menu ever changes)


  return base.filter((item) => !hide.has(item.key));
}, [isPaid, status, isMoveExpired]);


  const openFromMenu = (key) => setOpenModal(key);

  // ✅ Save SESSION Note (update if exists else create)
  const saveSessionNote = async (text) => {
    if (!clientId) return toast.error("Client ID missing");

    const trimmed = String(text || "").trim();
    if (!trimmed) return toast.error("Write something first");

    try {
      setSaving(true);

  
      if (existingSessionNote?._id) {
       
        await axios.post(`/api/clients/${clientId}/notes`, {
          type: "session",
          text: trimmed,
          bookingId: booking?._id,
          createdBy: {
            userId: user?._id || "",
            name: user?.name || "",
            role: user?.role || "instructor",
            ...(user?.photo ? {photo: user.photo} : {}),
            ...(user?.photoKey ? {photoKey: user.photoKey} : {}),
          },
        });
      } else {
        await axios.post(`/api/clients/${clientId}/notes`, {
          type: "session",
          text: trimmed,
          bookingId: booking?._id,
          createdBy: {
            userId: user?._id || "",
            name: user?.name || "",
            role: user?.role || "instructor",
            ...(user?.photo ? {photo: user.photo} : {}),
            ...(user?.photoKey ? {photoKey: user.photoKey} : {}),
          },
        });
      }

      await queryClient.invalidateQueries({queryKey: ["clientNotes", clientId]});
      toast.success("Session note saved");
      setOpenModal(null);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };
  console.log(booking);
const handleMenuClick = async (key) => {
    if (key === "invoiceNote") {
    setInvoiceNoteText("");
    setInvoiceNoteOpen(true);
    return;
  }
  if (key === "emailInvoice") {
    try {
      setSaving(true);

      const toEmail =
        booking?.clientEmail ||
        booking?.email ||
        booking?.client?.email;

      if (!toEmail) {
        toast.error("Client email not found");
        return;
      }

      await axios.post("/api/email-invoice", {
        to: toEmail,
        bookingId,
        bookingServiceName: booking?.serviceName,
        invoiceNo: booking?.invoiceNo,
        invoiceKey: booking?.invoiceKey || `invoices/invoice-${booking?.invoiceNo}.pdf`,
      });

      toast.success("Invoice emailed successfully");
      return;
    } catch (err) {
       console.log("EMAIL INVOICE ERROR:", err?.response?.status, err?.response?.data, err);
  toast.error(err?.response?.data?.error || "Failed to email invoice");
      return;
    } finally {
      setSaving(false);
    }
  }
  if(key ==="viewInvoice"){
    downloadAttachment(`invoices/invoice-${booking?.invoiceNo}.pdf`)
  }
if (key === "confirmBooking") {
  try {
    setSaving(true);

    const id = oid(booking?._id);
    if (!id) {
      toast.error("Booking ID missing");
      return;
    }

    await axios.patch(`/api/bookings/${id}`, { status: "confirmed" });

    toast.success("Booking confirmed");

    // ✅ refresh your booking query/page data
    // if you fetch booking with react-query, invalidate it:
    queryClient.invalidateQueries({ queryKey: ["booking"] });
queryClient.invalidateQueries({ queryKey: ["bookings"] });


    return;
  } catch (err) {
    toast.error(err?.response?.data?.error || "Failed to confirm booking");
    return;
  } finally {
    setSaving(false);
  }
}
if (key === "cancelBooking") {
  try {
    setSaving(true);

    const id = oid(booking?._id);
    if (!id) {
      toast.error("Booking ID missing");
      return;
    }

    await axios.patch(`/api/bookings/${id}`, { status: "cancelled" });

    toast.success("Booking cancelled");

    // refresh booking data
    queryClient.invalidateQueries({ queryKey: ["booking"] });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });

    return;
  } catch (err) {
    toast.error(err?.response?.data?.error || "Failed to cancel booking");
    return;
  } finally {
    setSaving(false);
  }
}
if (key === "moveBooking") {
  const id = oid(booking?._id);
  if (!id) return toast.error("Booking ID missing");

  // go to schedule page in "move mode"
  router.push(`/instructor-bookings?moveBookingId=${id}`);
  return;
}
if (key === "rebook") {
  const cid = oid(booking?.clientId || booking?.userId);
  if (!cid) return toast.error("Client ID missing");

  router.push(`/instructor-bookings?rebookClientId=${cid}`);
  return;
}
  // default behavior: open modal
  openFromMenu(key);
};
const sendInvoiceNoteEmail = async () => {
  try {
    setSaving(true);

    const toEmail = booking?.clientEmail || booking?.email || booking?.client?.email;
    if (!toEmail) {
      toast.error("Client email not found");
      return;
    }

    if (!booking?.invoiceNo && !booking?.invoiceKey) {
      toast.error("Invoice info missing");
      return;
    }
    if (!invoiceNoteText.trim()) {
  toast.error("Please write an invoice note");
  return;
}


await axios.post("/api/email-invoice", {
  to: toEmail,
  bookingId,
  bookingServiceName: booking?.serviceName,
  invoiceNo: booking?.invoiceNo,
  invoiceKey: booking?.invoiceKey || `invoices/invoice-${booking?.invoiceNo}.pdf`,
  noteText: invoiceNoteText,
});

    toast.success("Invoice note emailed");
    setInvoiceNoteOpen(false);
  } catch (err) {
    console.log("INVOICE NOTE EMAIL ERROR:", err?.response?.status, err?.response?.data, err);
    toast.error(err?.response?.data?.error || "Failed to send invoice note");
  } finally {
    setSaving(false);
  }
};

  return (
    <>
      {/* ✅ Mobile Menu */}
      <div className="md:hidden mb-4">
        <div className="bg-black text-white rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-4 py-4"
          >
            <FaBars className="text-xl" />
            <span className="text-lg font-semibold">Booking Detail</span>
          </button>

          {mobileMenuOpen && (
            <div className="px-4 pb-4 space-y-2">
              {menuItems.map((item) => (
                <MobileItem
                  key={item.key}
                  label={item.label}
                 onClick={() => {
  handleMenuClick(item.key);
  setMobileMenuOpen(false);
}}
                />
              ))}

              <div className="border-t border-white/20 my-2" />

              <div className="text-sm">
                Payment:{" "}
                <span className="font-semibold">
                  {isPaid ? "Paid" : paymentStatus === "unpaid" ? "Unpaid" : "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Desktop Sidebar */}
      <div className="hidden md:block bg-white rounded-xl overflow-hidden border border-border-color">
        <div className="p-4">
          <div className="w-full bg-black text-white px-3 py-3 rounded-md font-bold flex items-center justify-end gap-2 text-right">
            Booking Detail <span className="text-xl">›</span>
          </div>
        </div>

        <div className="border-t border-border-color">
          {menuItems.map((item) => (
            <Item
              key={item.key}
              icon={item.icon}
              label={item.label}
              onClick={() => handleMenuClick(item.key)}
            />
          ))}
        </div>

        <div className="p-4 text-xs text-gray-500 text-right">
          Payment: <span className="font-semibold">{isPaid ? "Paid" : "Unpaid"}</span>
        </div>
      </div>
{invoiceNoteOpen && (
  <Modal onClose={() => setInvoiceNoteOpen(false)}>
    <div className="p-2">
      <h3 className="text-lg font-semibold text-gray-900">Send Invoice Note</h3>
      <p className="text-sm text-neutral mt-1">
        This note will be included in the email and invoice PDF will be attached.
      </p>

      <div className="mt-4">
        <textarea
          className="w-full min-h-[140px] border border-gray-200 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-border-color"
          placeholder="Write invoice note..."
          value={invoiceNoteText}
          onChange={(e) => setInvoiceNoteText(e.target.value)}
        />
      </div>

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setInvoiceNoteOpen(false)}
          className="px-4 py-2 rounded-md border"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={sendInvoiceNoteEmail}
          className="px-5 py-2 rounded-md bg-primary text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  </Modal>
)}

      {/* ✅ Session Note Modal */}
      {openModal === "sessionNote" ? (
        <SessionModal
          title={isPaid ? "Edit Session Note" : "Session Note"}
          defaultValue={notesLoading ? "" : latestSessionNote}
          saving={saving}
          onClose={() => setOpenModal(null)}
          onSave={saveSessionNote}
        />
      ) : null}
          {saving && (
        <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-[340px] h-[260px] flex flex-col items-center justify-center gap-4">
            <div className="flex space-x-2">
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
            </div>
            <p className="text-gray-800 font-semibold text-lg">Sending...</p>
          </div>
        </div>
      )}
    </>
  );
}

function Item({icon, label, onClick}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-5 py-4 text-right hover:bg-gray-50 border-b border-border-color last:border-b-0 flex items-center justify-end gap-2"
    >
      <span>{icon || ""}</span>
      <span className="font-medium text-gray-900">{label}</span>
    </button>
  );
}

function MobileItem({label, onClick}) {
  return (
    <button type="button" onClick={onClick} className="block w-full text-left py-2">
      {label}
    </button>
  );
}

/* ✅ Modal UI (IMPORTANT: update state when defaultValue changes) */
function SessionModal({title, defaultValue, onClose, onSave, saving}) {
  const [text, setText] = useState(defaultValue || "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(defaultValue || "");
  }, [defaultValue]);

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
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">
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


