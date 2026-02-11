"use client";

import {useState} from "react";
import {FaBars} from "react-icons/fa";

export default function BookingSidebar({booking}) {
  const [openModal, setOpenModal] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const paymentStatus = String(booking?.paymentStatus || "").toLowerCase();
  const isPaid = paymentStatus === "paid";
  return (
    <>
      {/* ✅ Mobile Menu (like Clients page) */}
      <div className="md:hidden mb-4 ">
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
              <MobileItem
                label="Edit Session Note"
                onClick={() => {
                  setOpenModal("sessionNote");
                  setMobileMenuOpen(false);
                }}
              />
              <MobileItem
                label="Add Invoice Note"
                onClick={() => {
                  setOpenModal("invoiceNote");
                  setMobileMenuOpen(false);
                }}
              />
              <MobileItem
                label="Email Invoice"
                onClick={() => {
                  setOpenModal("emailInvoice");
                  setMobileMenuOpen(false);
                }}
              />
              <MobileItem
                label="View Invoice"
                onClick={() => {
                  setOpenModal("viewInvoice");
                  setMobileMenuOpen(false);
                }}
              />
              <MobileItem
                label="Rebook Client"
                onClick={() => {
                  setOpenModal("rebook");
                  setMobileMenuOpen(false);
                }}
              />

              <div className="border-t border-white/20 my-2" />

              <div className="text-sm">
                Payment:
                <span className="font-semibold">
                  {paymentStatus === "paid"
                    ? "Paid"
                    : paymentStatus === "unpaid"
                      ? "Unpaid"
                      : "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Desktop Sidebar */}
      <div className="hidden md:block bg-white rounded-xl overflow-hidden">
        <div className="p-4">
          <div className="w-full bg-black text-white px-3 py-3 rounded-md font-bold flex items-center justify-end gap-2 text-right">
            Booking Detail <span className="text-xl">›</span>
          </div>
        </div>

        <div className="border-t border-border-color">
          <Item
            icon="🗒️"
            label="Edit Session Note"
            onClick={() => setOpenModal("sessionNote")}
          />
          <Item
            label="Add Invoice Note"
            onClick={() => setOpenModal("invoiceNote")}
          />
          <Item
            label="Email Invoice"
            onClick={() => setOpenModal("emailInvoice")}
          />
          <Item
            label="View Invoice"
            onClick={() => setOpenModal("viewInvoice")}
          />
          <Item label="Rebook Client" onClick={() => setOpenModal("rebook")} />
        </div>

        <div className="p-4 text-xs text-gray-500 text-right">
         Payment: <span className="font-semibold">{isPaid ? "Paid" : "Unpaid"}</span>

        </div>
      </div>

      {/* ✅ Modal placeholders */}
      {openModal ? (
        <ModalShell title={openModal} onClose={() => setOpenModal(null)}>
          <p className="text-sm text-gray-700">
            Modal content for: <b>{openModal}</b>
          </p>
        </ModalShell>
      ) : null}
    </>
  );
}

function Item({icon, label, onClick}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-5 py-4 text-right hover:bg-gray-50 border-b border-border-color last:border-b-0 flex items-center justify-end gap-3 "
    >
      <span className="w-7">{icon || ""}</span>
      <span className="font-medium text-gray-900">{label}</span>
    </button>
  );
}

function MobileItem({label, onClick}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full text-left py-2 "
    >
      {label}
    </button>
  );
}

function ModalShell({title, children, onClose}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-lg">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h4 className="font-semibold capitalize">{title}</h4>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-md border"
          >
            Close
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
