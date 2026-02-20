"use client";

import React, {useRef, useState} from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import PrimaryBtn from "@/app/shared/Buttons/PrimaryBtn";
import LoadingSpinner from "@/app/shared/ui/LoadingSpinner";
import useAuth from "@/app/hooks/useAuth";
import {toast} from "react-toastify";

function formatAUDateTime(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
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

export default function InstructorFiles() {
  const {user} = useAuth();
  const email = (user?.email || "").toLowerCase();
  const createdBy = user?.name || user?.displayName || email || "—";

  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    data: files = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["instructor-files", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axios.get(
        `/api/instructor-files?email=${encodeURIComponent(email)}`,
      );
      return res.data;
    },
  });

  const handleUpload = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      // 1) get presigned uploadUrl + key (folder = documents/invoices/images)
      // choose folder: images for jpg/png/webp, documents for pdf
      const folder = file.type === "application/pdf" ? "documents" : "images";

      const {data: up} = await axios.post("/api/storage/upload-url", {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        folder,
      });

      // 2) upload directly to S3/MinIO
      await axios.put(up.uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 3) save metadata in DB instructor-wise
      await axios.post("/api/instructor-files", {
        instructorEmail: email,
        createdBy,
        key: up.key,
        originalName: file.name,
        size: file.size,
      });

      toast.success("Uploaded!");
      await refetch();
    } catch (err) {
   
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    await handleUpload(f);
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    await handleUpload(f);
  };

  const openFile = async (key) => {
    try {
      const {data} = await axios.post("/api/storage/download-url", {key});
      if (data?.url) window.open(data.url, "_blank", "noopener,noreferrer");
      else toast.error("Failed to get download URL");
    } catch (err) {
    
      toast.error("Failed to open file");
    }
  };

  if (!email) return <div className="p-4">Please login.</div>;
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-white rounded-md border border-gray-200 p-6">
      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`w-full rounded-md border-2 border-dashed p-10 text-center cursor-pointer select-none
          ${dragOver ? "border-primary bg-gray-50" : "border-blue-400"}
        `}
      >
        <div className="text-lg font-semibold text-gray-700">
          Upload files here
        </div>

        <div className="mt-3 flex justify-center">
          <PrimaryBtn disabled={uploading}>
            {uploading ? "Uploading..." : "Choose File"}
          </PrimaryBtn>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {/* Table */}
      <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-secondary text-white">
              <tr>
                <th className="text-left px-4 py-2">File Name</th>
                <th className="text-left px-4 py-2">Created by</th>
                <th className="text-left px-4 py-2">Last Modified</th>
                <th className="text-right px-4 py-2">Size</th>
              </tr>
            </thead>

            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No files uploaded yet.
                  </td>
                </tr>
              ) : (
                files.map((f, idx) => (
                  <tr
                    onClick={() => openFile(f.key)}
                    key={f._id || f.key}
                    className={idx % 2 ? "bg-gray-50 cursor-pointer" : "bg-white cursor-pointer"}
                  >
                    <td className="px-4 py-3">
                      <button
                        className="text-primary hover:underline"
                        type="button"
                      >
                        {f.originalName}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-primary">
                      {f.createdBy || "—"}
                    </td>
                    <td className="px-4 py-3 text-primary">
                      {formatAUDateTime(f.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right text-primary">
                      {formatSize(f.size)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2 text-xs text-gray-500">
          {isFetching ? "Refreshing..." : ""}
        </div>
      </div>
    </div>
  );
}
