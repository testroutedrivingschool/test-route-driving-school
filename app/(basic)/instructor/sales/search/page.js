"use client";

import { useState } from "react";
import axios from "axios";
import Container from "@/app/shared/ui/Container";
import { FaExclamationTriangle } from "react-icons/fa";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function SalesSearch() {
  const [query, setQuery] = useState("");

  const router = useRouter()
  const [data, setData] = useState({ mode: null, rows: [] });
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setData({ mode: null, rows: [] });

    const q = query.trim();
    if (!q) {
      setErrMsg("Type an invoice number, transaction id (pi_...), or email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get("/api/sales/search-invoice", { params: { q } });
      const payload = res.data;

      // ✅ email returns rows array
      if (payload?.searchType === "email" && Array.isArray(payload?.rows)) {
        setData({ mode: "multi", rows: payload.rows });
      } else {
        // ✅ invoice/transaction returns single object
        setData({ mode: "single", rows: [payload] });
      }
    } catch (err) {
      const status = err?.response?.status;
      const apiErr = err?.response?.data?.error;

      if (status === 404) {
        setErrMsg(`No result found for "${q}"`);
        return;
      }

      setErrMsg(apiErr || "Search failed");
    } finally {
      setLoading(false);
    }
  };
  const downloadAttachment = async (key) => {
    const {data} = await axios.post("/api/storage/download-url", {key});
    window.open(data.url, "_blank", "noopener,noreferrer");
  };
  const openInvoicePdf = (row) => {
   downloadAttachment(row.invoiceKey)
  };

  return (
    <Container className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Search for Invoice, Purchase Transaction Id, Email
      </h1>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-4xl">
        <input
          type="text"
          placeholder="Invoice #, transaction id, email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-class flex-1"
        />

        <button
          type="submit"
          className="px-8 h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md shadow-sm disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="border-t border-gray-200 my-8" />

      {loading ? (
        <LoadingSpinner />
      ) : errMsg ? (
        <div className="flex items-start gap-4">
          <FaExclamationTriangle className="text-yellow-500 text-3xl mt-1" />
          <h2 className="text-xl font-bold text-gray-900">{errMsg}</h2>
        </div>
      ) : data.mode === null ? (
        <div className="flex items-start gap-4">
          <FaExclamationTriangle className="text-yellow-500 text-3xl mt-1" />
          <h2 className="text-xl font-bold text-gray-900">No data found</h2>
        </div>
      ) : (
        <div className="w-full border border-border-color rounded-md overflow-hidden">
  <table className="w-full table-fixed text-xs sm:text-sm">
    <thead className="bg-secondary text-white">
      <tr>
        <th className="p-3 text-left w-[34%] sm:w-auto">Date</th>
        <th className="p-3 text-left w-[22%] sm:w-auto">Type</th>

        {/* hide on mobile */}
        <th className="hidden sm:table-cell p-3 text-left">Instructor</th>

        <th className="p-3 text-left w-[28%] sm:w-auto">Client</th>

        {/* hide on mobile */}
        <th className="hidden md:table-cell p-3 text-left">Services</th>
        <th className="hidden lg:table-cell p-3 text-left">Trans #</th>

        <th className="p-3 text-left w-[16%] sm:w-auto">Invoice</th>

        {/* hide on mobile */}
        <th className="hidden sm:table-cell p-3 text-right">Cost</th>

        <th className="hidden sm:table-cell p-3 text-left">Status</th>
      </tr>
    </thead>

    <tbody>
      {data.rows.map((row, idx) => {
        const dateStr =
          row.bookingDate
            ? new Date(row.bookingDate).toLocaleString("en-AU")
            : row.createdAt
              ? new Date(row.createdAt).toLocaleString("en-AU")
              : "—";
       const typeLabel =
  row.source === "purchase"
    ? "Package Purchase"
    : row.bookingType === "manual"
    ? "Sale"
    : row.bookingType === "website"
    ? "Web Sale"
    : "-";

        return (
          <tr
            key={idx}
            onClick={() => router.push("/clients")}
            className={idx % 2 === 0 ? "bg-white cursor-pointer" : "bg-gray-50 cursor-pointer"}
          >
            {/* Date (mobile shows smaller) */}
            <td className="p-3 wrap-break-word">
              <div className="leading-tight">{dateStr}</div>

              {/* mobile-only: show Cost + Status under date */}
              <div className="sm:hidden mt-1 text-[11px] text-gray-600">
                ${Number(row.total ?? row.price ?? 0).toFixed(2)} • {row.status || "—"}
              </div>
            </td>

            <td className="p-3">{typeLabel}</td>

            {/* Instructor (hidden on mobile) */}
            <td className="hidden sm:table-cell p-3 wrap-break-word">
              {row.instructorName || row.instructorEmail || "—"}
            </td>

            {/* Client */}
            <td className="p-3 wrap-break-word">
              {row.userName || row.userEmail || "—"}
            </td>

            {/* Services (hidden md down) */}
            <td className="hidden md:table-cell p-3 wrap-break-word">
              {row.serviceName
                ? `${row.serviceName}${row.duration ? ` (${row.duration})` : ""}`
                : "—"}
            </td>

            {/* Trans (hidden lg down) */}
            <td className="hidden lg:table-cell p-3 wrap-break-word">
              {row.paymentIntentId || "unpaid"}
            </td>

            {/* Invoice */}
            <td className="p-3">
              {row.invoiceNo ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openInvoicePdf(row);
                  }}
                  className="text-primary font-semibold hover:underline"
                >
                  #{row.invoiceNo}
                </button>
              ) : (
                "—"
              )}
            </td>

            {/* Cost (hidden on mobile) */}
            <td className="hidden sm:table-cell p-3 text-right">
              ${Number(row.total ?? row.price ?? 0).toFixed(2)}
            </td>

            {/* Status (hidden on mobile) */}
            <td className="hidden sm:table-cell p-3 font-semibold text-primary">
              {row.status || "—"}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
      )}
    </Container>
  );
}
