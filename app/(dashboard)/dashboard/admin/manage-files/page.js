"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Image from "next/image";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";

const FOLDER_TABS = [
  { key: "all", label: "All" },
  { key: "invoices", label: "Invoices" },
  { key: "documents", label: "Documents" },
  { key: "images", label: "Images" },
  { key: "uploads", label: "Uploads" }, // optional
];

function bytesToKB(size = 0) {
  return (Number(size || 0) / 1024).toFixed(1);
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return "";
  }
}

function guessFolderFromKey(key = "") {
  if (!key) return "";
  const first = key.split("/")[0];
  return first || "";
}

function isImage(mimeType = "", key = "") {
  if (mimeType?.startsWith?.("image/")) return true;
  return /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(key);
}

export default function ManageFiles() {
  const queryClient = useQueryClient();

  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);
  const [minKB, setMinKB] = useState("");
  const [maxKB, setMaxKB] = useState("");

  const { data: files = [], isLoading, isError } = useQuery({
    queryKey: ["storage-files"],
    queryFn: async () => {
      const res = await axios.get("/api/storage-files");
      return res.data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (key) => {
      const res = await axios.delete(
        `/api/storage-files?key=${encodeURIComponent(key)}`
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("File deleted");
      queryClient.invalidateQueries(["instructor-files"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Delete failed");
    },
  });

  const handleDelete = async (file) => {
    const result = await Swal.fire({
      title: "Delete file?",
      text: file?.originalName || file?.key || "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;
    deleteMutation.mutate(file.key);
  };

  const openFile = async (key) => {
    try {
      const { data } = await axios.post("/api/storage/download-url", { key });
      if (data?.url) window.open(data.url, "_blank", "noopener,noreferrer");
      else toast.error("Failed to open file");
    } catch {
      toast.error("Failed to open file");
    }
  };

  // Normalize folder
  const normalized = useMemo(() => {
    return (files || []).map((f) => ({
      ...f,
      folder: f.folder || guessFolderFromKey(f.key),
    }));
  }, [files]);

  const counts = useMemo(() => {
    const c = { all: normalized.length };
    for (const t of FOLDER_TABS) {
      if (t.key === "all") continue;
      c[t.key] = normalized.filter((x) => x.folder === t.key).length;
    }
    return c;
  }, [normalized]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    const min = minKB !== "" ? Number(minKB) : null;
    const max = maxKB !== "" ? Number(maxKB) : null;

    return normalized.filter((f) => {
      // tab filter
      if (tab !== "all" && f.folder !== tab) return false;

      // text search
      if (qq) {
        const hay = `${f.originalName || ""} ${f.key || ""} ${f.folder || ""}`.toLowerCase();
        if (!hay.includes(qq)) return false;
      }

      // status filter
      if (onlyPending && (f.status || "").toLowerCase() !== "pending") return false;

      // size filter (KB)
      const kb = Number(bytesToKB(f.size));
      if (min !== null && kb < min) return false;
      if (max !== null && kb > max) return false;

      return true;
    });
  }, [normalized, tab, q, onlyPending, minKB, maxKB]);

  const grouped = useMemo(() => {
    const g = { invoices: [], documents: [], images: [], uploads: [], other: [] };
    for (const f of filtered) {
      const folder = f.folder || "other";
      if (folder === "invoices") g.invoices.push(f);
      else if (folder === "documents") g.documents.push(f);
      else if (folder === "images") g.images.push(f);
      else if (folder === "uploads") g.uploads.push(f);
      else g.other.push(f);
    }
    return g;
  }, [filtered]);

  const clearFilters = () => {
    setTab("all");
    setQ("");
    setOnlyPending(false);
    setMinKB("");
    setMaxKB("");
  };

  if (isLoading) return <LoadingSpinner/>;

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load files.
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Files</h1>
          <p className="text-gray-500 mt-1">
            Browse, filter, view, and delete files from MinIO + MongoDB.
          </p>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="self-start sm:self-auto px-3 py-2 rounded-lg border border-border-color bg-white hover:bg-gray-50 text-sm font-semibold"
        >
          Reset filters
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-5 bg-white border border-border-color rounded-xl p-2 flex flex-wrap gap-2">
        {FOLDER_TABS.map((t,idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition
              ${tab === t.key ? "bg-base-300 text-gray-900" : "bg-white hover:bg-gray-50 text-gray-600"}
            `}
          >
            {t.label}
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {t.key === "all" ? counts.all : (counts[t.key] || 0)}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-6">
          <div className="bg-white border border-border-color rounded-xl p-3">
            <label className="text-xs font-semibold text-gray-600">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, folder, or key..."
              className="mt-2 w-full border border-border-color rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-base-300"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-border-color rounded-xl p-3">
            <label className="text-xs font-semibold text-gray-600">Size (KB)</label>
            <div className="mt-2 flex gap-2">
              <input
                value={minKB}
                onChange={(e) => setMinKB(e.target.value)}
                inputMode="numeric"
                placeholder="Min"
                className="w-1/2 border border-border-color rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-base-300"
              />
              <input
                value={maxKB}
                onChange={(e) => setMaxKB(e.target.value)}
                inputMode="numeric"
                placeholder="Max"
                className="w-1/2 border border-border-color rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-base-300"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-border-color rounded-xl p-3 h-full flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-gray-600">Status</div>
              <div className="text-sm text-gray-500 mt-1">Show only pending</div>
            </div>
            <input
              type="checkbox"
              checked={onlyPending}
              onChange={(e) => setOnlyPending(e.target.checked)}
              className="toggle toggle-primary"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600">
          Showing <b>{filtered.length}</b> of <b>{normalized.length}</b>
        </span>
        {tab !== "all" && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            Folder: {tab}
          </span>
        )}
        {q.trim() && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            Query: {q.trim()}
          </span>
        )}
        {onlyPending && (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
            Pending only
          </span>
        )}
      </div>

      {/* Sections */}
      <div className="mt-5 space-y-4">
        {["invoices", "documents", "images", "uploads", "other"].map((sec) => {
          const list = grouped[sec] || [];
          if (tab !== "all" && sec !== tab) {
            // when a tab is selected, show only that section
            if (sec !== "other") return null;
          }
          if (!list.length) return null;

          const title =
            sec === "invoices"
              ? "Invoices"
              : sec === "documents"
              ? "Documents"
              : sec === "images"
              ? "Images"
              : sec === "uploads"
              ? "Uploads"
              : "Other";

          return (
            <div key={sec} className="bg-white border border-border-color rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-base-300 flex items-center justify-between">
                <div className="font-bold text-gray-900">
                  {title}
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-white/70 text-gray-700">
                    {list.length}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-border-color">
                {list.map((f,idx) => (
                  <div key={idx} className="p-4 flex items-start justify-between gap-4">
                    <div className="flex gap-3 min-w-0">
                      {/* thumbnail for images */}
                      {isImage(f.mimeType, f.key) ? (
                        <div className="w-12 h-12 rounded-lg border border-border-color overflow-hidden bg-gray-50 shrink-0">
                         
                          <Image
                          width={1000}
                          height={1000}
                            src={`/api/storage/proxy?key=${encodeURIComponent(f.key)}`}
                            alt={f.originalName || "image"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg border border-border-color bg-gray-50 shrink-0 flex items-center justify-center text-xs text-gray-500">
                          {sec === "invoices" ? "PDF" : sec === "documents" ? "DOC" : "FILE"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {f.originalName || "Unnamed file"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 break-all">
                          <span className="font-medium text-gray-600">Key:</span> {f.key}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Folder: <b>{f.folder || "-"}</b> • Size: <b>{bytesToKB(f.size)} KB</b> •{" "}
                          Updated: <b>{formatDate(f.updatedAt)}</b>
                          {f.status ? (
                            <>
                              {" "}
                              •{" "}
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold
                                  ${
                                    String(f.status).toLowerCase() === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                              >
                                {String(f.status)}
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => openFile(f.key)}
                        className="px-3 py-2 rounded-lg border border-border-color bg-white hover:bg-gray-50 text-sm font-semibold text-primary"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(f)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-sm font-semibold text-red-700 disabled:opacity-60"
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="bg-white border border-border-color rounded-xl p-8 text-center text-gray-500">
            No files match your filters.
          </div>
        )}
      </div>
    </div>
  );
}