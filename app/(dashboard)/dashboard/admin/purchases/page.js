"use client";

import {useUserData} from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import React, {useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
  FiDownload,
  FiMail,
  FiSearch,
  FiUserCheck,
  FiXCircle,
} from "react-icons/fi";
import {GoPackage, GoPerson} from "react-icons/go";


const getPurchasePatchUrl = (id) => `/api/purchases/${id}`;

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function formatDate(value) {
  if (!value) return "N/A";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({status}) {
  const s = String(status || "pending").toLowerCase();

  const styles = {
    pending: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "Pending",
    },
    confirmed: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "Confirmed",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-700",
      dot: "bg-red-500",
      label: "Cancelled",
    },
  };

  const style = styles[s] || styles.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

function PaymentBadge({status}) {
  const paid = String(status || "").toLowerCase() === "paid";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        paid ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
      }`}
    >
      <FiCreditCard className="text-sm" />
      {status || "unpaid"}
    </span>
  );
}

function StatCard({label, value, tone = "default"}) {
  const toneClass =
    tone === "pending"
      ? "border-amber-200 bg-amber-50"
      : tone === "revenue"
        ? "border-green-200 bg-green-50"
        : "border-border-color bg-white";

  return (
    <div className={`px-4 py-3 rounded-xl border ${toneClass}`}>
      <span className="text-xs text-gray-500">{label}</span>
      <p
        className={`text-lg font-bold ${
          tone === "pending"
            ? "text-amber-700"
            : tone === "revenue"
              ? "text-green-700"
              : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function PackageItem({pkg}) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 border-b border-gray-100 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900 truncate">
          {pkg.packageName || "Package"}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {pkg.duration || "Duration N/A"} • {pkg.remainingLessons ?? 0}/
          {pkg.totalLessons ?? 0} lessons
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="font-bold text-gray-900">{formatMoney(pkg.lineTotal)}</p>
        <p className="text-xs text-gray-500">
          {formatMoney(pkg.unitPrice)} × {pkg.quantity || 1}
        </p>
      </div>
    </div>
  );
}

