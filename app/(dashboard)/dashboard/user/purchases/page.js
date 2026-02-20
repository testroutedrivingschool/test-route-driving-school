"use client";

import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import React, {useMemo, useState} from "react";
import {GoPackage} from "react-icons/go";
import {FiDownload} from "react-icons/fi";
import { toast } from "react-toastify";

function StatusPill({status}) {
  const s = String(status || "").toLowerCase();

  const cls =
    s === "confirmed"
      ? "bg-green-100 text-green-700 border-green-200"
      : s === "pending"
        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
        : "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${cls}`}
    >
      {s ? s.toUpperCase() : "—"}
    </span>
  );
}

export default function UserPurchase() {
  const {data: user, isLoading: isUserLoading} = useUserData();
  const [downloadingId, setDownloadingId] = useState(null);

  const {data: purchases = [], isLoading} = useQuery({
    queryKey: ["purchases", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/purchases?userEmail=${user.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  const totalPrice = useMemo(() => {
    return purchases.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  }, [purchases]);

  const handleDownloadInvoice = async (purchase) => {
    try {
      if (!purchase?.invoiceKey) return;

      setDownloadingId(purchase._id);

      const res = await axios.post("/api/storage/download-url", {
        key: purchase.invoiceKey,
      });

      const url = res?.data?.url;
      if (!url) throw new Error("Download URL not found");

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
    
      toast.error(
        e?.response?.data?.error || e?.message || "Failed to download invoice",
      );
    } finally {
      setDownloadingId(null);
    }
  };

  if (isUserLoading || isLoading) return <LoadingSpinner />;

  if (!purchases.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mb-3">
            <GoPackage className="text-2xl" />
          </div>
          <p className="font-medium">No Purchase found.</p>
          <p className="text-sm opacity-70 mt-1">
            Your package purchases will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-color bg-white shadow">
      {/* Header */}
      <div className="p-6 border-b border-border-color flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GoPackage className="text-xl" />
          <h2 className="text-xl font-bold">Purchases</h2>
        </div>

        <div className="text-right">
          <div className="text-xs opacity-70">Total spent</div>
          <div className="text-lg font-bold">${totalPrice.toFixed(2)}</div>
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-4">
        {purchases.map((p) => {
          const pkgNames = (p.packages || [])
            .map((x) => x?.packageName)
            .filter(Boolean);

          const createdAt = p.createdAt
            ? new Date(p.createdAt).toLocaleString()
            : "";

          return (
            <div
              key={p._id}
              className="rounded-xl border border-border-color bg-base-100 p-5 "
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                {/* Left */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      Package Purchase{" "}
                     
                    </h3>
                    <StatusPill status={p.status} />
                  </div>

                  <div>
                    <span className="font-bold">Instructor:</span>{" "}
                    {p.instructorName || "—"}
                  </div>
                  <div className="flex gap-2">
                    <h2 className="font-bold">Payment Status:</h2>{" "}
                    <span>{String(p.paymentStatus || "—").toUpperCase()}</span>
                  </div>

                  {createdAt && (
                    <div className="text-xs opacity-70">
                      Purchased: {createdAt}
                    </div>
                  )}

                  {/* Packages chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {pkgNames.length ? (
                      pkgNames.map((name, idx) => (
                        <span
                          key={`${p._id}-${idx}`}
                          className="px-3 py-1 rounded-full text-xs border border-border-color bg-base-200"
                        >
                          {name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm opacity-60">
                        No package details
                      </span>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="flex md:flex-col items-end justify-between gap-3 md:min-w-[220px]">
                  <div className="text-right">
                    <div className="text-xs opacity-70">Total</div>
                    <div className="text-xl font-bold">
                      ${Number(p.amount || 0).toFixed(2)}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!p.invoiceKey || downloadingId === p._id}
                    onClick={() => handleDownloadInvoice(p)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition
                      ${
                        !p.invoiceKey
                          ? "opacity-50 cursor-not-allowed bg-base-200 border-border-color"
                          : "hover:bg-base-200 border-border-color bg-white"
                      }`}
                    title={
                      !p.invoiceKey
                        ? "Invoice not ready yet"
                        : "Download invoice"
                    }
                  >
                    <FiDownload />
                    {downloadingId === p._id
                      ? "Preparing..."
                      : "Download Invoice"}
                  </button>

                  {!p.invoiceKey && (
                    <p className="text-xs opacity-60 mt-1">
                      Invoice is processing. Try again in a moment.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
