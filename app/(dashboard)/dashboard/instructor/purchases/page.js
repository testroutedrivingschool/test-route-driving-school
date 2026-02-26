"use client";

import { useUserData } from "@/app/hooks/useUserData";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { GoPackage, GoPerson } from "react-icons/go";
import {  FiCalendar, FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";

// Simple Status Badge
function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  
  const styles = {
    pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500", label: "Pending" },
    confirmed: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500", label: "Confirmed" },
    completed: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary", label: "Completed" },
    cancelled: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500", label: "Cancelled" }
  };

  const style = styles[s] || styles.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
      {style.label}
    </span>
  );
}

// Simple Package Item
function PackageItem({ pkg }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 p-2">
      <div className="flex-1">
        <p className="font-medium text-gray-800">{pkg.packageName}</p>
        <p className="text-xs text-gray-500">
          {pkg.duration} • {pkg.remainingLessons}/{pkg.totalLessons} lessons 
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">${pkg.lineTotal}</p>
        <p className="text-xs text-gray-500">${pkg.unitPrice} × {pkg.quantity}</p>
      </div>
    </div>
  );
}

export default function InstructorPurchase() {
  const { data: user, isLoading: isUserLoading } = useUserData();
  const [downloadingId, setDownloadingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const queryClient = useQueryClient();

  // Fetch purchases
  const { data: purchases = [], isLoading } = useQuery({
    queryKey: ["purchases", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/api/purchases?instructorEmail=${user.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  // Filter purchases
  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesSearch = searchTerm === "" || 
        p.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.invoiceNo?.toString().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [purchases, statusFilter, searchTerm]);

  // Simple stats
  const stats = {
    total: purchases.length,
    pending: purchases.filter(p => p.status === "pending").length,
    revenue: purchases.reduce((sum, p) => sum + Number(p.amount || 0), 0)
  };

  // Handle invoice download
  const handleDownloadInvoice = async (purchase) => {
    try {
      if (!purchase?.invoiceKey) return;
      setDownloadingId(purchase._id);
      const res = await axios.post("/api/storage/download-url", { key: purchase.invoiceKey });
      window.open(res?.data?.url, "_blank");
      toast.success("Invoice downloaded");
    } catch (e) {
      toast.error("Failed to download invoice");
    } finally {
      setDownloadingId(null);
    }
  };

  // Update status mutation
  const updatePurchaseStatus = useMutation({
    mutationFn: async ({ purchaseId, status }) => {
      const res = await axios.patch(`/api/purchases/${purchaseId}`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Status updated to ${variables.status}`);
      queryClient.invalidateQueries(["purchases"]);
      setSelectedPurchase(null);
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleStatusChange = (purchaseId, newStatus) => {
    updatePurchaseStatus.mutate({ purchaseId, status: newStatus });
  };

  if (isUserLoading || isLoading) return <LoadingSpinner />;

  if (!purchases.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <GoPackage className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No purchases yet</p>
          <p className="text-sm text-gray-400 mt-1">Your package sales will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <GoPackage className="text-primary" />
          Package Sales
        </h1>
        
        {/* Quick Stats */}
        <div className="flex gap-4 mt-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-border-color">
            <span className="text-xs text-gray-500">Total Sales</span>
            <p className="text-lg font-semibold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-amber-200">
            <span className="text-xs text-amber-600">Pending</span>
            <p className="text-lg font-semibold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-border-color">
            <span className="text-xs text-gray-500">Revenue</span>
            <p className="text-lg font-semibold text-green-600">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Simple Search & Filter */}
      <div className="flex gap-3 mb-6">
      
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border-color rounded-lg focus:ring-2 focus:ring-blue-200 outline-none bg-white"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Purchases List */}
      <div className="space-y-3">
        {filteredPurchases.map((purchase) => (
          <div key={purchase._id} className="bg-white rounded-lg border border-border-color overflow-hidden">
            {/* Always visible summary */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-gray-900">Purchase Package </span>
                    <StatusBadge status={purchase.status} />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <GoPerson size={14} />
                      {purchase.userName || purchase.clientName || "Student"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Quick package preview */}
                  <p className="text-sm text-gray-500 mt-2">
                    {purchase.packages?.length} package(s) • Total: ${purchase.amount}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {purchase.invoiceKey && (
                    <button
                      onClick={() => handleDownloadInvoice(purchase)}
                      disabled={downloadingId === purchase._id}
                      className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download invoice"
                    >
                      <FiDownload size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPurchase(selectedPurchase === purchase._id ? null : purchase._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      selectedPurchase === purchase._id 
                        ? 'bg-blue-100 text-primary' 
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded details - only shows when selected */}
            {selectedPurchase === purchase._id && (
              <div className="border-t border-gray-100 bg-gray-50 p-4">
                {/* Package details */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Packages</h4>
                  <div className="bg-white rounded-lg border border-border-color divide-y divide-gray-100">
                    {purchase.packages?.map((pkg, idx) => (
                      <PackageItem key={idx} pkg={pkg} />
                    ))}
                  </div>
                </div>

                {/* Status update - most important action */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Payment: <span className="font-medium capitalize">{purchase.paymentStatus}</span></p>
                    {purchase.discountAmount > 0 && (
                      <p className="text-xs text-green-600">Discount: ${purchase.discountAmount}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <select
                      value={purchase.status}
                      onChange={(e) => handleStatusChange(purchase._id, e.target.value)}
                      disabled={updatePurchaseStatus.isLoading}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* No results */}
        {filteredPurchases.length === 0 && (
          <div className="text-center py-8 bg-white rounded-lg border border-border-color">
            <p className="text-gray-500">No matching purchases</p>
            <button
              onClick={() => { setStatusFilter("all"); setSearchTerm(""); }}
              className="text-sm text-primary hover:text-blue-700 mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}