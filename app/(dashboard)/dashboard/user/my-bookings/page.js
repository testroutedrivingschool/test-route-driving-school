"use client";

import React, { useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FiCalendar, FiClock, FiMapPin, FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useUserData } from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { toast } from "react-toastify";
import Modal from "@/app/shared/ui/Modal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardNumberElement } from "@stripe/react-stripe-js";
import StripeCardInput from "@/app/shared/ui/StripeCardInput";
function formatDateAU(dateLike) {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

function toBookingDateTime(bookingDate, bookingTime) {
  const d = new Date(bookingDate);
  if (Number.isNaN(d.getTime())) return null;

  const t = String(bookingTime || "").trim().toUpperCase();
  const m = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (!m) return d;

  let hh = Number(m[1]);
  const mm = Number(m[2] || 0);
  const ap = m[3];

  if (ap === "PM" && hh !== 12) hh += 12;
  if (ap === "AM" && hh === 12) hh = 0;

  const combined = new Date(d);
  combined.setHours(hh, mm, 0, 0);
  return combined;
}

function canUserReschedule(bookingDate, bookingTime) {
  const dt = toBookingDateTime(bookingDate, bookingTime);
  if (!dt) return false;
  return dt.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
}
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_Stripe_Publishable_key,
);

function formatMoney(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function oid(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v.$oid) return v.$oid;
  return String(v);
}
export default function UserBookings() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading } = useUserData();
  const [payNowBooking, setPayNowBooking] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/bookings?email=${user.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  if (isUserLoading || isLoading) return <LoadingSpinner />;

  if (!bookings.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No bookings found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-border-color bg-white shadow-sm z-1">
        <div className="p-4 border-b border-border-color flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <FiCalendar /> My Bookings
            </h2>
            <p className="text-sm opacity-70 mt-2">
              <b>Reschedule rule:</b> You must reschedule at least <b>24 hours</b> before the booking time.
            </p>
          </div>
        </div>

        <div className="p-2 md:p-4 space-y-4">
          {bookings.map((b) => {
            const allow = canUserReschedule(b.bookingDate, b.bookingTime);
            const when = `${formatDateAU(b.bookingDate)} • ${b.bookingTime || "—"}`;
            const where = [b.address, b.suburb].filter(Boolean).join(", ");

            const paymentStatus = String(b?.paymentStatus || "").toLowerCase();
            const isPaid = paymentStatus === "paid";
            const paidAmount = Number(b?.paidAmount || 0);
            const outstanding = Number(
              b?.outstanding ?? Math.max(0, Number(b?.price || 0) - paidAmount)
            );

            return (
              <div key={b._id} className="rounded-xl border border-border-color bg-base-100 p-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{b.serviceName}</h3>

                    <div className="text-sm opacity-85">
                      <b>Instructor:</b> {b.instructorName || "—"}{" "}
                      {b.instructorEmail ? (
                        <span className="opacity-70">({b.instructorEmail})</span>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex items-center gap-2 opacity-85">
                        <FiClock className="text-lg hidden sm:block" />
                        <span><b>Date & Time:</b> {when}</span>
                      </div>

                      <div className="flex items-center gap-2 opacity-85">
                        <FiMapPin className="text-xl md:text-lg hidden sm:block" />
                        <span><b>Location:</b> {where || "—"}</span>
                      </div>

                      <div className="opacity-85">
                        <b>Duration:</b> {b.duration || "—"}
                      </div>

                      <div className="opacity-85">
                        <b>Payment Status:</b>{" "}
                        <span className={isPaid ? "text-green-600 font-semibold" : "text-orange-600 font-semibold"}>
                          {isPaid ? "Paid" : outstanding > 0 && paidAmount > 0 ? "Partial" : "Unpaid"}
                        </span>
                      </div>

                      {!isPaid && (
                        <div className="opacity-85">
                          <b>Outstanding:</b> {formatMoney(outstanding)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-end justify-between gap-3 md:min-w-60">
                    <div className="text-left md:text-right">
                      <div className="text-sm opacity-70">Price:</div>
                      <div className="text-xl font-bold">{formatMoney(b.price)}</div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      {!isPaid && (
                        <button
                          type="button"
                          onClick={() => setPayNowBooking(b)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white border border-primary hover:bg-primary/90 transition"
                        >
                          Pay Now
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={!allow}
                        onClick={() => {
                          if (!allow) return toast.error("Reschedule is only allowed 24 hours before.");
                          router.push(`/bookings?reschedule=1&bookingId=${b._id}`);
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                          allow
                            ? "bg-primary text-white border-border-color hover:bg-base-200"
                            : "bg-base-200 border-border-color opacity-60 cursor-not-allowed"
                        }`}
                        title={allow ? "Reschedule" : "Locked within 24 hours"}
                      >
                        <FiEdit3 />
                        Reschedule
                      </button>

                      {!allow && (
                        <p className="hidden md:block text-xs opacity-60 text-right">
                          Locked: within 24 hours of the booking time.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {!allow && (
                  <p className="md:hidden text-xs opacity-60 text-right mt-2">
                    Locked: within 24 hours of the booking time.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {payNowBooking && (
        <Elements stripe={stripePromise}>
          <UserPayNowModal
            booking={payNowBooking}
            user={user}
            onClose={() => setPayNowBooking(null)}
            onSuccess={async () => {
              await queryClient.invalidateQueries({ queryKey: ["bookings", user?.email] });
              setPayNowBooking(null);
              toast.success("Payment saved");
            }}
          />
        </Elements>
      )}
    </>
  );
}


function UserPayNowModal({ booking, user, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const queryClient = useQueryClient();

  const bookingId = oid(booking?._id);
  const [emailInvoice, setEmailInvoice] = useState(true);
  const [loading, setLoading] = useState(false);

  const price = Number(booking?.price || 0);
  const alreadyPaid = Number(booking?.paidAmount || 0);
  const outstanding = Number(
    booking?.outstanding ?? Math.max(0, price - alreadyPaid)
  );

  const handlePayNow = async () => {
    if (outstanding <= 0) {
      return toast.error("This booking is already paid");
    }

    setLoading(true);
    try {
      if (!stripe || !elements) throw new Error("Stripe not ready");

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card input not ready");

      const { data } = await axios.post("/api/create-payment-intent", {
        bookingId,
        type: "booking-existing",
        amount: outstanding,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: booking?.userName || user?.name || "",
            email: booking?.userEmail || user?.email || "",
          },
        },
      });

      if (result.error) throw new Error(result.error.message);

      const paymentIntentId = result.paymentIntent?.id || null;
      const newCardAmount = Number(booking?.cardAmount || 0) + outstanding;
      const newPaidAmount = Number(booking?.paidAmount || 0) + outstanding;
      const finalOutstanding = Math.max(0, price - newPaidAmount);

      await axios.patch(`/api/bookings/${bookingId}`, {
        paymentStatus: finalOutstanding === 0 ? "paid" : "partial",
        paymentMethod: "card",
        paymentIntentId,
        cardAmount: newCardAmount,
        paidAmount: newPaidAmount,
        outstanding: finalOutstanding,
      });

      if (emailInvoice) {
        await axios.post("/api/pdf/send-paid-invoice", {
          bookingId,
          to: booking?.userEmail || user?.email,
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["bookings", user?.email],
      });

      onSuccess?.();
    } catch (err) {
      toast.error(
        err?.message || err?.response?.data?.error || "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            Make Payment
          </h2>

         
        </div>

        {/* Body */}
        <div className="px-4 py-2">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-lg">
              <p className="font-medium text-sm text-gray-800">Booking Date:</p>
              <p className="text-gray-900 text-sm">
                {new Date(booking?.bookingDate).toLocaleDateString("en-AU", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-lg">
              <p className="font-medium text-gray-800 text-sm">Total Cost:</p>
              <p className="text-gray-900 text-sm">{formatMoney(price)}</p>
            </div>
          </div>

          <div className="my-3 md:my-4 border-t border-gray-300" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-lg">
                <p className="font-medium text-gray-800 text-sm">Outstanding Amount:</p>
                <p className="text-gray-900  text-sm font-bold">{formatMoney(outstanding)}</p>
              </div>

              <div className="pt-1">
                <StripeCardInput />
              </div>

              <button
                type="button"
                onClick={handlePayNow}
                disabled={loading}
                className="mt-0 w-full bg-primary hover:bg-primary text-white font-bold md:text-lg py-2 md:py-4 rounded-md disabled:opacity-60"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </div>

            {/* Right */}
            <div className="flex flex-col justify-end">
              <div className="space-y-3 text-lg">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-800">Already Paid:</span>
                  <span className="text-gray-900">{formatMoney(alreadyPaid)}</span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-800 font-semibold">Total Card Charge:</span>
                  <span className="text-gray-900 font-semibold">
                    {formatMoney(outstanding)}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
  
    </Modal>
  );
}