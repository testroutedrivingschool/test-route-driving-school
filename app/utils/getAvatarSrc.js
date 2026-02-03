export default function getAvatarSrc(user) {
  if (!user) return "/profile-avatar.png";

  // 1) MinIO key (preferred)
  const key = user.photoKey || user.authorImageKey;
  if (key) {
    return `/api/storage/proxy?key=${encodeURIComponent(key)}`;
  }

  // 2) Already proxied (stored as full proxy path)
  const proxied = user.photo || user.authorImage;
  if (typeof proxied === "string" && proxied.startsWith("/api/storage/proxy")) {
    return proxied;
  }

  // 3) Direct external URL (Google / legacy)
  const url = user.photo || user.authorImage;
  if (
    typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://"))
  ) {
    return url;
  }

  // 4) fallback
  return "/profile-avatar.png";
}
