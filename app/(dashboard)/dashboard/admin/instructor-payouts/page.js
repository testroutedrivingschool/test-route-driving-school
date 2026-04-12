"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import Modal from "@/app/shared/ui/Modal";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import {
  FaCheckCircle,
  FaSearch,
  FaUniversity,
  FaWallet,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { FaArrowTrendUp, FaCircleXmark } from "react-icons/fa6";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatSize(bytes) {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes}b`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}kb`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}mb`;
}

function StatusBadge({ paid, hasBookings }) {
  if (!hasBookings) {
    return (
      <span className="inline-flex items-center gap-2 px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-600">
        No bookings
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 text-xs rounded-full font-medium ${
        paid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {paid ? <FaCheckCircle /> : <FaCircleXmark />}
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}

function SummaryCard({ title, value, subtitle, icon, valueClass = "" }) {
  return (
    <div className="bg-white rounded-xl border border-border-color shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className={`mt-2 text-3xl font-bold ${valueClass}`}>{value}</h3>
          {subtitle ? <p className="mt-1 text-xs text-gray-400">{subtitle}</p> : null}
        </div>
        <div className="h-11 w-11 rounded-xl bg-base-300 flex items-center justify-center text-neutral">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function InstructorPayoutsPage() {
  const queryClient = useQueryClient();
  const proofInputRef = useRef(null);

  const [selectedPayout, setSelectedPayout] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchText, setSearchText] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [updatingKey, setUpdatingKey] = useState("");
  const [proofUploading, setProofUploading] = useState(false);
const [payModalOpen, setPayModalOpen] = useState(false);
const [payingRow, setPayingRow] = useState(null);
const [paymentProofFile, setPaymentProofFile] = useState(null);
const [paymentProofPreviewName, setPaymentProofPreviewName] = useState("");
  const { data: monthOptions = [], isLoading: monthsLoading } = useQuery({
    queryKey: ["admin-instructor-payout-months"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/instructor-payout-months");
      return res.data || [];
    },
  });

  useEffect(() => {
    if (!selectedMonth && monthOptions.length) {
      setSelectedMonth(monthOptions[0].value);
    }
  }, [monthOptions, selectedMonth]);

  const {
    data: payoutData,
    isLoading: payoutLoading,
    isFetching: payoutFetching,
  } = useQuery({
    queryKey: ["admin-instructor-payouts", selectedMonth, searchText],
    enabled: !!selectedMonth,
    queryFn: async () => {
      const res = await axios.get(
        `/api/admin/instructor-payouts?month=${selectedMonth}&search=${encodeURIComponent(
          searchText
        )}`
      );
      return res.data;
    },
  });

  const payoutRows = payoutData?.rows || [];
  const stats = payoutData?.stats || {
    totalRevenue: 0,
    totalPayout: 0,
    totalCompany: 0,
    totalBookings: 0,
    paidCount: 0,
    unpaidCount: 0,
    noBookingCount: 0,
  };
const openPaidModal = (row) => {
  if (!row.hasBookings) {
    toast.error("This instructor has no eligible bookings for this month");
    return;
  }

  setPayingRow(row);
  setPaymentNote(row.paymentNote || "");
  setPaymentProofFile(null);
  setPaymentProofPreviewName("");
  setPayModalOpen(true);
};
const handleConfirmPaid = async () => {
  if (!payingRow) return;

  if (!paymentNote.trim()) {
    toast.error("Please add a payment note or reference");
    return;
  }

  if (!paymentProofFile) {
    toast.error("Please upload payment proof");
    return;
  }

  try {
    setUpdatingKey(`${payingRow.instructorId}-${payingRow.monthKey}`);
    setProofUploading(true);

    const folder =
      paymentProofFile.type === "application/pdf" ? "documents" : "images";

    const { data: up } = await axios.post("/api/storage/upload-url", {
      fileName: paymentProofFile.name,
      fileType: paymentProofFile.type,
      fileSize: paymentProofFile.size,
      folder,
    });

    await axios.put(up.uploadUrl, paymentProofFile, {
      headers: {
        "Content-Type": paymentProofFile.type,
      },
    });

    await axios.patch("/api/payouts/update", {
      instructorId: payingRow.instructorId,
      instructorEmail: payingRow.instructorEmail,
      instructorName: payingRow.instructorName,
      monthKey: payingRow.monthKey,
      monthLabel: payingRow.monthLabel,
      totalRevenue: payingRow.totalRevenue,
      instructorPayout: payingRow.instructorPayout,
      companyCut: payingRow.companyCut,
      bookingsCount: payingRow.bookingsCount,
      isPaid: true,
      paymentNote: paymentNote.trim(),
      paymentProofKey: up.key,
      paymentProofName: paymentProofFile.name,
      paymentProofSize: paymentProofFile.size,
    });

    await queryClient.invalidateQueries({
      queryKey: ["admin-instructor-payouts", selectedMonth, searchText],
    });

    if (
      selectedPayout &&
      selectedPayout.instructorId === payingRow.instructorId &&
      selectedPayout.monthKey === payingRow.monthKey
    ) {
      setSelectedPayout((prev) =>
        prev
          ? {
              ...prev,
              isPaid: true,
              paidAt: new Date().toISOString(),
              paymentNote: paymentNote.trim(),
              paymentProofKey: up.key,
              paymentProofName: paymentProofFile.name,
              paymentProofSize: paymentProofFile.size,
              paymentProofUploadedAt: new Date().toISOString(),
            }
          : prev
      );
    }

    toast.success("Payout marked as paid");
    setPayModalOpen(false);
    setPayingRow(null);
    setPaymentProofFile(null);
    setPaymentProofPreviewName("");
    setPaymentNote("");
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to complete payout");
  } finally {
    setUpdatingKey("");
    setProofUploading(false);
  }
};
  const handleUpdatePayout = async (row, markAsPaid) => {
  try {
    if (markAsPaid && !row.paymentProofKey) {
      toast.error("Please upload payment proof before marking as paid");
      return;
    }

    setUpdatingKey(`${row.instructorId}-${row.monthKey}`);

    await axios.patch("/api/payouts/update", {
      instructorId: row.instructorId,
      instructorEmail: row.instructorEmail,
      instructorName: row.instructorName,
      monthKey: row.monthKey,
      monthLabel: row.monthLabel,
      totalRevenue: row.totalRevenue,
      instructorPayout: row.instructorPayout,
      companyCut: row.companyCut,
      bookingsCount: row.bookingsCount,
      isPaid: markAsPaid,
      paymentNote: paymentNote || row.paymentNote || "",
      paymentProofKey: row.paymentProofKey || "",
      paymentProofName: row.paymentProofName || "",
      paymentProofSize: row.paymentProofSize || 0,
    });

    await queryClient.invalidateQueries({
      queryKey: ["admin-instructor-payouts", selectedMonth, searchText],
    });

    setSelectedPayout((prev) =>
      prev
        ? {
            ...prev,
            isPaid: markAsPaid,
            paidAt: markAsPaid ? new Date().toISOString() : null,
            paymentNote: paymentNote || prev.paymentNote || "",
          }
        : prev
    );

    toast.success(markAsPaid ? "Payout marked as paid" : "Payout marked as unpaid");
  } catch (error) {
    toast.error(error.response?.data?.error || "Failed to update payout status");
  } finally {
    setUpdatingKey("");
  }
};

  const handleUploadPaymentProof = async (file) => {
    if (!file || !selectedPayout) return;

    try {
      setProofUploading(true);

      const folder = file.type === "application/pdf" ? "documents" : "images";

      const { data: up } = await axios.post("/api/storage/upload-url", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        folder,
      });

      await axios.put(up.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      await axios.patch("/api/payouts/update", {
        instructorId: selectedPayout.instructorId,
        instructorEmail: selectedPayout.instructorEmail,
        instructorName: selectedPayout.instructorName,
        monthKey: selectedPayout.monthKey,
        monthLabel: selectedPayout.monthLabel,
        totalRevenue: selectedPayout.totalRevenue,
        instructorPayout: selectedPayout.instructorPayout,
        companyCut: selectedPayout.companyCut,
        bookingsCount: selectedPayout.bookingsCount,
        isPaid: true,
        paymentNote: paymentNote || selectedPayout.paymentNote || "",
        paymentProofKey: up.key,
        paymentProofName: file.name,
        paymentProofSize: file.size,
      });

      await queryClient.invalidateQueries({
        queryKey: ["admin-instructor-payouts", selectedMonth, searchText],
      });

      setSelectedPayout((prev) =>
        prev
          ? {
              ...prev,
              isPaid: true,
              paidAt: new Date().toISOString(),
              paymentProofKey: up.key,
              paymentProofName: file.name,
              paymentProofSize: file.size,
              paymentProofUploadedAt: new Date().toISOString(),
            }
          : prev
      );

      toast.success("Payment proof uploaded");
    } catch (err) {
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to upload payment proof"
      );
    } finally {
      setProofUploading(false);
    }
  };

  const openPaymentProof = async (key) => {
    try {
      const { data } = await axios.post("/api/storage/download-url", { key });
      if (data?.url) window.open(data.url, "_blank", "noopener,noreferrer");
      else toast.error("Failed to get proof file");
    } catch (err) {
      toast.error("Failed to open proof file");
    }
  };

  if (monthsLoading || payoutLoading || !selectedMonth) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Instructor Payouts</h1>
        <p className="text-neutral mt-2">
          Review monthly payouts, bank information, payment status and payment proof
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-7 mb-6">
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Eligible bookings"
          icon={<FaWallet />}
        />
        <SummaryCard
          title="Instructor Payouts"
          value={formatCurrency(stats.totalPayout)}
          subtitle="90% share"
          icon={<FaUniversity />}
          valueClass="text-green-700"
        />
        <SummaryCard
          title="Company Share"
          value={formatCurrency(stats.totalCompany)}
          subtitle="10% share"
          icon={<FaArrowTrendUp />}
          valueClass="text-blue-700"
        />
        <SummaryCard
          title="Bookings"
          value={stats.totalBookings}
          subtitle="Included in payout"
          icon={<FaRegCalendarAlt />}
        />
        <SummaryCard
          title="Paid"
          value={stats.paidCount}
          subtitle="Completed"
          icon={<FaCheckCircle />}
          valueClass="text-green-700"
        />
        <SummaryCard
          title="Unpaid"
          value={stats.unpaidCount}
          subtitle="Pending"
          icon={<FaCircleXmark />}
          valueClass="text-yellow-700"
        />
        
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border-color p-4 mb-6">
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <label className="mb-2 block text-sm font-medium">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-border-color rounded-lg px-3 py-3 text-sm bg-white"
            >
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Search Instructor</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by name or email"
                className="w-full border border-border-color rounded-lg pl-10 pr-3 py-3 text-sm bg-white"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          {payoutFetching ? "Refreshing..." : ""}
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-border-color overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-base-300">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Instructor</th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Month</th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Total Revenue</th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Instructor Payout</th>
               
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Status</th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Proof</th>
                <th className="py-3 px-6 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-color">
              {payoutRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 px-6 text-center text-gray-500">
                    No payout records found
                  </td>
                </tr>
              ) : (
                payoutRows.map((row) => {
                  const rowKey = `${row.instructorId}-${row.monthKey}`;
                  const isUpdating = updatingKey === rowKey;

                  return (
                    <tr key={rowKey} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium">{row.instructorName}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <FiMail className="text-gray-400" />
                          {row.instructorEmail}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {row.hasBookings ? `${row.bookingsCount} bookings` : "No bookings"}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-medium">{row.monthLabel}</div>
                        {row.paidAt ? (
                          <div className="text-xs text-gray-500 mt-1">
                            Paid at: {formatDate(row.paidAt)}
                          </div>
                        ) : null}
                      </td>

                      <td className="py-4 px-6 font-medium">
                        {formatCurrency(row.totalRevenue)}
                      </td>

                      <td className="py-4 px-6 font-medium text-green-700">
                        {formatCurrency(row.instructorPayout)}
                      </td>

                      

                      <td className="py-4 px-6">
                        <StatusBadge paid={row.isPaid} hasBookings={row.hasBookings} />
                      </td>

                      <td className="py-4 px-6">
                        {row.paymentProofKey ? (
                          <button
                            type="button"
                            className="text-primary hover:underline text-sm"
                            onClick={() => openPaymentProof(row.paymentProofKey)}
                          >
                            View Proof
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">No proof</span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          <PrimaryBtn
                            className="text-sm px-3! py-2!"
                            onClick={() => {
                              setSelectedPayout(row);
                              setPaymentNote(row.paymentNote || "");
                            }}
                          >
                            Manage
                          </PrimaryBtn>

                        {row.isPaid ? (
  <PrimaryBtn
    className="bg-red-500 text-sm px-3! py-2!"
    onClick={() => handleUpdatePayout(row, false)}
    disabled={isUpdating || !row.hasBookings}
  >
    Unpaid
  </PrimaryBtn>
) : (
  <PrimaryBtn
    className="bg-green-600 text-sm px-3! py-2!"
    onClick={() => openPaidModal(row)}
    disabled={isUpdating || !row.hasBookings}
  >
    Paid
  </PrimaryBtn>
)}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {payoutRows.length === 0 ? (
          <div className="bg-white rounded-xl border border-border-color shadow-sm p-4 text-center text-gray-500">
            No payout records found
          </div>
        ) : (
          payoutRows.map((row) => {
            const rowKey = `${row.instructorId}-${row.monthKey}`;
            const isUpdating = updatingKey === rowKey;

            return (
              <div
                key={rowKey}
                className="bg-white rounded-xl border border-border-color shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{row.instructorName}</div>
                    <div className="text-sm text-gray-700 truncate flex items-center gap-2 mt-1">
                      <FiMail className="text-gray-400 shrink-0" />
                      <span className="truncate">{row.instructorEmail}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{row.monthLabel}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {row.hasBookings ? `${row.bookingsCount} bookings` : "No bookings"}
                    </div>
                  </div>
                  <StatusBadge paid={row.isPaid} hasBookings={row.hasBookings} />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-gray-500 text-xs">Total Revenue</div>
                    <div className="font-semibold">{formatCurrency(row.totalRevenue)}</div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <div className="text-green-700 text-xs">Instructor Payout</div>
                    <div className="font-semibold text-green-700">
                      {formatCurrency(row.instructorPayout)}
                    </div>
                  </div>
                  
                  <div className="rounded-lg bg-gray-50 p-3">
                    <div className="text-gray-500 text-xs">Proof</div>
                     {row.paymentProofKey ?<button
                            type="button"
                            className="text-primary hover:underline text-sm"
                            onClick={() => openPaymentProof(row.paymentProofKey)}
                          >
                            View Proof
                          </button>:"No Proof"}
                    
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <PrimaryBtn
                    className="text-sm w-full justify-center! py-2!"
                    onClick={() => {
                      setSelectedPayout(row);
                      setPaymentNote(row.paymentNote || "");
                    }}
                  >
                    Manage
                  </PrimaryBtn>

                 {row.isPaid ? (
  <PrimaryBtn
    className="bg-red-500 text-sm w-full justify-center! py-2!"
    onClick={() => handleUpdatePayout(row, false)}
    disabled={isUpdating || !row.hasBookings}
  >
    Unpaid
  </PrimaryBtn>
) : (
  <PrimaryBtn
    className="bg-green-600 text-sm w-full justify-center! py-2!"
    onClick={() => openPaidModal(row)}
    disabled={isUpdating || !row.hasBookings}
  >
    Paid
  </PrimaryBtn>
)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedPayout && (
        <Modal onClose={() => setSelectedPayout(null)} className="max-w-5xl">
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-bold">{selectedPayout.instructorName}</h2>
                <p className="text-gray-500">{selectedPayout.instructorEmail}</p>
                <div className="mt-2">
                  <StatusBadge
                    paid={selectedPayout.isPaid}
                    hasBookings={selectedPayout.hasBookings}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <div><b>Month:</b> {selectedPayout.monthLabel}</div>
                <div><b>Paid At:</b> {selectedPayout.paidAt ? formatDate(selectedPayout.paidAt) : "-"}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border-color rounded-xl p-4 bg-white">
                <h3 className="font-bold text-lg text-neutral">Monthly Calculation</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <p><b>Total Revenue:</b> {formatCurrency(selectedPayout.totalRevenue)}</p>
                  <p><b>Instructor 90%:</b> <span className="text-green-700 font-semibold">{formatCurrency(selectedPayout.instructorPayout)}</span></p>
                  <p><b>Company 10%:</b> <span className="text-blue-700 font-semibold">{formatCurrency(selectedPayout.companyCut)}</span></p>
                  <p><b>Bookings:</b> {selectedPayout.bookingsCount}</p>
                  {!selectedPayout.hasBookings ? (
                    <p className="text-gray-500">No eligible bookings for this month.</p>
                  ) : null}
                </div>
              </div>

              <div className="border border-border-color rounded-xl p-4 bg-white">
                <h3 className="font-bold text-lg text-neutral">Bank Details</h3>
                {selectedPayout.financial ? (
                  <div className="mt-3 space-y-2 text-sm">
                    <p><b>Account Name:</b> {selectedPayout.financial.accountName || "N/A"}</p>
                    <p><b>BSB Number:</b> {selectedPayout.financial.bsbNumber || "N/A"}</p>
                    <p><b>Account Number:</b> {selectedPayout.financial.accountNumber || "N/A"}</p>
                    <p><b>User ID:</b> {selectedPayout.financial.userId || "N/A"}</p>
                    <p><b>Instructor ID:</b> {selectedPayout.financial.instructorId || "N/A"}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-red-500">No financial information found</p>
                )}
              </div>
            </div>

            <div className="mt-6 border border-border-color rounded-xl p-4 bg-white">
              <h3 className="font-bold text-lg text-neutral">Payment Update</h3>

              <div className="mt-3">
                <label className="block text-sm font-medium mb-2">Payment Note / Reference</label>
                <textarea
                  rows={4}
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="Bank transfer reference, payout note, receipt info..."
                  className="w-full border rounded-lg px-3 py-3 text-sm bg-white"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Payment Screenshot / Proof</label>

                <input
                  ref={proofInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    handleUploadPaymentProof(file);
                  }}
                />

                <div className="flex flex-wrap gap-3">
                  <PrimaryBtn
                    className="text-sm px-4! py-2!"
                    onClick={() => proofInputRef.current?.click()}
                    disabled={proofUploading || !selectedPayout.hasBookings}
                  >
                    {proofUploading ? "Uploading..." : "Upload Proof"}
                  </PrimaryBtn>

                  {selectedPayout.paymentProofKey ? (
                    <PrimaryBtn
                      className="bg-secondary text-sm px-4! py-2!"
                      onClick={() => openPaymentProof(selectedPayout.paymentProofKey)}
                    >
                      View Proof
                    </PrimaryBtn>
                  ) : null}
                </div>

                {selectedPayout.paymentProofKey ? (
                  <div className="mt-3 text-sm text-gray-500">
                    <div><b>File:</b> {selectedPayout.paymentProofName || "Uploaded file"}</div>
                    <div><b>Size:</b> {formatSize(selectedPayout.paymentProofSize)}</div>
                    <div>
                      <b>Uploaded At:</b>{" "}
                      {selectedPayout.paymentProofUploadedAt
                        ? formatDate(selectedPayout.paymentProofUploadedAt)
                        : "-"}
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">No payment proof uploaded yet.</p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
               {selectedPayout.isPaid ? (
  <PrimaryBtn
    className="bg-red-500 text-sm px-4! py-2!"
    onClick={() => handleUpdatePayout(selectedPayout, false)}
    disabled={
      updatingKey === `${selectedPayout.instructorId}-${selectedPayout.monthKey}` ||
      !selectedPayout.hasBookings
    }
  >
    Mark as Unpaid
  </PrimaryBtn>
) : (
  <PrimaryBtn
    className="bg-green-600 text-sm px-4! py-2!"
    onClick={() => openPaidModal(selectedPayout)}
    disabled={!selectedPayout.hasBookings}
  >
    Open Paid Form
  </PrimaryBtn>
)}
              </div>
            </div>

            <div className="mt-6 border border-border-color rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-lg text-neutral">Included Bookings</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-base-300">
                  {selectedPayout.bookings.length} items
                </span>
              </div>

              <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">
                {selectedPayout.bookings.length === 0 ? (
                  <div className="text-sm text-gray-500">No bookings for this month.</div>
                ) : (
                  selectedPayout.bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-border-color rounded-lg p-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <div className="font-semibold">{booking.serviceName || "-"}</div>
                          <div className="text-sm text-gray-500">
                            {booking.clientName || "-"} •{" "}
                            {booking.bookingDate
                              ? new Date(booking.bookingDate).toLocaleDateString("en-AU")
                              : "-"}
                          </div>
                        </div>
                        <div className="text-sm sm:text-right">
                          <div className="font-semibold">{formatCurrency(booking.price)}</div>
                          <div className="text-gray-500">{booking.paymentStatus || "-"}</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
      {payModalOpen && payingRow && (
  <Modal
    onClose={() => {
      setPayModalOpen(false);
      setPayingRow(null);
      setPaymentProofFile(null);
      setPaymentProofPreviewName("");
    }}
    className="max-w-2xl"
  >
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Confirm Instructor Payment</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload payment proof and confirm payout for this instructor.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-border-color rounded-xl p-4 bg-white">
          <p className="text-xs text-gray-500 uppercase mb-1">Instructor</p>
          <p className="font-semibold">{payingRow.instructorName}</p>
          <p className="text-sm text-gray-500">{payingRow.instructorEmail}</p>
        </div>

        <div className="border border-border-color rounded-xl p-4 bg-white">
          <p className="text-xs text-gray-500 uppercase mb-1">Month</p>
          <p className="font-semibold">{payingRow.monthLabel}</p>
          <p className="text-sm text-gray-500">{payingRow.bookingsCount} bookings</p>
        </div>

        <div className="border border-border-color rounded-xl p-4 bg-white">
          <p className="text-xs text-gray-500 uppercase mb-1">Total Revenue</p>
          <p className="font-semibold">{formatCurrency(payingRow.totalRevenue)}</p>
        </div>

        <div className="border border-border-color rounded-xl p-4 bg-white">
          <p className="text-xs text-gray-500 uppercase mb-1">Instructor Payout</p>
          <p className="font-semibold text-green-700">
            {formatCurrency(payingRow.instructorPayout)}
          </p>
        </div>
      </div>

      <div className="mt-5 border border-border-color rounded-xl p-4 bg-white">
        <label className="block text-sm font-medium mb-2">Payment Note / Reference</label>
        <textarea
          rows={4}
          value={paymentNote}
          onChange={(e) => setPaymentNote(e.target.value)}
          placeholder="Bank transfer reference, receipt number, note..."
          className="w-full border border-border-color rounded-lg px-3 py-3 text-sm bg-white"
        />
      </div>

      <div className="mt-5 border border-border-color rounded-xl p-4 bg-white">
        <label className="block text-sm font-medium mb-2">
          Upload Payment Proof <span className="text-red-500">*</span>
        </label>

        <input
          ref={proofInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) {
              setPaymentProofFile(file);
              setPaymentProofPreviewName(file.name);
            }
          }}
        />

        <div className="flex flex-wrap gap-3">
          <PrimaryBtn
            className="text-sm px-4! py-2!"
            onClick={() => proofInputRef.current?.click()}
            disabled={proofUploading}
          >
            Choose File
          </PrimaryBtn>
        </div>

        {paymentProofPreviewName ? (
          <div className="mt-3 text-sm text-gray-600">
            <div><b>Selected:</b> {paymentProofPreviewName}</div>
            {paymentProofFile ? (
              <div><b>Size:</b> {formatSize(paymentProofFile.size)}</div>
            ) : null}
          </div>
        ) : (
          <p className="mt-3 text-sm text-red-500">
            Payment proof is required before confirming paid.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <PrimaryBtn
          className="bg-green-600 text-sm px-4! py-2!"
          onClick={handleConfirmPaid}
          disabled={
            proofUploading ||
            updatingKey === `${payingRow.instructorId}-${payingRow.monthKey}`
          }
        >
          {proofUploading ? "Uploading..." : "Confirm Paid"}
        </PrimaryBtn>

        <PrimaryBtn
          className="bg-gray-500 text-sm px-4! py-2!"
          onClick={() => {
            setPayModalOpen(false);
            setPayingRow(null);
            setPaymentProofFile(null);
            setPaymentProofPreviewName("");
          }}
        >
          Cancel
        </PrimaryBtn>
      </div>
    </div>
  </Modal>
)}
    </div>
  );
}


