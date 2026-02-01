"use client";

import { useState } from "react";

export default function FileUpload({ folder, onUploaded }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Ask your server for a signed upload URL
      const res = await fetch("/api/storage/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder, // "documents" | "invoices" | "images"
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get upload URL");

      // 2️⃣ Upload directly to MinIO
      const upload = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!upload.ok) throw new Error("Upload failed");

      // 3️⃣ Notify parent (save key to DB)
      onUploaded(data.key);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleChange}
        disabled={loading}
      />
      {loading && <p>Uploading…</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
