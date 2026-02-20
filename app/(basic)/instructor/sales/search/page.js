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
        <div className="overflow-x-auto border border-border-color rounded-md">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Instructor</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Services</th>
                <th className="p-3 text-left">Trans #</th>
                <th className="p-3 text-left">Invoice</th>
                <th className="p-3 text-right">Cost</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.rows.map((row, idx) => (
                <tr onClick={()=>router.push("/clients")} key={idx} className={idx % 2 === 0 ? "bg-white cursor-pointer" : "bg-gray-50 cursor-pointer"}>
                  <td className="p-3">
                    {row.bookingDate ? new Date(row.bookingDate).toLocaleString("en-AU") : "—"}
                  </td>

                  <td className="p-3">
                    {row.bookingType === "manual" ? "Sale" : row.bookingType === "website" ? "Web Sale" : "—"}
                  </td>

                  <td className="p-3">{row.instructorName || row.instructorEmail || "—"}</td>
                  <td className="p-3">{row.userName || row.userEmail || "—"}</td>

                  <td className="p-3">
                    {row.serviceName ? (
                      <>
                        {row.serviceName} {row.duration ? `(${row.duration})` : ""}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-3">{row.paymentIntentId || "unpaid"}</td>

                  <td className="p-3">
                    {row.invoiceNo ? (
                      <button
                        type="button"
                        onClick={() => openInvoicePdf(row)}
                        className="text-primary font-semibold hover:underline"
                        title={row.invoiceKey || ""}
                      >
                        #{row.invoiceNo}
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-3 text-right">
                    ${Number(row.total ?? row.price ?? 0).toFixed(2)}
                  </td>

                  <td className="p-3 font-semibold text-primary">
                    {row.status || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
