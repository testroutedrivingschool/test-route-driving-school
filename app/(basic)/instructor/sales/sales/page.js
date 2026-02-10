"use client";

import {useRef, useState} from "react";
import axios from "axios"; // ✅ missing
import Container from "@/app/shared/ui/Container";
import {FaCalendarAlt, FaExclamationTriangle} from "react-icons/fa";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useRouter } from "next/navigation";

export default function ManualSalesPage() {
  const today = new Date().toISOString().slice(0, 10);
const router = useRouter()
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [description, setDescription] = useState("");
  const [searchParams, setSearchParams] = useState(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const {
    data: sales = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["manualSales", searchParams],
    enabled: !!searchParams,
    queryFn: async () => {
      const res = await axios.get("/api/sales/manual", {params: searchParams});
      return res.data;
    },
  });
 
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({
      dateFrom,
      dateTo,
      description,
    });
  };

  return (
    <section className="py-8">
      <Container>
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
          Search for Sales
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row lg:items-center gap-8"
        >
          <div className="space-y-2">
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-gray-800 font-medium">Date From:</label>
              <div className="relative cursor-pointer">
                <input
                  ref={fromRef}
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="input-class py-2!"
                />

                <FaCalendarAlt
                  onClick={() => fromRef.current?.showPicker()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-gray-800 font-medium">Date To:</label>
              <div className="relative cursor-pointer">
                <input
                  ref={toRef}
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="input-class py-2!"
                />

                <FaCalendarAlt
                  onClick={() => toRef.current?.showPicker()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-gray-800 font-medium">Description:</label>
              <input
                type="text"
                placeholder="Search for..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-class py-2!"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-[220px] h-12 bg-primary text-white font-semibold rounded-md shadow-sm disabled:opacity-60"
              disabled={isFetching}
            >
              {isFetching ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        <div className="border-t border-gray-200 my-5" />

        {/* ✅ States */}
        {!searchParams ? (
          <div className="flex items-start gap-6">
            <FaExclamationTriangle className="text-yellow-500 text-4xl mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Enter filters and click Search
              </h2>
            </div>
          </div>
        ) : isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-600">Failed to load sales</p>
        ) : sales.length === 0 ? (
          <div className="flex items-start gap-6">
            <FaExclamationTriangle className="text-yellow-500 text-4xl mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                No data found
              </h2>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto border border-border-color rounded-md">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Instructor</th>
                  <th className="p-3 text-left">Purchaser</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Products</th>
                  <th className="p-3 text-left">Invoice #</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((b, idx) => (
                  <tr
                    key={b._id}
                    onClick={()=>router.push(`/instructor-bookings/${b._id}`)}
                    className={idx % 2 === 0 ? "bg-white cursor-pointer" : "bg-gray-100 cursor-pointer"}
                  >
                    <td className="p-3">
                      {new Date(b.bookingDate).toLocaleString("en-AU")}
                    </td>
                    <td className="p-3">{b.instructorName || ""}</td>
                    <td className="p-3">{b.userName || b.clientName || "—"}</td>
                    <td className="p-3">
                      {b.userPhone || b.clientPhone || "—"}
                    </td>
                    <td className="p-3">
                      {b.serviceName} {b.duration ? `(${b.duration})` : ""}
                    </td>
                    <td className="p-3">
                      {b.invoiceNo ? `#${b.invoiceNo}` : "—"}
                    </td>
                    <td className="p-3 text-right">
                      ${Number(b.price || 0).toFixed(2)}
                    </td>
                    <td className="p-3">{b.paymentStatus || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </section>
  );
}
