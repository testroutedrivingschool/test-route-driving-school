import axios from "axios";

export const uploadProfilePhotoToMinio = async (file) => {
  // 1) get signed upload URL from your server
  const { data } = await axios.post("/api/storage/upload-url", {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    folder: "images", // private images folder
  });

  // 2) upload directly to MinIO
  await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  // 3) return key to store in DB
  return data.key; // e.g. "images/uuid.webp"
};