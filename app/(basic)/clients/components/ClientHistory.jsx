"use client";

import axios from "axios";
import {useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {FaFilePdf, FaPrint} from "react-icons/fa";
import {useRouter} from "next/navigation";
import { toast } from "react-toastify";

export default function ClientHistory({clientId}) {
  const [q, setQ] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const router = useRouter();
  // 1) load client to get email
  const {data: client, isLoading: loadingClient} = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const res = await axios.get(`/api/clients/${clientId}`);
      return res.data;
    },
    enabled: !!clientId,
  });

  // 2) load bookings by userEmail
  const {data: bookings = [], isLoading: loadingBookings} = useQuery({
    queryKey: ["clientBookings", client?.email],
    queryFn: async () => {
      const res = await axios.get(
        `/api/bookings?userEmail=${encodeURIComponent(client.email)}`,
      );
      return res.data;
    },
    enabled: !!client?.email,
  });
  async function downloadHistoryPdf() {
    try {
      setPdfLoading(true);

      const res = await fetch(`/api/clients/${clientId}/history-pdf`);
      if (!res.ok) throw new Error("PDF failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `client-history-${clientId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      // optional toast
      toast.error("PDF download failed");
    } finally {
      setPdfLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return bookings;

    return bookings.filter((b) => {
      const hay = [
        b.serviceName,
        b.instructorName,
        b.paymentStatus,
        b.invoiceNo,
        b.bookingType,
        b.suburb,
        b.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(term);
    });
  }, [bookings, q]);

  const summary = useMemo(() => {
    let paid = 0;
    let unpaid = 0;

    let internetCount = 0;
    let salesCount = 0;

    let internetTotal = 0;
    let salesTotal = 0;

    let totalMinutes = 0;
    let cancelledCount = 0;

    for (const b of bookings) {
      const price = Number(b.price || 0);

      // ⏱️ duration → minutes
      const mins =
        Number(b.minutes) ||
        (typeof b.duration === "string" &&
        b.duration.toLowerCase().includes("hour")
          ? Number(b.duration) * 60
          : 0);

      if (Number.isFinite(mins)) totalMinutes += mins;

      // 🌐 booking type
      const type = (b.bookingType || "").toLowerCase();
      if (type === "website") {
        internetCount += 1;
        internetTotal += price;
      } else if (type === "manual") {
        salesCount += 1;
        salesTotal += price;
      }

      // 💰 payment
      if ((b.paymentStatus || "").toLowerCase() === "paid") {
        paid += price;
      } else {
        unpaid += price;
      }

      // ❌ cancelled
      if ((b.status || "").toLowerCase() === "cancelled") {
        cancelledCount += 1;
      }
    }

    return {
      paid,
      unpaid,
      internetCount,
      salesCount,
      internetTotal,
      salesTotal,
      totalMinutes,
      totalHours: totalMinutes / 60,
      cancelledCount,
    };
  }, [bookings]);

  const bottomTotals = useMemo(() => {
    let paid = 0;
    let unpaid = 0;
    let penalty = 0; // keep 0 for now

    for (const b of filtered) {
      const price = Number(b.price || 0);

      // (Optional) ignore cancelled in totals
      if ((b.status || "").toLowerCase() === "cancelled") continue;

      if ((b.paymentStatus || "").toLowerCase() === "paid") paid += price;
      else unpaid += price;
    }

    return {paid, unpaid, penalty};
  }, [filtered]);

  if (loadingClient || loadingBookings) return <LoadingSpinner />;

  return (
    <div className="bg-white border border-border-color rounded-md  p-4">
      {/* Summary (like screenshot top section) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Bookings</h3>
          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p>
              Previous{" "}
              <span className="font-semibold">
                ({bookings.length - summary.cancelledCount})
              </span>
              :{" "}
              <span className="font-semibold">
                {summary.totalHours.toFixed(1)}h
              </span>
            </p>

            <p>
              Cancelled:{" "}
              <span className="font-semibold">{summary.cancelledCount}</span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">Purchases</h3>
          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p>
              Internet:{" "}
              <span className="font-semibold">
                {summary.internetCount} (${summary.internetTotal.toFixed(2)})
              </span>
            </p>
            <p>
              Sales:{" "}
              <span className="font-semibold">
                {summary.salesCount} (${summary.salesTotal.toFixed(2)})
              </span>
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">Account</h3>
          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <p>
              Paid:{" "}
              <span className="font-semibold">${summary.paid.toFixed(2)}</span>
            </p>
            <p>
              Unpaid:{" "}
              <span className="font-semibold">
                ${summary.unpaid.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3 flex items-center gap-3">
        {/* Search box */}
        <div className="flex w-full items-center overflow-hidden rounded-md border border-border-color bg-white">
          <div className="flex h-10 w-12 items-center justify-center border-r border-border-color bg-gray-50">
            {/* Search icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-neutral"
            >
              <path
                d="M21 21l-4.3-4.3m1.3-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="h-10 w-full px-3 outline-none"
          />
        </div>

        {/* Action icons (right side) */}
        <div className="flex items-center gap-3">
          {/* ✅ PDF/Print button */}
          <button
            type="button"
            onClick={downloadHistoryPdf}
            disabled={pdfLoading}
            className={`h-11 w-11 rounded-md border-2 border-primary text-primary flex items-center justify-center
    ${pdfLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-primary/10"}`}
            title="Download PDF"
          >
            {pdfLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <FaPrint className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-border-color rounded-md">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="text-left p-3 text-xs">Type</th>
              <th className="text-left p-3 text-xs">Date</th>
              <th className="text-left p-3 text-xs">Instructor</th>
              <th className="text-left p-3 text-xs">Service</th>
              <th className="text-left p-3 text-xs">Paid</th>
              <th className="text-left p-3 text-xs">Invoice</th>
              <th className="text-left p-3 text-xs">Cost</th>
              <th className="text-left p-3 text-xs">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={8}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr
                  onClick={() =>
                    router.push(`/instructor-bookings/${b._id}/booking`)
                  }
                  key={b._id}
                  className="border-t border-border-color text-xs font-medium cursor-pointer"
                >
                  <td className="p-3">
                    {b.bookingDate
                      ? new Date(b.bookingDate).toLocaleString("en-AU")
                      : "-"}
                  </td>
                  <td className="p-3">{b.bookingType || "Booking"}</td>
                  <td className="p-3">{b.instructorName || "-"}</td>
                  <td className="p-3">
                    {b.serviceName || "-"} {b.duration ? `(${b.duration})` : ""}
                  </td>
                  <td className="p-3">
                    {(b.paymentStatus || "").toLowerCase() === "paid"
                      ? "Yes"
                      : "No"}
                  </td>
                  <td className="p-3">
                    {b.invoiceNo ? `#${b.invoiceNo}` : "-"}
                  </td>
                  <td className="p-3">${Number(b.price || 0).toFixed(2)}</td>
                  <td className="p-3">{b.paymentStatus || "unpaid"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="px-4 py-3 text-sm">
          <div className="flex justify-end">
            <div className="w-48 space-y-1 text-right">
              <div>Paid:</div>
              <div>Unpaid:</div>
              <div>Penalty:</div>
            </div>

            <div className="w-32 space-y-1 text-right font-semibold">
              <div>${bottomTotals.paid.toFixed(2)}</div>
              <div>${bottomTotals.unpaid.toFixed(2)}</div>
              <div>${bottomTotals.penalty.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      {pdfLoading && (
        <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-[340px] h-[260px] flex flex-col items-center justify-center gap-4">
            <div className="flex space-x-2">
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-4 w-4 bg-primary rounded-full animate-bounce"></div>
            </div>
            <p className="text-gray-800 font-semibold text-lg">Generating...</p>
          </div>
        </div>
      )}
    </div>
  );
}