export default function AdminPurchase() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {data: user, isLoading: isUserLoading} = useUserData();

  const [downloadingId, setDownloadingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPurchaseId, setExpandedPurchaseId] = useState(null);

  const {data: purchases = [], isLoading} = useQuery({
    queryKey: ["purchases"],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get("/api/purchases");
      return res.data || [];
    },
  });

  const {data: instructors = [], isLoading: isInstructorsLoading} = useQuery({
    queryKey: ["instructors", "approved"],
    queryFn: async () => {
      const res = await axios.get("/api/instructors?status=approved");
      return res.data || [];
    },
  });

  const instructorMap = useMemo(() => {
    return new Map(instructors.map((i) => [String(i._id), i]));
  }, [instructors]);

  const filteredPurchases = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return purchases.filter((p) => {
      const status = String(p.status || "").toLowerCase();

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      const matchesSearch =
        !q ||
        String(p.userName || "")
          .toLowerCase()
          .includes(q) ||
        String(p.clientName || "")
          .toLowerCase()
          .includes(q) ||
        String(p.userEmail || "")
          .toLowerCase()
          .includes(q) ||
        String(p.invoiceNo || "").includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [purchases, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: purchases.length,
      pending: purchases.filter((p) => p.status === "pending").length,
      confirmed: purchases.filter((p) => p.status === "confirmed").length,
      cancelled: purchases.filter((p) => p.status === "cancelled").length,
      revenue: purchases.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    };
  }, [purchases]);

  const handleDownloadInvoice = async (purchase) => {
    try {
      const key =
        purchase?.invoiceKey ||
        (purchase?.invoiceNo ? `invoices/invoice-${purchase.invoiceNo}.pdf` : "");

      if (!key) return toast.error("Invoice not found");

      setDownloadingId(purchase._id);

      const res = await axios.post("/api/storage/download-url", {key});
      if (!res?.data?.url) return toast.error("Failed to get invoice URL");

      window.open(res.data.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      toast.error("Failed to open invoice");
    } finally {
      setDownloadingId(null);
    }
  };

  const updatePurchaseStatus = useMutation({
    mutationFn: async ({purchaseId, status}) => {
      const res = await axios.patch(getPurchasePatchUrl(purchaseId), {status});
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Purchase marked as ${variables.status}`);
      queryClient.invalidateQueries({queryKey: ["purchases"]});
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Failed to update status");
    },
  });


const assignInstructorMutation = useMutation({
  mutationFn: async ({purchaseId, instructorId}) => {
    const hasInstructor = !!instructorId;

    const payload = {
      instructorId: hasInstructor ? instructorId : "",
      status: hasInstructor ? "confirmed" : "pending",
    };

    const res = await axios.patch(getPurchasePatchUrl(purchaseId), payload);
    return res.data;
  },

  onSuccess: (_, variables) => {
    toast.success(
      variables.instructorId
        ? "Instructor assigned and purchase confirmed"
        : "Instructor removed and purchase moved to pending",
    );

    queryClient.invalidateQueries({queryKey: ["purchases"]});
  },

  onError: (err) => {
    toast.error(err?.response?.data?.error || "Failed to update instructor");
  },
});


  const handleStatusChange = (purchaseId, nextStatus) => {
    if (!nextStatus) return;

    if (nextStatus === "cancelled") {
      const ok = window.confirm("Are you sure you want to cancel this purchase?");
      if (!ok) return;
    }

    updatePurchaseStatus.mutate({
      purchaseId,
      status: nextStatus,
    });
  };

const handleBookSlot = (purchase) => {
  if (!purchase?.instructorId) {
    return toast.error("Please assign an instructor first");
  }

  if (purchase?.status === "cancelled") {
    return toast.error("Cancelled purchase cannot be booked");
  }

  const clientEmail =
    purchase.userEmail || purchase.billing?.email || purchase.clientEmail || "";

  const clientId = purchase.clientId || "";

  const context = {
    purchaseId: purchase._id,
    invoiceNo: purchase.invoiceNo || "",
    amount: Number(purchase.amount || 0),

    clientId,
    clientEmail,
    clientName: purchase.userName || purchase.clientName || "",
    clientPhone: purchase.billing?.mobile || "",
    clientAddress: purchase.billing?.address || "",
    clientSuburb: purchase.billing?.suburb || "",

    instructorId: purchase.instructorId,
    instructorName: purchase.instructorName || "",
    instructorEmail: purchase.instructorEmail || "",

    packages: purchase.packages || [],
  };

  sessionStorage.setItem("packageBookingContext", JSON.stringify(context));

  const params = new URLSearchParams({
    instructorId: purchase.instructorId,
    purchaseId: purchase._id,
    clientEmail,
  });

  if (clientId) {
    params.set("clientId", clientId);
  }

  router.push(`/dashboard/admin/manage-instructors-slots?${params.toString()}`);
};

  if (isUserLoading || isLoading) return <LoadingSpinner />;

  if (!purchases.length) {
    return (
      <div className="flex items-center justify-center h-72 rounded-2xl border border-border-color bg-white">
        <div className="text-center px-5">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <GoPackage className="text-4xl text-gray-300" />
          </div>
          <p className="text-gray-800 font-bold text-lg">No purchases yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Package sales will appear here when customers complete checkout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border-color bg-white shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-5 border-b border-border-color bg-linear-to-r from-white to-slate-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                <GoPackage className="text-primary" />
                Package Sales
              </h1>
              <p className="text-sm md:text-base text-gray-500 mt-1">
                Assign instructors, book slots, and manage package status.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard label="Total Sales" value={stats.total} />
          
          <StatCard label="Confirmed" value={stats.confirmed} />
          <StatCard label="Cancelled" value={stats.cancelled} />
          <StatCard
            label="Revenue"
            value={formatMoney(stats.revenue)}
            tone="revenue"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border-color bg-white shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer, email, or invoice..."
              className="w-full h-11 rounded-xl border border-border-color pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-xl border border-border-color bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Purchase Cards */}
      <div className="space-y-4">
        {filteredPurchases.map((purchase) => {
          const isExpanded = expandedPurchaseId === purchase._id;
          const assignedInstructor =
            purchase.instructorName ||
            instructorMap.get(String(purchase.instructorId))?.name ||
            "";

          const isCancelled = purchase.status === "cancelled";

          return (
            <div
              key={purchase._id}
              className={`rounded-2xl border shadow-sm overflow-hidden transition bg-white ${
                isCancelled
                  ? "border-red-200 bg-red-50/40"
                  : "border-border-color hover:shadow-md"
              }`}
            >
              {/* Card Header */}
              <div className="p-4 md:p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                        {purchase.userName || purchase.clientName || "Student"}
                      </h2>
                      <StatusBadge status={purchase.status} />
                      <PaymentBadge status={purchase.paymentStatus} />
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1 min-w-0">
                        <FiMail className="shrink-0" />
                        <span className="truncate">{purchase.userEmail}</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <FiCalendar />
                        {formatDate(purchase.createdAt)}
                      </span>

                      {purchase.invoiceNo && (
                        <span className="text-gray-400">
                          Invoice #{purchase.invoiceNo}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        {purchase.packages?.length || 0} package(s)
                      </span>

                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        {formatMoney(purchase.amount)}
                      </span>

                      {assignedInstructor && (
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          Instructor: {assignedInstructor}
                        </span>
                      )}

                      {isCancelled && (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                          This purchase is cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {purchase.invoiceKey || purchase.invoiceNo ? (
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(purchase)}
                        disabled={downloadingId === purchase._id}
                        className="h-10 px-3 rounded-xl border border-border-color bg-white text-sm font-semibold text-gray-600 hover:text-primary hover:bg-primary/5 transition flex items-center gap-2"
                      >
                        <FiDownload />
                        {downloadingId === purchase._id ? "Opening..." : "Invoice"}
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedPurchaseId(isExpanded ? null : purchase._id)
                      }
                      className={`h-10 px-3 rounded-xl text-sm font-semibold transition flex items-center gap-2 ${
                        isExpanded
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Details
                      <FiChevronDown
                        className={`transition ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Body */}
              {isExpanded && (
                <div className="border-t border-border-color bg-slate-50 p-4 md:p-5 space-y-5">
                  {/* Packages */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">
                      Purchased Packages
                    </h3>

                    <div className="bg-white border border-border-color rounded-xl divide-y divide-gray-100 overflow-hidden">
                      {purchase.packages?.length ? (
                        purchase.packages.map((pkg, idx) => (
                          <PackageItem key={`${purchase._id}-${idx}`} pkg={pkg} />
                        ))
                      ) : (
                        <div className="p-4 text-sm text-gray-500">
                          No package details found.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Controls */}
                  <div className="bg-white border border-border-color rounded-xl p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Instructor */}
<div>
  <label className="block text-sm font-bold text-gray-700 mb-2">
    Assigned Instructor
  </label>

  <select
    value={purchase.instructorId || ""}
    disabled={
      isCancelled ||
      isInstructorsLoading ||
      assignInstructorMutation.isPending
    }
    onChange={(e) => {
      if (isCancelled) {
        toast.error("Cancelled purchase cannot be assigned to an instructor");
        return;
      }

      assignInstructorMutation.mutate({
        purchaseId: purchase._id,
        instructorId: e.target.value,
      });
    }}
    className={`w-full h-11 rounded-xl border px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed
      ${
        isCancelled
          ? "border-red-200  "
          : "border-border-color bg-white "
      }`}
  >
    <option value="">
      {isCancelled ? "Cancelled - instructor disabled" : "Select Instructor"}
    </option>

    {instructors.map((inst) => (
      <option key={inst._id} value={inst._id}>
        {inst.name}
      </option>
    ))}
  </select>

  <p
    className={`mt-1 text-xs ${
      isCancelled ? "text-red-500" : "text-gray-500"
    }`}
  >
    {isCancelled
      ? "This purchase is cancelled."
      : "You can change this if the wrong instructor was selected."}
  </p>
</div>

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Purchase Status
                        </label>

                        <select
                          value={purchase.status || "pending"}
                          disabled={updatePurchaseStatus.isPending}
                          onChange={(e) =>
                            handleStatusChange(purchase._id, e.target.value)
                          }
                          className={`w-full h-11 rounded-xl border px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-gray-100 ${
                            purchase.status === "cancelled"
                              ? "border-red-200 bg-red-50 text-red-700"
                              : purchase.status === "confirmed"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-border-color bg-white text-gray-700"
                          }`}
                        >
                          <option value="pending" disabled>
                            Pending
                          </option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <p className="mt-1 text-xs text-gray-500">
                          Only confirmed purchases should be booked.
                        </p>
                      </div>

                      {/* Book Slot */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Slot Booking
                        </label>

                        <button
                          type="button"
                          onClick={() => handleBookSlot(purchase)}
                          disabled={!purchase.instructorId || isCancelled}
                          className={`w-full h-11 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
                            !purchase.instructorId || isCancelled
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-primary text-white hover:bg-primary/90"
                          }`}
                        >
                          <FiUserCheck />
                          Book Slot
                        </button>

                        <p className="mt-1 text-xs text-gray-500">
                          Assign an instructor first, then book a slot.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Billing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-white border border-border-color rounded-xl p-3">
                      <div className="text-xs text-gray-500">Payment</div>
                      <div className="font-bold capitalize">
                        {purchase.paymentStatus || "N/A"}
                      </div>
                    </div>

                    <div className="bg-white border border-border-color rounded-xl p-3">
                      <div className="text-xs text-gray-500">Method</div>
                      <div className="font-bold capitalize">
                        {purchase.paymentMethod || "N/A"}
                      </div>
                    </div>

                    <div className="bg-white border border-border-color rounded-xl p-3">
                      <div className="text-xs text-gray-500">Discount</div>
                      <div className="font-bold text-green-700">
                        {formatMoney(purchase.discountAmount)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredPurchases.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-border-color">
            <p className="text-gray-600 font-semibold">No matching purchases</p>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setSearchTerm("");
              }}
              className="text-sm text-primary hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}